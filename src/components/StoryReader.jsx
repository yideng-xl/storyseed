import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ART_STYLES } from '../services/pollinations'

function ShareButton({ story }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const params = new URLSearchParams({ prompt: story.prompt, style: story.artStyleKey })
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      title="分享故事 Share story"
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="hidden sm:inline">已复制 Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="hidden sm:inline">分享 Share</span>
        </>
      )}
    </button>
  )
}

function StoryImage({ src, alt, pageNum }) {
  const [status, setStatus] = useState('loading') // loading | loaded | error
  const [retryCount, setRetryCount] = useState(0)
  const imgRef = useRef(null)

  useEffect(() => {
    setStatus('loading')
  }, [src])

  const handleLoad = () => setStatus('loaded')
  const handleError = () => {
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount((c) => c + 1)
        setStatus('loading')
        if (imgRef.current) {
          imgRef.current.src = src + '&retry=' + (retryCount + 1)
        }
      }, 2000)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl overflow-hidden">
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl animate-bounce-slow">🎨</div>
          <p className="text-xs text-amber-400 mt-2 font-semibold">绘图中...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl">🖼️</div>
          <p className="text-xs text-gray-400 mt-2">插图加载失败</p>
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}

export default function StoryReader({ story, onBack }) {
  const [currentPage, setCurrentPage] = useState(-1) // -1 = cover
  const [slideClass, setSlideClass] = useState('')
  const [animating, setAnimating] = useState(false)
  const touchStartX = useRef(null)

  const totalPages = story.pages.length
  const style = ART_STYLES[story.artStyleKey] || ART_STYLES.cartoon

  const navigate = useCallback(
    (direction) => {
      if (animating) return
      const isForward = direction === 'next'
      const newPage = isForward ? currentPage + 1 : currentPage - 1
      if (newPage < -1 || newPage >= totalPages) return

      setAnimating(true)
      setSlideClass(isForward ? 'page-slide-in-right' : 'page-slide-in-left')
      setCurrentPage(newPage)

      setTimeout(() => {
        setSlideClass('')
        setAnimating(false)
      }, 400)
    },
    [animating, currentPage, totalPages]
  )

  const goToPage = useCallback(
    (pageIndex) => {
      if (animating || pageIndex === currentPage) return
      const isForward = pageIndex > currentPage
      setAnimating(true)
      setSlideClass(isForward ? 'page-slide-in-right' : 'page-slide-in-left')
      setCurrentPage(pageIndex)
      setTimeout(() => {
        setSlideClass('')
        setAnimating(false)
      }, 400)
    },
    [animating, currentPage]
  )

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate('next')
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate('prev')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [navigate])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? 'next' : 'prev')
    }
    touchStartX.current = null
  }

  const isCover = currentPage === -1
  const isLastPage = currentPage === totalPages - 1
  const page = isCover ? null : story.pages[currentPage]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-sm border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-semibold text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">返回 Back</span>
        </button>

        <div className="text-center flex-1 mx-4">
          <h1 className="text-white font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-none mx-auto">
            {story.title}
          </h1>
          <p className="text-white/50 text-xs truncate">{story.titleEn}</p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton story={story} />
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${style.gradient} text-white text-xs font-bold`}>
            <span>{style.emoji}</span>
            <span className="hidden sm:inline">{style.name}</span>
          </div>
        </div>
      </div>

      {/* Main reading area */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Book */}
        <div className={`w-full max-w-2xl book-shadow rounded-3xl overflow-hidden bg-white ${slideClass}`}>
          {isCover ? (
            /* Cover page */
            <div className="relative flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300 p-8">
              <div className="absolute inset-0 opacity-10">
                {['✨', '⭐', '🌟', '💫'].map((s, i) => (
                  <span
                    key={i}
                    className="absolute text-3xl"
                    style={{ left: `${20 + i * 20}%`, top: `${15 + (i % 2) * 50}%` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              {story.pages[0] && (
                <div className="w-full max-w-sm aspect-square mb-6 rounded-2xl overflow-hidden shadow-xl">
                  <StoryImage
                    src={story.pages[0].imageUrl}
                    alt="封面 Cover"
                    pageNum={0}
                  />
                </div>
              )}
              <div className="text-center z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
                  {story.title}
                </h2>
                <p className="text-white/80 text-lg font-semibold">{story.titleEn}</p>
                <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-sm`}>
                  <span>{style.emoji}</span>
                  <span>{style.name} · {style.nameEn}</span>
                </div>
              </div>
              {/* Start reading hint */}
              <div className="mt-8 flex items-center gap-2 text-white/60 text-sm animate-bounce-slow">
                <span>点击翻页开始阅读 / Tap arrow to begin</span>
                <span>→</span>
              </div>
            </div>
          ) : isLastPage && page ? (
            /* Last story page + The End */
            <div className="flex flex-col">
              {/* Image */}
              <div className="aspect-video sm:aspect-[16/9] w-full">
                <StoryImage
                  src={page.imageUrl}
                  alt={`第${page.pageNumber}页 Page ${page.pageNumber}`}
                  pageNum={currentPage}
                />
              </div>
              {/* Text */}
              <div className="p-6 sm:p-8">
                <p className="story-page-chinese text-gray-800 mb-3">{page.chinese}</p>
                <p className="story-page-english">{page.english}</p>
                {/* The End */}
                <div className="mt-6 text-center py-4 border-t border-amber-100">
                  <p className="text-2xl font-bold text-amber-500" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
                    故事结束
                  </p>
                  <p className="text-gray-400 font-semibold">The End</p>
                  <div className="mt-2 flex justify-center gap-1 text-xl">
                    {'🌟✨⭐'.split('').map((s, i) => (
                      <span key={i} className="animate-bounce-slow" style={{ animationDelay: `${i * 0.2}s` }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : page ? (
            /* Regular story page */
            <div className="flex flex-col sm:flex-row min-h-[60vh]">
              {/* Image - left on desktop, top on mobile */}
              <div className="sm:w-1/2 aspect-square sm:aspect-auto">
                <StoryImage
                  src={page.imageUrl}
                  alt={`第${page.pageNumber}页 Page ${page.pageNumber}`}
                  pageNum={currentPage}
                />
              </div>
              {/* Text - right on desktop, bottom on mobile */}
              <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center bg-white">
                <div className="mb-3">
                  <span className="text-xs font-bold text-amber-400 bg-amber-50 px-2 py-1 rounded-full">
                    第 {page.pageNumber} 页 · Page {page.pageNumber}
                  </span>
                </div>
                <p className="story-page-chinese text-gray-800 mb-4 leading-relaxed">
                  {page.chinese}
                </p>
                <div className="w-12 h-0.5 bg-amber-200 mb-4" />
                <p className="story-page-english leading-relaxed">
                  {page.english}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Page turn navigation */}
        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={() => navigate('prev')}
            disabled={isCover || animating}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${
              isCover
                ? 'bg-white/10 text-white/20 cursor-not-allowed'
                : 'bg-white text-amber-500 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95'
            }`}
          >
            ←
          </button>

          {/* Page dots */}
          <div className="flex items-center gap-1.5">
            {/* Cover dot */}
            <button
              onClick={() => goToPage(-1)}
              className={`rounded-full transition-all duration-300 ${
                currentPage === -1
                  ? 'bg-amber-400 w-5 h-2.5'
                  : 'bg-white/30 w-2.5 h-2.5 hover:bg-white/60'
              }`}
            />
            {story.pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                className={`rounded-full transition-all duration-300 ${
                  currentPage === idx
                    ? 'bg-amber-400 w-5 h-2.5'
                    : 'bg-white/30 w-2.5 h-2.5 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate('next')}
            disabled={isLastPage || animating}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${
              isLastPage
                ? 'bg-white/10 text-white/20 cursor-not-allowed'
                : 'bg-white text-amber-500 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95'
            }`}
          >
            →
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-white/30 text-xs mt-3 hidden sm:block">
          使用方向键翻页 · Use arrow keys to turn pages
        </p>
        <p className="text-white/30 text-xs mt-1 sm:hidden">
          左右滑动翻页 · Swipe to turn pages
        </p>
      </div>
    </div>
  )
}
