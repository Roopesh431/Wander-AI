export default function AttractionCard({ attraction }) {
  const { name, type, ai } = attraction

  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-5 
                    hover:bg-white/15 transition flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold leading-tight">{name}</h3>
        <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-1 rounded-full whitespace-ml capitalize">
          {type}
        </span>
      </div>

      <p className="text-slate-300 text-sm mb-4 flex-1">
        {ai?.description || 'No description available.'}
      </p>

      <div className="space-y-2 text-sm">
        <p>💰 <span className="text-slate-400">Entry:</span> {ai?.entry_price || '—'}</p>
        <p>🕐 <span className="text-slate-400">Best time:</span> {ai?.best_time || '—'}</p>
        {ai?.tips && <p>💡 <span className="text-slate-400">Tip:</span> {ai.tips}</p>}
        {ai?.transport?.length > 0 && (
          <p>🚌 <span className="text-slate-400">Getting there:</span> {ai.transport.join(' · ')}</p>
        )}
      </div>

      {attraction.lat && attraction.lon && (
        <a
          href={`https://www.google.com/maps?q=attraction.lat,{attraction.lat},attraction.lat,{attraction.lon}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 text-center text-amber-400 hover:text-amber-300 text-sm font-semibold"
        >
          📍 View on Map →
        </a>
      )}
    </div>
  )
}
