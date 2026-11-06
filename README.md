# Nemo Chemistry Tutor v3.3

[![CI](https://github.com/your-username/nemo-chemistry-tutor/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/nemo-chemistry-tutor/actions)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fnemo-chemistry-tutor&env=GEMINI_API_KEY&envDescription=Google%20Gemini%20API%20Key%20from%20Google%20AI%20Studio&project-name=nemo-chemistry-tutor&framework=other)

**Engineered and Created by J.Sanjay**

An offline-first, high-performance chemistry tutor tailored for **CBSE Class 12 Boards**, **JEE Main**, and **JEE Advanced**. Built with zero-dependency vanilla web technologies (HTML5, modern CSS with KaTeX LaTeX rendering, and pure JavaScript) plus rotatable 3D molecular simulations, comprehensive exam formula banks, and an intelligent AI tutor powered by Google Gemini and Claude.

---

## 🚀 One-Click Deploy to Vercel

You can deploy your own instance of Nemo Chemistry Tutor to **Vercel** with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fnemo-chemistry-tutor&env=GEMINI_API_KEY&envDescription=Google%20Gemini%20API%20Key%20from%20Google%20AI%20Studio&project-name=nemo-chemistry-tutor&framework=other)

### Vercel Deployment Steps:
1. Click the **Deploy with Vercel** button above or import the GitHub repository in [Vercel Dashboard](https://vercel.com/new).
2. Framework Preset: Choose **Other** (configured automatically by `vercel.json`).
3. Root Directory: `./` (default).
4. Add Environment Variable:
   - `GEMINI_API_KEY`: Your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - *(Optional)* `GEMINI_MODEL`: `gemini-flash-latest` (default), `gemini-3.8-flash`, or `gemini-3.1-flash-lite`.
   - *(Optional alternative)* `ANTHROPIC_API_KEY`: Your Claude API key.
5. Click **Deploy**. Vercel will build the project and deploy the static app along with `/api/chat` and `/api/health` Serverless Functions with zero errors.

---

## 🐙 Deploying to GitHub

1. **Initialize Git & Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: Nemo Chemistry Tutor engineered by J.Sanjay"
   git branch -M main
   git remote add origin https://github.com/<your-username>/nemo-chemistry-tutor.git
   git push -u origin main
   ```

2. **Automated CI (GitHub Actions):**
   - The repository includes a pre-configured `.github/workflows/ci.yml` pipeline.
   - Every push and pull request runs syntax validation (`npm run lint`), bundle verification (`npm run build`), and artifact integrity checks across Node.js versions 18, 20, and 22.

---

## 💻 Local Development & Standalone Node Server

1. **Clone and Install:**
   ```bash
   git clone https://github.com/<your-username>/nemo-chemistry-tutor.git
   cd nemo-chemistry-tutor
   npm install
   ```

2. **Run with Live AI:**
   ```bash
   GEMINI_API_KEY="your-api-key" npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Run 100% Offline (No Server, No Node required):**
   - Simply double-click `index.html` or build the single-file bundle via `npm run build` and open `dist/nemo-single-file.html`.
   - All modules (124 3D molecules, Formula Bank with KaTeX, 248 Library Rules, Practice Quiz, Reaction Canvas, PYQ Bank) work without an active internet connection.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| **AI Tutor (Nemo)** | Deep multi-step logical reasoning with strict Indian curriculum alignment (CBSE, JEE Main, JEE Advanced). Features live backend integration with Gemini Flash (`gemini-flash-latest` with automatic graceful fallback cascade) and Claude. |
| **Formula Bank** | 25 high-yield master formulas formatted in KaTeX with horizontal scrolling support, symbol definitions, exam traps, and worked examples. |
| **124 3D Molecules** | Canvas-based molecular visualizer with ball-and-stick, wireframe, space-fill, crystal unit cells (BCC, FCC, HCP, NaCl, CsCl, ZnS, CaF₂, diamond), coordination complexes, and reaction intermediates. Preserved without external 3D runtime overhead. |
| **Rules & Exceptions Library** | 248 verified chemistry laws, trends, anomalies, and tests across Physical, Inorganic, and Organic Chemistry with direct "Ask Nemo" integration. |
| **PYQ Bank & Importer** | Import previous years' CBSE and JEE questions via JSON/CSV. Analyze attempt frequency, accuracy by chapter, and identify weak spots. |
| **Reaction Canvas** | Built-in freehand drawing tool for sketching organic mechanisms, arrows, intermediates, and stereochemical projections with PNG export. |
| **Practice & Study Analytics** | Topic-wise quizzes with persistent scoring, instant feedback, and mastery tracking. |
| **Founder Tribute** | Dedicated interactive panel and modal celebrating **J.Sanjay**, the creator and software engineer behind Nemo Chemistry Tutor. |

---

## ⚙️ Environment Variables

Create a `.env` file for local development or configure these in your host dashboard:

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Optional | `""` | Google Gemini API Key from Google AI Studio. |
| `GEMINI_MODEL` | Optional | `gemini-flash-latest` | Model to use. Fallbacks: `gemini-3.8-flash`, `gemini-3.1-flash-lite`. |
| `ANTHROPIC_API_KEY` | Optional | `""` | Anthropic Claude API Key (if using Claude as provider). |
| `NEMO_PROVIDER` | Optional | Auto | `gemini` or `anthropic` (defaults to whichever key is present). |
| `PORT` | Optional | `3000` | Port for local Node.js server. |

---

## 📁 Project Structure

```
├── api/
│   ├── chat.js              # Vercel Serverless Function & Node handler for /api/chat
│   └── health.js            # Vercel Serverless Function & Node handler for /api/health
├── .github/
│   └── workflows/ci.yml     # GitHub Actions CI workflow (Node 18, 20, 22)
├── scripts/
│   └── build-single.js      # Bundler for dist/nemo-single-file.html & dist/index.html
├── vendor/                  # KaTeX CSS, JS, and webfonts
├── index.html               # Main application entry point
├── style.css                # Pure CSS styling with responsive design & themes
├── app.js                   # Application logic, router, and UI management
├── molecules.js             # 124 3D molecular structures & crystal unit cells
├── data.js                  # Formulas, quiz data, and chemistry reference banks
├── lib-*.js                 # Physical, Inorganic, Organic, and Practical libraries
├── system-prompt.js         # Unified AI system prompt engineered by J.Sanjay
├── server.js                # Local development HTTP server (Node.js)
├── vercel.json              # Vercel deployment configuration
├── package.json             # NPM package scripts and metadata
└── metadata.json            # AI Studio applet manifest
```

---

## 📜 Credits & License

Engineered with passion by **J.Sanjay**.
Distributed under the MIT License for educational and learning use.
