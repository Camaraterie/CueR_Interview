<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CueR.ai - The Chris Camarata Story

> **⚠️ PUBLIC REPOSITORY NOTICE**
> This is a **PUBLIC** repository. All code and commits are visible to everyone on the internet. Do not commit sensitive information, API keys, or credentials. See [SECURITY.md](SECURITY.md) for details.

An interactive storybook-style resume built with React, TypeScript, and Google's Gemini AI. This project showcases the journey from General Surgeon to AI Engineer through an immersive, paginated experience with AI-powered chat capabilities.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://ai.studio/apps/drive/1yWFl27pLCWpYkl2zX_fSgC2NtBcgtvCm)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚨 Important Security Notice

**This application exposes the Gemini API key to the client-side code.** This is intentional for portfolio demonstration purposes but is **NOT recommended for production use**.

- ✅ **For Portfolio/Demo:** Safe to use with rate-limited API keys
- ❌ **For Production:** Implement a backend API proxy (see [SECURITY.md](SECURITY.md))

**Read the full security analysis:** [SECURITY.md](SECURITY.md)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Gemini API Key** ([Get one here](https://ai.google.dev/))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Camaraterie/CueR_Interview.git
   cd CueR_Interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Fork this repository** (or use your own)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key
   - Select all environments (Production, Preview, Development)

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Build the project
npm run build

# Preview the production build locally
npm run preview

# Deploy the `dist` folder to your hosting provider
```

**Supported Platforms:**
- ✅ Vercel (Recommended)
- ✅ Netlify
- ✅ GitHub Pages (requires additional routing configuration)
- ✅ Any static hosting service

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

The project includes comprehensive tests for:
- ✅ Gemini service functions (`askChris`, `evaluateInterview`, `generatePersonaFromResume`)
- ✅ React components (App, MessageRenderer, Page components)
- ✅ Security validation logic
- ✅ File upload handling
- ✅ Accessibility compliance

---

## 🏗️ Project Structure

```
CueR_Interview/
├── App.tsx                   # Main application component
├── index.tsx                 # Application entry point
├── index.html                # HTML template
├── services/
│   └── geminiService.ts      # Gemini AI integration
├── tests/
│   ├── setup.ts              # Test configuration
│   ├── App.test.tsx          # App component tests
│   ├── services/
│   │   └── geminiService.test.ts
│   └── components/
│       └── PageComponents.test.tsx
├── vite.config.ts            # Vite build configuration
├── vitest.config.ts          # Vitest test configuration
├── tsconfig.json             # TypeScript configuration
├── vercel.json               # Vercel deployment config
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variable template
├── SECURITY.md               # Security analysis and recommendations
├── claude.md                 # Claude AI integration guide
├── gemini.md                 # Gemini AI integration guide
└── README.md                 # This file
```

---

## 🎨 Features

### Interactive Storybook Design
- 📖 Paginated book-style interface
- 🎨 Custom "PLA filament" texture theme (3D printing inspiration)
- 🌓 Dark/Light mode with terminal aesthetic
- 📱 Responsive design (mobile & desktop)

### AI-Powered Chat
- 💬 Real-time conversation with AI persona (Christopher Camarata)
- 🔓 Unlockable "interview mode" after engaging conversation
- 📄 Resume upload feature to simulate any candidate
- 🎭 Custom persona generation from uploaded resumes

### Technical Highlights
- ⚡ Built with Vite for fast development and optimized builds
- 🔷 TypeScript for type safety
- ⚛️ React 19 with modern hooks
- 🤖 Google Gemini 2.5 Flash AI integration
- 🎨 Tailwind CSS (via CDN)
- 🧪 Comprehensive test coverage with Vitest
- 🔒 Security headers configured

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6.2 |
| **AI Model** | Google Gemini 2.5 Flash |
| **Styling** | Tailwind CSS (CDN) |
| **Icons** | Lucide React |
| **Testing** | Vitest + React Testing Library |
| **Deployment** | Vercel |

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run test suite |
| `npm run test:ui` | Run tests with interactive UI |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint` | Lint TypeScript files |
| `npm run type-check` | Check TypeScript types |

---

## 🔒 Security Considerations

### Known Limitations (By Design for Portfolio)
- ⚠️ API key exposed in client-side bundle
- ⚠️ No rate limiting on chat interface
- ⚠️ Client-side security validation (bypassable)
- ⚠️ No backend API layer

### Production Recommendations
If you want to use this architecture in production:

1. **Implement Backend API Proxy**
   - Create serverless functions (`/api` directory)
   - Store API key server-side only
   - Add authentication and rate limiting

2. **Add Rate Limiting**
   - Use Redis/Upstash for request tracking
   - Implement IP-based throttling
   - Add CAPTCHA for suspicious activity

3. **Enhanced File Upload Security**
   - Virus scanning (ClamAV, VirusTotal)
   - File size limits
   - Content validation before AI processing

**Full Details:** See [SECURITY.md](SECURITY.md)

---

## 📚 Documentation

- **[SECURITY.md](SECURITY.md)** - Complete security analysis and recommendations
- **[claude.md](claude.md)** - Guide to integrating Claude AI as an alternative
- **[gemini.md](gemini.md)** - Gemini AI integration details and best practices

---

## 🎯 Use Cases

This project demonstrates:
- ✅ Creative AI-powered portfolio design
- ✅ Interactive resume/CV presentation
- ✅ LLM integration with Google Gemini
- ✅ Dynamic persona generation
- ✅ Modern React + TypeScript patterns
- ✅ Vercel deployment configuration
- ✅ Comprehensive testing strategies

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📞 Contact

**Christopher Camarata, MD**
- **Email:** chris@cuer.ai
- **LinkedIn:** [Find me on LinkedIn](https://linkedin.com)
- **Portfolio:** [CueR.ai](https://cuer.ai)

---

## 🙏 Acknowledgments

- **Google Gemini** for the powerful AI capabilities
- **Vercel** for seamless deployment
- **React Team** for the amazing framework
- **Vite** for blazing-fast build tooling

---

## ⚖️ Disclaimer

This is a portfolio demonstration project. The architecture intentionally trades some security for simplicity and ease of demonstration. **Do not use this exact architecture for production applications handling sensitive data or requiring strong security guarantees.**

For production use, implement proper backend services, authentication, and follow the recommendations in [SECURITY.md](SECURITY.md).

---

**Built with ❤️ by [Christopher Camarata](https://cuer.ai) | Powered by [Google Gemini](https://ai.google.dev/)**
