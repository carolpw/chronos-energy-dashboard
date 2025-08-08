def generate_mock_data(intervals: int = 96, base_temp: float = 58.0):
    """
    Generates realistic temperature data for a smart electric water heater in a small
    commercial European office building using 15-minute intervals.

    Args:
        intervals (int): Number of 15-minute intervals (96 = 24 hours).
        base_temp (float): Default standby temperature setpoint of the water heater.

    Returns:
        pd.DataFrame: DataFrame with 'timestamp' and 'target' (temperature in °C).
    """
    import pandas as pd
    import numpy as np
    from datetime import datetime, timedelta

    np.random.seed(42)
    now = datetime.now()
    timestamps = pd.date_range(end=now, periods=intervals, freq="15min")

    # Initialize temperature array
    temperature = np.full(intervals, base_temp)

    # Define working hours and typical usage periods
    work_start = 8
    lunch_start = 12
    lunch_end = 13
    work_end = 18

    for i, ts in enumerate(timestamps):
        hour = ts.hour
        minute = ts.minute
        time_of_day = hour + minute / 60.0

        # Weekday flag: Simulate reduced/no usage on weekends
        is_weekday = ts.weekday() < 5

        if not is_weekday:
            # Weekend: little to no demand, small cooling effect
            temperature[i] -= np.random.uniform(1.0, 2.0)
        else:
            # Simulate temperature dips during usage spikes
            if 8 <= time_of_day < 9:
                temperature[i] -= np.random.uniform(2, 4)
            elif lunch_start <= time_of_day < lunch_end:
                temperature[i] -= np.random.uniform(3, 5)
            elif 15 <= time_of_day < 16:
                temperature[i] -= np.random.uniform(1.5, 3.5)

            # Reheating logic: bring back to setpoint if temp dropped below threshold
            if i > 0 and temperature[i] < base_temp - 1.0:
                # Simulate gradual reheat over ~3 intervals (45 min)
                temp_prev = temperature[i - 1]
                recovery = np.random.uniform(0.5, 1.5)
                temperature[i] = min(base_temp + 1.5, temp_prev + recovery)

        # Nighttime cooling: low usage and reduced heater activity
        if time_of_day < 6 or time_of_day >= 22:
            temperature[i] -= np.random.uniform(0.5, 1.5)

        # Add sensor noise
        temperature[i] += np.random.normal(0, 0.25)

    # Clamp to safe physical bounds
    temperature = np.clip(temperature, 45, 75)

    return pd.DataFrame({
        "timestamp": timestamps,
        "target": temperature
    })