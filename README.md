# CueR.ai - Interactive AI Resume

An interactive storybook-style resume built with React, TypeScript, and Google's Gemini AI. Experience the journey from General Surgeon to AI Engineer through an immersive, paginated book interface with AI-powered chat capabilities.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://ai.studio/apps/drive/1yWFl27pLCWpYkl2zX_fSgC2NtBcgtvCm)

## 🚀 Quick Start

### Try It Live

Visit the deployed app and enter your own Gemini API key to start chatting!

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

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

5. **Enter your Gemini API key**
   - Get a free API key at [ai.google.dev](https://ai.google.dev)
   - Click the settings icon and paste your key
   - Start chatting!

---

## 🎨 Features

### Interactive Storybook Design
- 📖 Paginated book-style interface
- 🎨 Custom "PLA filament" texture theme (3D printing inspiration)
- 🌓 Dark/Light mode with terminal aesthetic
- 📱 Responsive design (mobile & desktop)

### AI-Powered Chat
- 💬 Real-time conversation with AI persona
- 🔓 Unlockable "interview mode" after engaging conversation
- 📄 Resume upload feature to simulate any candidate
- 🎭 Custom persona generation from uploaded resumes
- 🔑 Bring your own API key (BYOK) - your key, your control

### Technical Highlights
- ⚡ Built with Vite for fast development
- 🔷 TypeScript for type safety
- ⚛️ React 19 with modern hooks
- 🤖 Google Gemini 2.5 Flash AI integration
- 🎨 Tailwind CSS (via CDN)
- 🧪 Comprehensive test coverage
- 🔒 Client-side API key management

---

## 📦 Deployment

### Deploy to Vercel

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Deploy! (No environment variables needed)
4. Users will provide their own API keys

### Manual Deployment

```bash
npm run build
# Deploy the `dist` folder to any static hosting
```

**Supported Platforms:**
- ✅ Vercel
- ✅ Netlify
- ✅ GitHub Pages
- ✅ Any static hosting service

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

---

## 🏗️ Project Structure

```
CueR_Interview/
├── App.tsx                   # Main application component
├── index.tsx                 # Application entry point
├── index.html                # HTML template
├── services/
│   └── geminiService.ts      # Gemini AI integration
├── tests/                    # Test suites
├── vite.config.ts            # Vite build configuration
├── vercel.json               # Vercel deployment config
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6.2 |
| **AI Model** | Google Gemini 2.5 Flash |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Testing** | Vitest + React Testing Library |
| **Deployment** | Vercel |

---

## 🔑 API Key Management

This application uses a **Bring Your Own API Key (BYOK)** model:

- ✅ Users enter their own Gemini API key
- ✅ Keys are stored in browser localStorage (never sent to a server)
- ✅ Each user controls their own API usage and costs
- ✅ No server-side infrastructure needed

**Get your free API key:** [ai.google.dev](https://ai.google.dev)

**Free tier includes:**
- 15 requests per minute
- 1,500 requests per day
- 1 million requests per month

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run test suite |
| `npm run type-check` | Check TypeScript types |

---

## 🎯 Use Cases

This project demonstrates:
- ✅ Creative AI-powered portfolio design
- ✅ Interactive resume/CV presentation
- ✅ LLM integration with Google Gemini
- ✅ Dynamic persona generation
- ✅ Modern React + TypeScript patterns
- ✅ Client-side AI integration
- ✅ Comprehensive testing strategies

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome!

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Contact

**Christopher Camarata, MD**
- **Email:** chris@cuer.ai
- **Portfolio:** [CueR.ai](https://cuer.ai)

---

## 🙏 Acknowledgments

- **Google Gemini** for the powerful AI capabilities
- **Vercel** for seamless deployment
- **React Team** for the amazing framework
- **Vite** for blazing-fast build tooling

---

**Built with ❤️ by [Christopher Camarata](https://cuer.ai)**
