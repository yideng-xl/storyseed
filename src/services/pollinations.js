export const ART_STYLES = {
  clay: {
    key: 'clay',
    name: '泥塑彩绘',
    nameEn: 'Clay Sculpture',
    emoji: '🏺',
    description: '色彩丰富的彩色泥塑风格',
    descriptionEn: 'Colorful clay sculpture art',
    prompt: 'colorful clay sculpture art style, clay figurines, vibrant plasticine, stop-motion animation aesthetic, tactile texture',
    gradient: 'from-orange-400 to-red-400',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    selected: 'ring-orange-400',
  },
  disney: {
    key: 'disney',
    name: '迪士尼',
    nameEn: 'Disney',
    emoji: '✨',
    description: '迪士尼动画经典风格',
    descriptionEn: 'Classic Disney animation style',
    prompt: 'Disney animation style, magical fairy tale illustration, vibrant colors, expressive characters, enchanting background, 2D animation cel shading',
    gradient: 'from-blue-400 to-purple-500',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    selected: 'ring-blue-400',
  },
  cartoon: {
    key: 'cartoon',
    name: '卡通风',
    nameEn: 'Cartoon',
    emoji: '🎨',
    description: '现代活泼卡通插画',
    descriptionEn: 'Modern playful cartoon',
    prompt: 'modern cartoon style, bold outlines, flat colors, playful character design, cheerful illustration, vector art style',
    gradient: 'from-green-400 to-teal-400',
    bg: 'bg-green-50',
    border: 'border-green-300',
    selected: 'ring-green-400',
  },
  watercolor: {
    key: 'watercolor',
    name: '水彩风',
    nameEn: 'Watercolor',
    emoji: '🖌️',
    description: '柔美温馨水彩画风格',
    descriptionEn: 'Soft dreamy watercolor',
    prompt: 'watercolor painting style, soft edges, flowing colors, artistic brush strokes, dreamy pastel tones, gentle and warm illustration',
    gradient: 'from-pink-400 to-rose-400',
    bg: 'bg-pink-50',
    border: 'border-pink-300',
    selected: 'ring-pink-400',
  },
}

export function getImageUrl(illustrationPrompt, artStyleKey, seed, pageIndex) {
  const style = ART_STYLES[artStyleKey]
  if (!style) return ''
  const fullPrompt = `${illustrationPrompt}, ${style.prompt}, children's picture book illustration, bright cheerful safe-for-children art, high quality`
  const pageSeed = seed + pageIndex * 137
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=512&height=512&model=flux&nologo=true&seed=${pageSeed}`
}

export async function generateStory(userPrompt, artStyleKey) {
  const style = ART_STYLES[artStyleKey]

  const systemPrompt = `You are a creative childrens story writer. Return ONLY valid JSON, no other text: {"title":"","titleEn":"","pages":[{"pageNumber":1,"illustrationPrompt":"","chinese":"","english":""}]}`

  const fetchWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Create a 6-page bilingual (Chinese+English) childrens picture book story about: ${userPrompt}. Return JSON with title, titleEn, and pages array (6 pages), each page has pageNumber, illustrationPrompt (English scene description), chinese (2-3 simple sentences), english (2-3 simple sentences) fields. Story must be positive and child-friendly.` },
            ],
            model: 'openai',
            jsonMode: true,
            seed: Math.floor(Math.random() * 99999),
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const text = await response.text()
        let data

        try {
          data = JSON.parse(text)
        } catch {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try { data = JSON.parse(jsonMatch[0]) } catch { /* continue */ }
          }
        }

        console.log('[StorySeed] API response:', JSON.stringify(data).slice(0, 300))
        if (data?.pages && Array.isArray(data.pages) && data.pages.length > 0) {
          return data
        }
        console.error('[StorySeed] Bad structure:', data)
        throw new Error('incomplete')
      } catch (err) {
        if (i === retries - 1) throw err
        await new Promise(r => setTimeout(r, 1500))
      }
    }
  }

  const data = await fetchWithRetry()

  if (!data?.pages || !Array.isArray(data.pages) || data.pages.length === 0) {
    throw new Error('故事内容不完整，请重试')
  }

  const seed = Math.floor(Math.random() * 99999)

  const story = {
    id: Date.now().toString(),
    title: data.title || '我的故事',
    titleEn: data.titleEn || 'My Story',
    prompt: userPrompt,
    artStyleKey,
    seed,
    createdAt: new Date().toISOString(),
    pages: data.pages.map((page, idx) => ({
      pageNumber: page.pageNumber || idx + 1,
      illustrationPrompt: page.illustrationPrompt || '',
      chinese: page.chinese || '',
      english: page.english || '',
      imageUrl: getImageUrl(page.illustrationPrompt || '', artStyleKey, seed, idx),
    })),
  }

  return story
}
