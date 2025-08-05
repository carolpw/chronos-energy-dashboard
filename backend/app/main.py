# main.py - Unified FastAPI app with routing and forecast logic

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

# Assume these modules exist elsewhere in your project
from app.models.chronos_forecaster import ChronosForecaster
from app.services.data_generator import generate_mock_data


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
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


forecaster = ChronosForecaster()


@app.get("/forecast", response_model=ForecastResponse)
def get_forecast():
    df = generate_mock_data(intervals=4*12)
    forecast_result = forecaster.predict(df["target"], prediction_length=24)  # 12 hours

    timestamps = list(df["timestamp"])
    return ForecastResponse(
        timestamps=timestamps,
        actual=df["target"].tolist(),
        forecast=forecast_result.tolist(),
    )
