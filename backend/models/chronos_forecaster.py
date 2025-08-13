# Model loading and prediction logic (Chronos AI model)

import torch
import pandas as pd
from chronos import BaseChronosPipeline

class ChronosForecaster:
    def __init__(self):
        self.pipeline = BaseChronosPipeline.from_pretrained(
            "amazon/chronos-bolt-small",
            device_map="cpu",
            torch_dtype=torch.bfloat16,
        )

    def predict(self, data: pd.Series, prediction_length: int = 24):
        context_tensor = torch.tensor(data.values, dtype=torch.float32)
        forecast = self.pipeline.predict(context=context_tensor, prediction_length=prediction_length)
        print("Forecast shape:", forecast.shape)
        return forecast[0]
