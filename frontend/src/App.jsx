
import { useMemo, useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherBanner from './components/WeatherBanner'
import AttractionCard from './components/AttractionCard'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/+$/, '')

const CATEGORIES = ['All places', 'Heritage', 'Nature', 'Museum', 'Wildlife', 'Architecture']

const DESTINATIONS = [
  { name: 'Mysuru', country: 'India', emoji: '🏰', subtitle: 'Royal heritage and timeless charm' },
  { name: 'Hyderabad', country: 'India', emoji: '🌆', subtitle: 'A city of culture and cuisine' },
  { name: 'Paris', country: 'France', emoji: '🗼', subtitle: 'Art, romance and grand boulevards' },
]

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [weatherError, setWeatherError] = useState('')
  const [source, setSource] = useState('')
  const [activeCategory, setActiveCategory] = useState('All places')
  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wanderai-saved') || '[]')
    } catch {
      return []
    }
  })
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const searchCity = async (cityName) => {
    const query = cityName.trim()
    if (!query || loading) return

    setLoading(true)
    setError('')
    setWeatherError('')
    setWeather(null)
    setAttractions([])
    setCity('')
    setSource('')
    setActiveCategory('All places')
    setShowSavedOnly(false)

    const encodedCity = encodeURIComponent(query)

    try {
      const [weatherResult, attractionResult] = await Promise.allSettled([
        fetch(`${API_URL}/api/weather/${encodedCity}`),
        fetch(`${API_URL}/api/attractions/${encodedCity}`),
      ])

      if (attractionResult.status === 'rejected') {
        throw new Error('Cannot connect to WanderAI. Check that the backend is running.')
      }

      const response = attractionResult.value
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || `Could not load attractions (${response.status}).`)
      }

      setCity(data.city || query)
      setAttractions(data.attractions || [])
      setSource(data.source || 'unknown')

      if (weatherResult.status === 'fulfilled') {
        const weatherResponse = weatherResult.value
        const weatherData = await weatherResponse.json().catch(() => ({}))

        if (weatherResponse.ok) {
          setWeather(weatherData)
        } else {
          setWeatherError(weatherData.detail || 'Weather is temporarily unavailable.')
        }
      } else {
        setWeatherError('Weather is temporarily unavailable.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleSaved = (place) => {
    const key = `${place.name}-${place.lat}-${place.lon}`
    const exists = savedPlaces.some((item) => item.key === key)
    const next = exists
      ? savedPlaces.filter((item) => item.key !== key)
      : [...savedPlaces, { key, name: place.name, lat: place.lat, lon: place.lon, city }]

    setSavedPlaces(next)
    try {
      localStorage.setItem('wanderai-saved', JSON.stringify(next))
    } catch {
      // The page still works if browser storage is unavailable.
    }
  }

  const filteredAttractions = useMemo(() => {
    return attractions.filter((place) => {
      const category = (place.category || place.type || '').toLowerCase()
      const matchesCategory =
        activeCategory === 'All places' ||
        category.includes(activeCategory.toLowerCase()) ||
        (activeCategory === 'Heritage' && /palace|fort|heritage|historic/i.test(place.name)) ||
        (activeCategory === 'Nature' && /garden|hill|lake|park/i.test(place.name)) ||
        (activeCategory === 'Museum' && /museum|gallery/i.test(place.name)) ||
        (activeCategory === 'Wildlife' && /zoo|wildlife/i.test(place.name)) ||
        (activeCategory === 'Architecture' && /cathedral|temple|church/i.test(place.name))

      const isSaved = savedPlaces.some(
        (item) => item.key === `${place.name}-${place.lat}-${place.lon}`
      )

      return matchesCategory && (!showSavedOnly || isSaved)
    })
  }, [attractions, activeCategory, savedPlaces, showSavedOnly])

  const isDark = darkMode

  return (
    <main className={isDark ? 'app-shell dark-theme' : 'app-shell light-theme'}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="site-container">
        <header className="topbar">
          <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="brand-mark">W</span>
            <span>Wander<span className="accent-text">AI</span></span>
          </button>

          <nav className="top-nav" aria-label="Main navigation">
            <a href="#explore">Explore</a>
            <a href="#destinations">Destinations</a>
            <a href="#saved" onClick={() => setShowSavedOnly(true)}>Saved places</a>
          </nav>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode((value) => !value)}
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> YOUR NEXT STORY STARTS HERE</div>
            <h1>Somewhere<br />wonderful <span className="accent-text">awaits.</span></h1>
            <p className="hero-description">
              Find remarkable places, uncover local stories, and turn your next trip into something unforgettable.
            </p>

            <div className="hero-search">
              <SearchBar onSearch={searchCity} loading={loading} />
            </div>

            <div className="hero-footnote">
              <span>✦</span> Discover beyond the ordinary
              <span className="footnote-divider">·</span>
              Powered by live data when available
            </div>
          </div>

          <div className="hero-art" aria-label="Travel inspiration">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-glow" />
            <div className="hero-monogram">W.</div>
            <div className="floating-note note-top">
              <span className="note-icon">✧</span>
              <span><strong>Find your wonder</strong><small>One city at a time</small></span>
            </div>
            <div className="floating-note note-bottom">
              <span className="note-pin">⌖</span>
              <span><strong>Made for explorers</strong><small>Curiosity is the itinerary</small></span>
            </div>
            <div className="hero-stamp">GO<br />SOMEWHERE<br /><span>NEW ↗</span></div>
          </div>
        </section>

        <section id="destinations" className="destination-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">A LITTLE INSPIRATION</p>
              <h2>Where to next?</h2>
            </div>
            <span className="section-aside">Start with a favourite</span>
          </div>

          <div className="destination-grid">
            {DESTINATIONS.map((destination) => (
              <button
                key={destination.name}
                className={`destination-card destination-${destination.name.toLowerCase()}`}
                onClick={() => searchCity(destination.name)}
                disabled={loading}
              >
                <span className="destination-emoji">{destination.emoji}</span>
                <span className="destination-info">
                  <strong>{destination.name}</strong>
                  <small>{destination.subtitle}</small>
                </span>
                <span className="destination-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div role="alert" className="status-message error-message">
            <span>!</span><p>{error}</p>
          </div>
        )}

        {loading && (
          <section className="loading-panel" role="status">
            <div className="loading-orb">✦</div>
            <h2>Finding your next favourite place</h2>
            <p>Gathering attractions and destination details…</p>
            <div className="loading-track"><span /></div>
          </section>
        )}

        {!loading && city && !error && (
          <>
            {weather && <WeatherBanner weather={weather} />}
            {weatherError && <p className="weather-note">{weatherError}</p>}

            <section id="explore" className="explore-section">
              <div className="section-heading explore-heading">
                <div>
                  <p className="section-kicker">THE CITY, UNFOLDED</p>
                  <h2>Explore <span className="accent-text">{city}</span></h2>
                  <p className="result-caption">
                    {attractions.length} places to add to your story
                    {source === 'demo' && <span className="demo-label">DEMO DATA</span>}
                  </p>
                </div>

                <button
                  id="saved"
                  className={`saved-filter ${showSavedOnly ? 'selected' : ''}`}
                  onClick={() => setShowSavedOnly((value) => !value)}
                >
                  ♡ Saved ({savedPlaces.length})
                </button>
              </div>

              <div className="filter-row" aria-label="Filter attractions">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {filteredAttractions.length ? (
                <div className="attraction-grid">
                  {filteredAttractions.map((attraction, index) => {
                    const key = `${attraction.name}-${attraction.lat}-${attraction.lon}`
                    const saved = savedPlaces.some((item) => item.key === key)

                    return (
                      <div className="attraction-wrap" key={`${key}-${index}`}>
                        <button
                          className={`bookmark-button ${saved ? 'is-saved' : ''}`}
                          aria-label={saved ? `Remove ${attraction.name} from saved places` : `Save ${attraction.name}`}
                          onClick={() => toggleSaved(attraction)}
                        >
                          {saved ? '♥' : '♡'}
                        </button>
                        <AttractionCard attraction={attraction} />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <span>✧</span>
                  <h3>{showSavedOnly ? 'No saved places yet' : 'Nothing in this category just yet'}</h3>
                  <p>{showSavedOnly ? 'Tap the heart on any attraction to keep it here.' : 'Try another category to discover more.'}</p>
                  <button className="text-button" onClick={() => { setShowSavedOnly(false); setActiveCategory('All places') }}>
                    Show all places ↗
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {!loading && !city && !error && (
          <section className="welcome-strip">
            <span className="welcome-icon">✳</span>
            <div>
              <strong>Your map is still full of possibilities.</strong>
              <p>Search a city above or choose a destination to begin exploring.</p>
            </div>
          </section>
        )}

        <footer className="site-footer">
          <a className="footer-brand" href="#">Wander<span className="accent-text">AI</span></a>
          <span>Built for the curious. Made for the journey.</span>
          <span>✦ Explore more, plan smarter.</span>
        </footer>
      </div>
    </main>
  )
}
