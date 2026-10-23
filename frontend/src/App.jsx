import { useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherBanner from './components/WeatherBanner'
import AttractionCard from './components/AttractionCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchCity = async (searchCity) => {
    setLoading(true)
    setError('')
    setWeather(null)
    setAttractions([])
    try {
      const [wRes, aRes] = await Promise.all([
        fetch(`APIURL/api/weather/{API_URL}/api/weather/APIU​RL/api/weather/{searchCity}`),
        fetch(`APIURL/api/attractions/{API_URL}/api/attractions/APIU​RL/api/attractions/{searchCity}`),
      ])
      if (!wRes.ok || !aRes.ok) throw new Error('City not found or service error')
      const wData = await wRes.json()
      const aData = await aRes.json()
      setWeather(wData)
      setAttractions(aData.attractions || [])
      setCity(searchCity)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3">
            🌍 Wander<span className="text-amber-400">AI</span>
          </h1>
          <p className="text-slate-300 text-lg">
            Live tourist attractions, AI-powered details — anywhere in the world
          </p>
        </header>

        <SearchBar onSearch={searchCity} loading={loading} />

        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-500 rounded-xl p-4 text-center">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="mt-10 text-center">
            <div className="animate-spin text-4xl mb-4">🌍</div>
            <p className="text-slate-300">Fetching live data & AI insights… (first search takes ~30s)</p>
          </div>
        )}

        {weather && !loading && <WeatherBanner weather={weather} />}

        {attractions.length > 0 && !loading && (
          <>
            <h2 className="text-2xl font-bold mt-10 mb-5">
              Top Attractions in {city} ({attractions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions.map((a) => (
                <AttractionCard key={a.name} attraction={a} />
              ))}
            </div>
          </>
        )}

        {!city && !loading && (
          <div className="mt-16 text-center text-slate-400">
            <p className="text-6xl mb-4">🧳</p>
            <p>Search a city to begin — try "Mysuru", "Paris", or "Tokyo"</p>
          </div>
        )}
      </div>
    </div>
  )
}
