import React, { useEffect, useState } from 'react'
import { ART_STYLES } from '../services/pollinations'

const LOADING_MESSAGES = [
  '正在播撒故事种子...',
  '小精灵正在创作插图...',
  '让文字活起来吧...',
  '故事正在慢慢生长...',
  '马上就好，请稍候...',
  '魔法故事即将登场！',
]

const LOADING_MESSAGES_EN = [
  'Planting story seeds...',
  'Little elves are drawing illustrations...',
  'Making words come alive...',
  'Your story is growing...',
  'Almost ready, please wait...',
  'The magic story is coming!',
]

export default function LoadingScreen({ prompt, artStyleKey }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [dotCount, setDotCount] = useState(1)
  const style = ART_STYLES[artStyleKey] || ART_STYLES.cartoon

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 2500)
    const dotTimer = setInterval(() => {
      setDotCount((d) => (d % 3) + 1)
    }, 500)
    return () => {
      clearInterval(msgTimer)
      clearInterval(dotTimer)
    }
  }, [])

  const dots = '.'.repeat(dotCount)

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-amber-50 to-orange-50 flex flex-col items-center justify-center px-4">
      {/* Background decorations */}
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

      {/* Main loading card */}
      <div className="relative z-10 card max-w-md w-full text-center animate-fade-in">
        {/* Book animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div
              className="text-8xl book-animate select-none"
              style={{ display: 'inline-block' }}
            >
              📖
            </div>
            <div className="absolute -right-2 -top-2">
              <span className="text-2xl animate-bounce-slow">✨</span>
            </div>
          </div>
        </div>

        {/* Art style badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${style.gradient} text-white text-sm font-bold mb-6 shadow-md`}>
          <span>{style.emoji}</span>
          <span>{style.name} {style.nameEn}</span>
        </div>

        {/* Story prompt */}
        <div className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-xs text-amber-600 font-semibold mb-1">正在为您创作 / Creating for you</p>
          <p className="text-gray-700 font-bold text-sm line-clamp-2">{prompt}</p>
        </div>

        {/* Loading message */}
        <div className="mb-6">
          <p className="text-lg font-bold text-gray-700 h-7 transition-all duration-500">
            {LOADING_MESSAGES[msgIndex]}
          </p>
          <p className="text-sm text-gray-400 h-5 transition-all duration-500">
            {LOADING_MESSAGES_EN[msgIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-amber-100 rounded-full h-2.5 mb-4 overflow-hidden">
          <div
            className={`h-2.5 rounded-full bg-gradient-to-r ${style.gradient} animate-pulse`}
            style={{ width: '75%' }}
          />
        </div>

        <p className="text-amber-500 font-bold text-lg">{dots}</p>

        {/* Tips */}
        <div className="mt-6 pt-4 border-t border-amber-100">
          <p className="text-xs text-gray-400">
            AI正在生成专属故事，大约需要15-30秒
          </p>
          <p className="text-xs text-gray-300 mt-1">
            AI is generating your unique story, about 15-30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}
