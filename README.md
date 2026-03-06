# 故事种子 StorySeed 📖

> 为孩子创作独一无二的AI儿童绘本故事

> Create unique AI-illustrated picture books for children

[![Deploy](https://github.com/storyseed/storyseed/actions/workflows/deploy.yml/badge.svg)](https://github.com/storyseed/storyseed/actions/workflows/deploy.yml)

---

## 中文介绍

故事种子是一个AI驱动的儿童绘本生成网站。只需输入一个故事主题，AI就会为您创作一本完整的中英双语绘本，包含精美插图！

### 主要功能

- **中英双语故事** - 每页同时显示中文和英文
- **AI生成插图** - 每一页都有对应的AI绘制插图
- **4种插画风格** 可选择：
  - 🏺 泥塑彩绘 - 彩色黏土风格
  - ✨ 迪士尼 - 迪士尼动画风格
  - 🎨 卡通风 - 现代卡通插画
  - 🖌️ 水彩风 - 柔美水彩画风
- **翻页动画** - 流畅的故事翻阅体验
- **阅读历史** - 自动保存已生成的故事
- **移动端适配** - 完美支持手机和平板

### 如何使用

1. 在输入框中输入故事主题（如：一只想飞的小猪）
2. 选择您喜欢的插画风格
3. 点击「生成故事绘本」按钮
4. 等待约15-30秒，AI创作完成后即可阅读

### 技术栈

- **前端**: React 18 + Vite + TailwindCSS
- **AI文字**: [Pollinations.ai](https://pollinations.ai) Text API（免费）
- **AI绘图**: [Pollinations.ai](https://pollinations.ai) Image API（免费）
- **部署**: GitHub Pages via GitHub Actions

---

## English Introduction

StorySeed is an AI-powered children's picture book generator. Simply enter a story topic and the AI will create a complete bilingual (Chinese + English) picture book with beautiful illustrations!

### Features

- **Bilingual Stories** - Each page shows both Chinese and English text
- **AI Illustrations** - Every page has a corresponding AI-generated illustration
- **4 Art Styles** to choose from:
  - 🏺 Clay Sculpture - Colorful clay art style
  - ✨ Disney - Classic Disney animation style
  - 🎨 Cartoon - Modern playful cartoon style
  - 🖌️ Watercolor - Soft dreamy watercolor style
- **Page Flip Animation** - Smooth storybook reading experience
- **Reading History** - Automatically saves generated stories
- **Mobile Responsive** - Works perfectly on phones and tablets

### How to Use

1. Enter a story topic (e.g., "A little pig who wants to fly")
2. Select your preferred art style
3. Click "Generate Story" button
4. Wait about 15-30 seconds for the AI to create your story

### Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS
- **AI Text**: [Pollinations.ai](https://pollinations.ai) Text API (free, no key needed)
- **AI Images**: [Pollinations.ai](https://pollinations.ai) Image API (free, no key needed)
- **Deploy**: GitHub Pages via GitHub Actions

---

## Deployment

### GitHub Pages Setup

1. Fork or clone this repository
2. Go to **Settings → Pages**
3. Set source to **GitHub Actions**
4. Push to `main` branch — the workflow will automatically build and deploy
5. Your site will be live at `https://<username>.github.io/storyseed/`

> **Note**: If your repository name is different from `storyseed`, update `VITE_BASE_PATH` in `.github/workflows/deploy.yml`

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## License

MIT License - Free for personal and commercial use.

---

*Made with ❤️ for children everywhere · 为全天下的孩子们而作*
