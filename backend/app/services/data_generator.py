def generate_mock_data(intervals: int = 96):
    """
    Generates realistic temperature prediction data for a smart electric water heater
    in a small commercial European office building.

    Uses 15-minute intervals with realistic temperature patterns including:
    - Base temperature with gradual heating trend
    - Sensor noise/fluctuations
    - Nighttime cooldown periods
    - Usage-based temperature dips
    - Safety temperature limits

    Args:
        intervals: Number of 15-minute intervals (default 96 = 24 hours)

    Returns a pandas DataFrame with timestamps and temperature values.
    """
    import pandas as pd
    import numpy as np
    from datetime import datetime

    # Current datetime (end of simulated time series)
    now = datetime.now()

    # Create time series with 15-minute intervals ending at 'now'
    timestamps = pd.date_range(end=now, periods=intervals, freq="15min")

    # Initialize base temperature (°C) — tank setpoint in standby (overnight)
    base_temp = 58

    # Simulate natural heating trend (e.g., solar gain or reheating during active hours)
    trend = np.linspace(0, 4.5, intervals)  # small linear rise over the day

    # Simulate sensor/controller fluctuations (~±0.3°C)
    noise = np.random.normal(0, 0.3, intervals)

    # Combine base + trend + noise
    temperature = base_temp + trend + noise

    # Simulate nighttime cooldown (00:00–06:00): lower demand and less heating
    for i, ts in enumerate(timestamps):
        if ts.hour < 6:
            temperature[i] -= 2  # minor dip to simulate idle hours

    # Simulate sudden demand dips (e.g., usage in restrooms or kitchenette)
    # Convert time-based events to 15-minute interval indices
    dip_intervals = [32, 50, 60]  # approximately 08:00, 12:30, 15:00 (32*15min=8hrs, etc.)
    for dip_interval in dip_intervals:
        if dip_interval < intervals:
            # Apply temperature drop for this interval and next 2 intervals (45 minutes total)
            end_interval = min(dip_interval + 3, intervals)
            drop_length = end_interval - dip_interval
            temperature[dip_interval:end_interval] -= np.linspace(0, 5, drop_length)  # 5°C drop

    # Clip to minimum temperature (safety threshold)
    temperature = np.clip(temperature, 45, 75)

    # Return as DataFrame
    return pd.DataFrame({
        "timestamp": timestamps,
        "target": temperature,
    })