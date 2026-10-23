import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (city.trim()) onSearch(city.trim())
  }

  return (
    <form onSubmit={submit} className="flex gap-3 max-w-xl mx-auto">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city name…"
        className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 
                   placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 
                   font-semibold disabled:opacity-50 transition"
      >
        {loading ? 'Searching…' : 'Explore 🚀'}
      </button>
    </form>
  )
}
