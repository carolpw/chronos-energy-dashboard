import torch
import pandas as pd
from chronos import BaseChronosPipeline

class ChronosForecaster:
    def __init__(self):
        self.pipeline = BaseChronosPipeline.from_pretrained(
            "amazon/chronos-bolt-base",  # Smaller, CPU-friendly model
            device_map="cpu",
            torch_dtype=torch.bfloat16,
        )

    def predict(self, data: pd.Series, prediction_length: int = 24, quantiles: list = [0.5]):
        """
        Predict future values using Chronos pipeline.
        Returns a 2D list: [quantile][forecast_length]
        """
        # Convert series to tensor
        context_tensor = torch.tensor(data.values, dtype=torch.float32)

        # Get forecast: [num_series, num_quantiles, pred_length]
        forecast = self.pipeline.predict(
            context=context_tensor,
            prediction_length=prediction_length
        )

        # Select desired quantiles
        # Chronos Bolt has quantiles in order [0.1, 0.5, 0.9] by default
        quantile_map = {0.1: 0, 0.5: 1, 0.9: 2}
        selected_indices = [quantile_map[q] for q in quantiles]

        # Slice to keep 2D: [num_quantiles, prediction_length]
        forecast_selected = forecast[0, selected_indices, :]

        # Return as standard Python list
        return forecast_selected.tolist()
