import React, { useEffect, useState } from 'react'
import { ART_STYLES } from '../services/pollinations'

const STEPS = [
  { zh: '构思故事情节...', en: 'Crafting the story...', duration: 8000 },
  { zh: '撰写中英文剧本...', en: 'Writing bilingual script...', duration: 10000 },
  { zh: '准备插画描述...', en: 'Preparing illustrations...', duration: 7000 },
  { zh: '即将完成，稍候...', en: 'Almost done, hang tight...', duration: 999999 },
]

export default function LoadingScreen({ prompt, artStyleKey }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const style = ART_STYLES[artStyleKey] || ART_STYLES.cartoon

  useEffect(() => {
    let cumulative = 0
    const timers = STEPS.slice(0, -1).map((step, i) => {
      cumulative += step.duration
      return setTimeout(() => setStepIndex(i + 1), cumulative)
    })
    const elapsedTimer = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => {
      timers.forEach(clearTimeout)
      clearInterval(elapsedTimer)
    }
  }, [])

  const progressPct = Math.min(95, (stepIndex / (STEPS.length - 1)) * 85 + elapsed * 0.3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-amber-50 to-orange-50 flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {['✨', '🌟', '⭐', '💫', '🌙', '🌈', '🦋', '🌺'].map((star, i) => (
          <span
            key={i}
            className="absolute text-2xl floating-star opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 2)}s`,
            }}
          >
            {star}
          </span>
        ))}
      </div>

      <div className="relative z-10 card max-w-md w-full text-center animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="text-8xl book-animate select-none" style={{ display: 'inline-block' }}>
              📖
            </div>
            <div className="absolute -right-2 -top-2">
              <span className="text-2xl animate-bounce-slow">✨</span>
            </div>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${style.gradient} text-white text-sm font-bold mb-5 shadow-md`}>
          <span>{style.emoji}</span>
          <span>{style.name} · {style.nameEn}</span>
        </div>

        <div className="mb-5 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-600 font-semibold mb-1">正在为您创作 / Creating for you</p>
          <p className="text-gray-700 font-bold text-sm line-clamp-2">{prompt}</p>
        </div>

        {/* Progress steps */}
        <div className="mb-5 space-y-2 text-left">
          {STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-500 ${
              i < stepIndex ? 'opacity-50' : i === stepIndex ? 'bg-amber-50 border border-amber-200' : 'opacity-30'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-300 ${
                i < stepIndex
                  ? 'bg-green-400 text-white'
                  : i === stepIndex
                  ? `bg-gradient-to-r ${style.gradient} text-white animate-pulse`
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <div>
                <p className={`text-xs font-bold ${i === stepIndex ? 'text-gray-700' : 'text-gray-400'}`}>{step.zh}</p>
                <p className={`text-xs ${i === stepIndex ? 'text-gray-400' : 'text-gray-300'}`}>{step.en}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-amber-100 rounded-full h-2.5 mb-3 overflow-hidden">
          <div
            className={`h-2.5 rounded-full bg-gradient-to-r ${style.gradient} transition-all duration-1000 ease-out`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400 font-medium">
          <span>已用时 {elapsed}秒 / {elapsed}s elapsed</span>
          <span>约需15-30秒 / ~15-30s</span>
        </div>
      </div>
    </div>
  )
}
