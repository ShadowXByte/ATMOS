'use client';

import { useState, useEffect } from 'react';
import './globals.css';
interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
}

export default function Home() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (searchCity: string) => {
    setLoading(true);
    setError('');

    try {
      const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(searchCity)}`);
      const weatherData = await weatherRes.json();

      if (!weatherRes.ok) {
        throw new Error(weatherData.error || 'Failed to fetch weather');
      }

      setWeather(weatherData);

      const forecastRes = await fetch(`/api/forecast?city=${encodeURIComponent(searchCity)}`);
      const forecastData = await forecastRes.json();

      if (forecastRes.ok) {
        setForecast(forecastData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const weatherRes = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
            const weatherData = await weatherRes.json();

            if (!weatherRes.ok) {
              throw new Error(weatherData.error || 'Failed to fetch weather');
            }

            setWeather(weatherData);
            setCity(weatherData.name);

            const forecastRes = await fetch(`/api/forecast?lat=${latitude}&lon=${longitude}`);
            const forecastData = await forecastRes.json();

            if (forecastRes.ok) {
              setForecast(forecastData);
            }

            setError('');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('Unable to get your location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDailyForecast = () => {
    if (!forecast) return [];
    
    const dailyData: { [key: string]: any } = {};
    
    forecast.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date: item.dt_txt,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          weather: item.weather[0],
        };
      } else {
        dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
        dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
      }
    });

    return Object.values(dailyData).slice(0, 5);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">ATMOS</h1>
          <p className="text-blue-100 text-lg">Your Weather Companion</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl mb-6">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-blue-100 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-semibold rounded-xl border border-white/30 transition-all"
            >
              Search
            </button>
            <button
              type="button"
              onClick={fetchWeatherByLocation}
              disabled={loading}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-semibold rounded-xl border border-white/30 transition-all"
              title="Use my location"
            >
              📍
            </button>
          </form>

          {error && (
            <div className="bg-red-500/20 border border-red-300/50 text-white px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center text-white py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4">Loading weather data...</p>
            </div>
          )}

          {weather && !loading && (
            <div className="text-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-1">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="text-blue-100 text-lg capitalize">
                  {weather.weather[0].description}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                <div className="flex items-center">
                  <img
                    src={getWeatherIcon(weather.weather[0].icon)}
                    alt={weather.weather[0].description}
                    className="w-32 h-32"
                  />
                  <div className="text-6xl md:text-7xl font-bold">
                    {Math.round(weather.main.temp)}°C
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">Feels Like</p>
                  <p className="text-2xl font-semibold">{Math.round(weather.main.feels_like)}°C</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">Humidity</p>
                  <p className="text-2xl font-semibold">{weather.main.humidity}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">Wind Speed</p>
                  <p className="text-2xl font-semibold">{Math.round(weather.wind.speed * 3.6)} km/h</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">Pressure</p>
                  <p className="text-2xl font-semibold">{weather.main.pressure} hPa</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">🌅 Sunrise</p>
                  <p className="text-xl font-semibold">{formatTime(weather.sys.sunrise)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">🌇 Sunset</p>
                  <p className="text-xl font-semibold">{formatTime(weather.sys.sunset)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {forecast && !loading && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">5-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {getDailyForecast().map((day: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
                >
                  <p className="text-blue-100 text-sm mb-2">{formatDate(day.date)}</p>
                  <img
                    src={getWeatherIcon(day.weather.icon)}
                    alt={day.weather.description}
                    className="w-16 h-16 mx-auto"
                  />
                  <p className="text-white text-xs capitalize mb-2">{day.weather.description}</p>
                  <div className="flex justify-center gap-2 text-white">
                    <span className="font-semibold">{Math.round(day.temp_max)}°</span>
                    <span className="text-blue-200">{Math.round(day.temp_min)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="text-center mt-8">
          <div className="mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-2xl font-bold tracking-wider drop-shadow-lg">
              ✨ ShadowXByte ✨
            </span>
          </div>
          <p className="text-white/60 text-xs">Powered by Open-Meteo API</p>
        </footer>
      </div>
    </main>
  );
}
