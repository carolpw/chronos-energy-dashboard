from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from mangum import Mangum
import os

# Force HuggingFace cache to /tmp (Lambda writable)
os.environ["HF_HOME"] = "/tmp/huggingface"

from models.chronos_forecaster import ChronosForecaster
from services.data_generator import generate_mock_data

# Pydantic models
from pydantic import BaseModel
from typing import List

class ForecastResponse(BaseModel):
    timestamps: List[datetime]
    actual: List[float]
    forecast: List[List[float]]  # [quantile][forecast_length]

# Initialize FastAPI app
app = FastAPI(title="EuroTech Energy Management API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chronos-energy-dashboard.carolpz.workers.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy-load forecaster
forecaster = None

@app.get("/forecast", response_model=ForecastResponse)
def get_forecast():
    global forecaster
    if forecaster is None:
        forecaster = ChronosForecaster()

    full_df = generate_mock_data(intervals=96 * 7)  # 7 days history
    context_window = 48  # last 12 hours
    prediction_window = 24  # next 6 hours

    recent_df = full_df.iloc[-context_window:]

    # Predict median only, 2D shape: [1, pred_length]
    forecast_result = forecaster.predict(
        recent_df["target"], 
        prediction_length=prediction_window,
        quantiles=[0.5]  # only median
    )

    timestamps = list(recent_df["timestamp"])

    return ForecastResponse(
        timestamps=timestamps,
        actual=recent_df["target"].tolist(),
        forecast=forecast_result,  # already 2D list
    )

# Lambda handler
handler = Mangum(app)
