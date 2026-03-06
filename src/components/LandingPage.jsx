import React, { useState } from 'react'
import { ART_STYLES } from '../services/pollinations'
import HistoryPanel from './HistoryPanel'

const EXAMPLE_PROMPTS = [
  { zh: '一只想飞的小猪', en: 'A little pig who wants to fly' },
  { zh: '会说话的大树', en: 'A talking tree' },
  { zh: '勇敢的小恐龙', en: 'A brave little dinosaur' },
  { zh: '住在月亮上的兔子', en: 'A rabbit living on the moon' },
  { zh: '爱唱歌的小鱼', en: 'A little fish who loves to sing' },
  { zh: '迷路的小星星', en: 'A little star who got lost' },
]

export default function LandingPage({ onGenerate }) {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('disney')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = prompt.trim()
    if (!trimmed) {
      setError('请输入故事主题 Please enter a story topic')
      return
    }
    if (trimmed.length < 2) {
      setError('故事主题太短了 Story topic is too short')
      return
    }
    setError('')
    onGenerate(trimmed, selectedStyle)
  }

  const handleExampleClick = (example) => {
    setPrompt(example.zh)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-amber-50 to-orange-50">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>📚</div>
        <div className="absolute top-20 right-16 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🌟</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🦋</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🌈</div>
        <div className="absolute top-1/2 left-5 text-4xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute top-1/3 right-5 text-4xl opacity-10 animate-float" style={{ animationDelay: '0.8s' }}>🌙</div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-7xl mb-4 animate-float" style={{ display: 'inline-block' }}>📖</div>
          <h1
            className="text-5xl sm:text-6xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
          >
            故事种子
          </h1>
          <p className="text-2xl font-bold text-amber-500 mb-3 tracking-widest">StorySeed</p>
          <p className="text-gray-600 text-lg font-semibold">
            为孩子创作独一无二的AI绘本故事
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Create unique AI-illustrated picture books for children
          </p>
        </div>

        {/* Main card */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit}>
            {/* Prompt input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                <span className="text-amber-500">✦</span> 输入故事主题 / Enter Story Topic
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => { setPrompt(e.target.value); setError('') }}
                  placeholder="例如：一只想飞的小猪 / e.g., A little pig who wants to fly"
                  rows={3}
                  className={`w-full px-4 py-3 rounded-2xl border-2 text-gray-800 placeholder-gray-300 resize-none transition-all duration-200 font-medium text-base focus:outline-none focus:ring-4 focus:ring-amber-200 ${
                    error ? 'border-red-300 bg-red-50' : 'border-amber-200 bg-warm-50 focus:border-amber-400'
                  }`}
                />
                {prompt && (
                  <button
                    type="button"
                    onClick={() => setPrompt('')}
                    className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {error && <p className="text-red-400 text-xs mt-1 font-semibold">{error}</p>}
            </div>

            {/* Example prompts */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 font-semibold mb-2">
                试试这些主题 / Try these topics:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button
                    key={ex.zh}
                    type="button"
                    onClick={() => handleExampleClick(ex)}
                    className="text-xs px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all duration-150 font-semibold"
                  >
                    {ex.zh}
                  </button>
                ))}
              </div>
            </div>

            {/* Art style selector */}
            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-3 text-sm">
                <span className="text-amber-500">✦</span> 选择插画风格 / Choose Art Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.values(ART_STYLES).map((style) => (
                  <button
                    key={style.key}
                    type="button"
                    onClick={() => setSelectedStyle(style.key)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                      selectedStyle === style.key
                        ? `border-amber-400 bg-amber-50 ring-2 ring-amber-300 ring-offset-1 shadow-md`
                        : `border-gray-100 bg-gray-50 hover:border-amber-200 hover:bg-amber-50`
                    }`}
                  >
                    {selectedStyle === style.key && (
                      <span className="absolute top-2 right-2 text-amber-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-xl shadow-sm`}>
                      {style.emoji}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
                        {style.name}
                      </p>
                      <p className="text-gray-400 text-xs">{style.nameEn}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg active:translate-y-0"
            >
              <span className="mr-2">✨</span>
              生成故事绘本
              <span className="ml-2 text-white/70 text-sm font-normal">Generate Story</span>
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {[
            { emoji: '🌏', zh: '中英双语', en: 'Bilingual' },
            { emoji: '🎨', zh: '4种画风', en: '4 Art Styles' },
            { emoji: '📱', zh: '翻页动画', en: 'Page Flip' },
          ].map((f) => (
            <div key={f.zh} className="text-center p-4 bg-white rounded-2xl shadow-sm">
              <div className="text-2xl mb-1">{f.emoji}</div>
              <p className="font-bold text-gray-700 text-sm">{f.zh}</p>
              <p className="text-gray-400 text-xs">{f.en}</p>
            </div>
          ))}
        </div>

        {/* Reading History */}
        <HistoryPanel onLoadStory={(story) => onGenerate(null, null, story)} />

        {/* Footer */}
        <div className="text-center mt-12 text-gray-300 text-xs">
          <p>由 Pollinations.ai 提供 AI 能力 · Powered by Pollinations.ai</p>
          <p className="mt-1">免费使用 · Free to use · 无需注册</p>
        </div>
      </div>
    </div>
  )
}
