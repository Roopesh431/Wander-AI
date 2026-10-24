
export default function AttractionCard({ attraction }) {
  const { name, type, ai, lat, lon, website, fee } = attraction

  const mapUrl =
    lat != null && lon != null
      ? `https://www.google.com/maps?q=${lat},${lon}`
      : null

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/10 p-5 transition hover:-translate-y-1 hover:bg-white/15">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold leading-tight">{name}</h3>

        <span className="shrink-0 rounded-full bg-amber-500/20 px-3 py-1 text-xs capitalize text-amber-300">
          {(type || 'attraction').replaceAll('_', ' ')}
        </span>
      </div>

      <p className="mb-5 flex-1 text-sm leading-6 text-slate-300">
        {ai?.description || 'A local place to explore. More details are unavailable right now.'}
      </p>

      <div className="space-y-3 text-sm">
        <p>
          <span className="text-slate-400">🎟️ Entry fee: </span>
          {ai?.entry_price || (fee === 'no' ? 'Free (according to map data)' : 'Not verified')}
        </p>

        <p>
          <span className="text-slate-400">🕐 Best time: </span>
          {ai?.best_time || 'Not available'}
        </p>

        {ai?.tips && (
          <p>
            <span className="text-slate-400">💡 Visitor tip: </span>
            {ai.tips}
          </p>
        )}

        {ai?.transport?.length > 0 && (
          <div>
            <p className="mb-1 text-slate-400">🚌 Transport suggestions</p>
            <ul className="list-inside list-disc space-y-1">
              {ai.transport.map((option, index) => (
                <li key={`${option}-${index}`}>{option}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            📍 Open in Maps ↗
          </a>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-sky-300 hover:text-sky-200"
          >
            Official website ↗
          </a>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        AI-generated information may be inaccurate. Verify ticket prices and transport with official sources.
      </p>
    </article>
  )
}
