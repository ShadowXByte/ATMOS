import { NextRequest, NextResponse } from 'next/server';

// Helper function to get weather code description
function getWeatherDescription(code: number): { main: string; description: string; icon: string } {
  const weatherCodes: { [key: number]: { main: string; description: string; icon: string } } = {
    0: { main: 'Clear', description: 'clear sky', icon: '01d' },
    1: { main: 'Clear', description: 'mainly clear', icon: '01d' },
    2: { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
    3: { main: 'Clouds', description: 'overcast', icon: '03d' },
    45: { main: 'Fog', description: 'fog', icon: '50d' },
    48: { main: 'Fog', description: 'depositing rime fog', icon: '50d' },
    51: { main: 'Drizzle', description: 'light drizzle', icon: '09d' },
    53: { main: 'Drizzle', description: 'moderate drizzle', icon: '09d' },
    55: { main: 'Drizzle', description: 'dense drizzle', icon: '09d' },
    61: { main: 'Rain', description: 'slight rain', icon: '10d' },
    63: { main: 'Rain', description: 'moderate rain', icon: '10d' },
    65: { main: 'Rain', description: 'heavy rain', icon: '10d' },
    71: { main: 'Snow', description: 'slight snow', icon: '13d' },
    73: { main: 'Snow', description: 'moderate snow', icon: '13d' },
    75: { main: 'Snow', description: 'heavy snow', icon: '13d' },
    77: { main: 'Snow', description: 'snow grains', icon: '13d' },
    80: { main: 'Rain', description: 'slight rain showers', icon: '09d' },
    81: { main: 'Rain', description: 'moderate rain showers', icon: '09d' },
    82: { main: 'Rain', description: 'violent rain showers', icon: '09d' },
    85: { main: 'Snow', description: 'slight snow showers', icon: '13d' },
    86: { main: 'Snow', description: 'heavy snow showers', icon: '13d' },
    95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
    96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail', icon: '11d' },
    99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11d' },
  };
  return weatherCodes[code] || { main: 'Unknown', description: 'unknown', icon: '01d' };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  let lat = searchParams.get('lat');
  let lon = searchParams.get('lon');

  try {
    // If city name is provided, geocode it first
    if (city && !lat && !lon) {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geocodeRes = await fetch(geocodeUrl);
      const geocodeData = await geocodeRes.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 404 }
        );
      }

      const location = geocodeData.results[0];
      lat = location.latitude.toString();
      lon = location.longitude.toString();
    }

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Please provide either city name or coordinates' },
        { status: 400 }
      );
    }

    // Fetch forecast data from Open-Meteo (7 days)
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    if (!forecastRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch forecast data' },
        { status: forecastRes.status }
      );
    }

    // Transform Open-Meteo response to match OpenWeatherMap format
    const transformedData = {
      list: forecastData.daily.time.map((date: string, index: number) => {
        const weatherInfo = getWeatherDescription(forecastData.daily.weather_code[index]);
        
        return {
          dt: new Date(date).getTime() / 1000,
          main: {
            temp: (forecastData.daily.temperature_2m_max[index] + forecastData.daily.temperature_2m_min[index]) / 2,
            temp_min: forecastData.daily.temperature_2m_min[index],
            temp_max: forecastData.daily.temperature_2m_max[index],
          },
          weather: [
            {
              description: weatherInfo.description,
              icon: weatherInfo.icon,
            },
          ],
          dt_txt: date + ' 12:00:00', // Midday time
        };
      }),
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    );
  }
}
