import React, { useState, useEffect } from 'react'
import { getHistory, deleteStory, hydrateStory } from '../utils/storage'
import { ART_STYLES } from '../services/pollinations'

function formatDate(isoString) {
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export default function HistoryPanel({ onLoadStory }) {
  const [history, setHistory] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
  }, [isOpen])

  const handleDelete = (e, id) => {
    e.stopPropagation()
    deleteStory(id)
    setHistory(getHistory())
  }

  const handleLoad = (entry) => {
    const story = hydrateStory(entry)
    onLoadStory(story)
  }

  if (history.length === 0) return null

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-white rounded-2xl shadow-md border border-amber-100 hover:border-amber-300 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <span className="font-bold text-gray-700">阅读历史</span>
          <span className="text-sm text-gray-400">Reading History</span>
          <span className="ml-1 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 animate-fade-in">
          {history.map((entry) => {
            const style = ART_STYLES[entry.artStyleKey] || ART_STYLES.cartoon
            return (
              <div
                key={entry.id}
                onClick={() => handleLoad(entry)}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-amber-50 hover:border-amber-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                {/* Art style badge */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-lg shadow-sm`}>
                  {style.emoji}
                </div>

                {/* Story info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">{entry.title}</p>
                  <p className="text-xs text-gray-400 truncate">{entry.titleEn}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-amber-500">{style.name}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{formatDate(entry.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold">
                    再读 →
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, entry.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
                    title="删除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
