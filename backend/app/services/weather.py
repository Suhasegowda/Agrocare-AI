import httpx

WEATHER_CODES = {
    0: ("Clear", "☀️"),
    1: ("Mainly Clear", "🌤️"),
    2: ("Partly Cloudy", "⛅"),
    3: ("Cloudy", "☁️"),
    45: ("Fog", "🌫️"),
    48: ("Fog", "🌫️"),
    51: ("Light Drizzle", "🌦️"),
    61: ("Rain", "🌧️"),
    63: ("Rain", "🌧️"),
    65: ("Heavy Rain", "🌧️"),
    80: ("Showers", "🌦️"),
    81: ("Showers", "🌧️"),
    82: ("Heavy Showers", "🌧️"),
    95: ("Thunderstorm", "⛈️"),
}

COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]


def compass(degrees: float | None) -> str:
    if degrees is None:
        return ""
    index = int((float(degrees) % 360) / 45 + 0.5) % 8
    return COMPASS[index]


def condition_for(code: int | None) -> tuple[str, str]:
    if code is None:
        return "Unknown", "⛅"
    if code in WEATHER_CODES:
        return WEATHER_CODES[code]
    if 50 <= code <= 67 or 80 <= code <= 82:
        return "Rain", "🌧️"
    if 71 <= code <= 77:
        return "Snow", "❄️"
    if code >= 95:
        return "Thunderstorm", "⛈️"
    return "Mixed", "⛅"


def spray_window(rain_probability: float, wind_kmh: float) -> tuple[str, str]:
    if rain_probability > 60 or wind_kmh > 15:
        return (
            "Unfavorable",
            "Rain or strong wind makes this a poor time to spray. Wait for a drier, calmer period.",
        )
    if rain_probability > 30 or wind_kmh > 10:
        return (
            "Caution",
            "A shower or a breeze is possible. Spray only if leaves can dry, and do not treat this as a dose recommendation.",
        )
    return (
        "Optimal Window",
        "Rain risk and wind are low right now. This is only a weather window, not a recommendation to spray.",
    )


def build_weather_view(location_name: str, payload: dict) -> dict:
    current = payload.get("current", {})
    daily = payload.get("daily", {})
    rain = float(daily.get("precipitation_probability_max", [0])[0] or 0)
    wind = float(current.get("wind_speed_10m") or 0)
    humidity = int(round(current.get("relative_humidity_2m") or 0))
    status, advice = spray_window(rain, wind)
    code = current.get("weather_code")
    condition, _icon = condition_for(code)
    direction = compass(current.get("wind_direction_10m"))
    temp = int(round(current.get("temperature_2m") or 0))
    highs = daily.get("temperature_2m_max") or []
    lows = daily.get("temperature_2m_min") or []
    rains = daily.get("precipitation_probability_max") or []
    codes = daily.get("weather_code") or []
    days = daily.get("time") or []
    labels = ["Today", "Tomorrow"]
    forecast = []
    for index, day in enumerate(days[:4]):
        label = labels[index] if index < len(labels) else day[5:]
        high = int(round(highs[index])) if index < len(highs) else temp
        low = int(round(lows[index])) if index < len(lows) else temp
        day_rain = float(rains[index]) if index < len(rains) else 0
        _name, icon = condition_for(codes[index] if index < len(codes) else code)
        if day_rain > 60:
            risk, day_advice = "High", "Likely rain: a poor spray window"
        elif day_rain > 30:
            risk, day_advice = "Medium", "Possible showers"
        else:
            risk, day_advice = "Low", "Drier weather for observation"
        forecast.append({"day": label, "temp": f"{high}° / {low}°", "icon": icon, "risk": risk, "advice": day_advice})

    if humidity >= 85 or rain > 50:
        alert = {
            "level": "Warning",
            "title": "Wet foliage is more likely",
            "description": "This is a weather rule from humidity and rain chance. It is not a confirmed disease outbreak.",
        }
    else:
        alert = {
            "level": "Info",
            "title": "No elevated wetness rule today",
            "description": "Humidity and rain chance are below the simple warning rule. This is not a disease forecast.",
        }

    temp_min = int(round(lows[0])) if lows else temp
    temp_max = int(round(highs[0])) if highs else temp
    return {
        "location": location_name,
        "temp": temp,
        "tempMin": temp_min,
        "tempMax": temp_max,
        "condition": condition,
        "humidity": humidity,
        "windSpeed": f"{round(wind)} km/h {direction}".strip(),
        "rainfallProbability": int(round(rain)),
        "sprayWindowStatus": status,
        "sprayWindowAdvice": advice,
        "forecast": forecast,
        "diseaseRiskAlert": alert,
        "source": "open-meteo",
        "liveForecast": True,
    }


def fetch_open_meteo(location: str) -> tuple[str, dict]:
    query = location.strip() or "Mandya, Karnataka"
    try:
        geo = httpx.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": query, "count": 1},
            timeout=8,
        )
        geo.raise_for_status()
        results = geo.json().get("results") or []
        if not results:
            raise LookupError(f"No location match for {query}")
        place = results[0]
        name = ", ".join(part for part in [place.get("name"), place.get("admin1"), place.get("country")] if part)
        forecast = httpx.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": place["latitude"],
                "longitude": place["longitude"],
                "current": "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m",
                "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
                "wind_speed_unit": "kmh",
                "timezone": "auto",
                "forecast_days": 4,
            },
            timeout=8,
        )
        forecast.raise_for_status()
        return name, forecast.json()
    except (httpx.HTTPError, LookupError, KeyError) as exc:
        raise RuntimeError("Live weather could not be reached. No forecast was invented.") from exc
