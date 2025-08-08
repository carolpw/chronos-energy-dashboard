# main.py - Unified FastAPI app with routing and forecast logic

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

# Assume these modules exist elsewhere in your project
from models.chronos_forecaster import ChronosForecaster
from services.data_generator import generate_mock_data


# Defines request/response data shapes using Pydantic

from pydantic import BaseModel
from typing import List
from datetime import datetime

class ForecastResponse(BaseModel):
    timestamps: List[datetime]
    actual: List[float]
    forecast: List[List[float]]  # [quantile][forecast_length]


# Initialize app
app = FastAPI(title="EuroTech Energy Management API")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


forecaster = ChronosForecaster()


@app.get("/forecast", response_model=ForecastResponse)
def get_forecast():
    full_df = generate_mock_data(intervals=96 * 7)  # 7 days history
    context_window = 48  # last 12 hours (15 min * 48 = 720 min = 12h)
    prediction_window = 24  # next 6 hours (15 min * 24 = 360 min = 6h)

    recent_df = full_df.iloc[-context_window:]  # last 12 hours only
    forecast_result = forecaster.predict(full_df["target"], prediction_length=prediction_window)

    timestamps = list(recent_df["timestamp"])
    return ForecastResponse(
        timestamps=timestamps,
        actual=recent_df["target"].tolist(),
        forecast=forecast_result.tolist(),  # length 24
    )