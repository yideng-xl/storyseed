## Build StorySeed (故事种子)

An AI-native children's storybook website deployed on GitHub Pages.

### Tech Stack
- React 18 + Vite + TailwindCSS
- Static SPA, no backend

### Deployment
- GitHub Pages via GitHub Actions (gh-pages branch)

### AI APIs (FREE, no keys needed)
- Text generation: Pollinations.ai - POST https://text.pollinations.ai/ with messages array
- Image generation: Pollinations.ai - GET https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=512&model=flux

### Features
1. Landing page with story prompt input (user enters story title OR custom prompt)
2. Bilingual output: Chinese + English side by side
3. Story length: 6-12 pages per story
4. Each page has: illustration + Chinese text + English text
5. Flipbook/storybook reader with page turning animation
6. Four built-in art styles user can choose:
   - 泥塑彩绘 (Clay Sculpture) - colorful clay art style
   - 迪士尼 (Disney) - Disney animation style
   - 卡通风 (Cartoon) - modern cartoon style
   - 水彩风 (Watercolor) - watercolor painting style
7. localStorage to save reading history
8. Loading animations while generating
9. Mobile responsive
10. No TTS (will add later)
11. Chinese-first UI with English support

### File Structure
- src/components/ - React components
- src/services/ - API service layer (pollinations)
- src/styles/ - Tailwind config
- src/utils/ - helpers
- .github/workflows/deploy.yml - GitHub Pages deployment

### Important Notes
- Use Pollinations.ai ONLY (free, no API key)
- Make the UI beautiful and child-friendly with warm colors
- All Chinese text should be proper simplified Chinese
- Git commit all changes when done
- Create a nice README.md in both Chinese and English

When completely finished, run this command:
openclaw system event --text "Done: StorySeed built" --mode now
