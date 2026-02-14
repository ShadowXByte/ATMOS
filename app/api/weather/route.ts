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
    let cityName = city || 'Unknown';
    let country = '';

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
      cityName = location.name;
      country = location.country_code || location.country || '';
    }

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Please provide either city name or coordinates' },
        { status: 400 }
      );
    }

    // Fetch weather data from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=sunrise,sunset&timezone=auto`;
    
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: weatherRes.status }
      );
    }

    // Transform Open-Meteo response to match OpenWeatherMap format
    const weatherInfo = getWeatherDescription(weatherData.current.weather_code);
    
    const transformedData = {
      name: cityName,
      sys: {
        country: country.toUpperCase(),
        sunrise: new Date(weatherData.daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(weatherData.daily.sunset[0]).getTime() / 1000,
      },
      main: {
        temp: weatherData.current.temperature_2m,
        feels_like: weatherData.current.apparent_temperature,
        temp_min: weatherData.current.temperature_2m - 2, // Approximate
        temp_max: weatherData.current.temperature_2m + 2, // Approximate
        pressure: weatherData.current.surface_pressure,
        humidity: weatherData.current.relative_humidity_2m,
      },
      weather: [
        {
          id: weatherData.current.weather_code,
          main: weatherInfo.main,
          description: weatherInfo.description,
          icon: weatherInfo.icon,
        },
      ],
      wind: {
        speed: weatherData.current.wind_speed_10m / 3.6, // Convert km/h to m/s
        deg: weatherData.current.wind_direction_10m,
      },
      clouds: {
        all: 0, // Open-Meteo doesn't provide cloud coverage in this endpoint
      },
      dt: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
