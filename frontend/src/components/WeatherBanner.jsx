export default function WeatherBanner({ weather }) {
  return (
    <div className="mt-8 flex items-center justify-center gap-6 
                    bg-white/10 border border-white/20 rounded-2xl p-5 max-w-xl mx-auto">
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.condition}
        className="w-16 h-16"
      />
      <div>
        <p className="text-2xl font-bold">{weather.temp}°C — {weather.condition}</p>
        <p className="text-slate-300">
          Feels like {weather.feels_like}°C · Humidity {weather.humidity}% · {weather.city}
        </p>
      </div>
    </div>
  )
}
