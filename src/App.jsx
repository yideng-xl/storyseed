import React, { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import LoadingScreen from './components/LoadingScreen'
import StoryReader from './components/StoryReader'
import { generateStory } from './services/pollinations'
import { saveStory } from './utils/storage'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'loading' | 'reading'
  const [currentStory, setCurrentStory] = useState(null)
  const [loadingParams, setLoadingParams] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedPrompt = params.get('prompt')
    const sharedStyle = params.get('style')
    if (sharedPrompt) {
      window.history.replaceState({}, '', window.location.pathname)
      handleGenerate(sharedPrompt, sharedStyle || 'disney')
    }
  }, [])

  const handleGenerate = async (prompt, artStyleKey, preloadedStory = null) => {
    // If loading from history, skip generation
    if (preloadedStory) {
      setCurrentStory(preloadedStory)
      setView('reading')
      return
    }

    setLoadingParams({ prompt, artStyleKey })
    setErrorMessage('')
    setView('loading')

    try {
      const story = await generateStory(prompt, artStyleKey)
      saveStory(story)
      setCurrentStory(story)
      setView('reading')
    } catch (err) {
      console.error('Story generation failed:', err)
      setErrorMessage(err.message || '故事生成失败，请重试')
      setView('error')
    }
  }

  const handleBack = () => {
    setView('landing')
    setCurrentStory(null)
    setLoadingParams(null)
    setErrorMessage('')
  }

  if (view === 'loading' && loadingParams) {
    return (
      <LoadingScreen
        prompt={loadingParams.prompt}
        artStyleKey={loadingParams.artStyleKey}
      />
    )
  }

  if (view === 'reading' && currentStory) {
    return (
      <StoryReader
        story={currentStory}
        onBack={handleBack}
      />
    )
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2
            className="text-2xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
          >
            哎呀，出错了
          </h2>
          <p className="text-gray-500 mb-3">Oops, something went wrong</p>
          <div className="bg-red-50 rounded-xl px-4 py-3 mb-6 text-left">
            <p className="text-red-400 text-sm font-medium mb-1">{errorMessage}</p>
            <p className="text-gray-400 text-xs">
              网络问题或AI服务繁忙，请稍后重试。<br/>
              Network issue or AI service busy. Please try again.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => loadingParams && handleGenerate(loadingParams.prompt, loadingParams.artStyleKey)}
              className="w-full btn-primary"
            >
              重试一次 Try Again
            </button>
            <button onClick={handleBack} className="w-full btn-secondary">
              返回首页 Back Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <LandingPage onGenerate={handleGenerate} />
}
