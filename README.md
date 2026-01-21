# Smart Lecturer — AI Lecture Navigator & Study Companion

Transform long-form YouTube lectures into an interactive, AI-driven study experience.

Smart Lecturer analyzes a lecture video, generates a hierarchical **Lecture Blueprint** (sections → subsections with timestamps), produces **flashcards** for active recall, and provides a **grounded “Professor Chat”** that answers questions using the blueprint as the source of truth.

> Tech: **Next.js (App Router)** + **Google Gemini** (multimodal + streaming)

---

## What this project is

Smart Lecturer is a single-page web app designed to solve a common problem in digital learning: **finding and retaining key information inside long lecture videos**.

From a YouTube URL, the app:

1. **Processes the lecture** via an LLM and generates a structured outline (“blueprint”) with **clickable timestamps**.
2. **Generates study materials** (currently: **20 flashcards**).
3. Provides a **Professor Chat** experience that is **constrained to the lecture blueprint** to reduce hallucinations and keep answers verifiable.

Core server routes (Next.js Route Handlers):

- `POST /api/process-video` → generates `{ blueprint, flashcards }`
- `POST /api/chat` → streams professor-chat responses grounded on the blueprint

---

## How to start locally and deploy to Render

### Prerequisites

- **Node.js 20+** (recommended)
- **pnpm**
- A **Google Gemini API key** (`GOOGLE_GENERATIVE_AI_API_KEY`)

### 1) Local setup

Install dependencies:

```bash
pnpm install
```

Create an environment file:

```bash
cp .env.example .env
```

Set your key:

```bash
# .env
GOOGLE_GENERATIVE_AI_API_KEY=YOUR_KEY_HERE
```

Start the dev server:

```bash
pnpm dev
```

Open:

- http://localhost:3000

### 2) Deploy to Render (single Next.js app)

Render can deploy this repo as one **Web Service**.

1. **Create a new Web Service** in Render
2. Connect your GitHub repo
3. Configure:
   - **Environment**: Node
   - **Build Command**:

     ```bash
     pnpm install --frozen-lockfile && pnpm build
     ```

   - **Start Command**:

     ```bash
     pnpm start
     ```

4. Add **Environment Variables** in Render:
   - `GOOGLE_GENERATIVE_AI_API_KEY` = your Gemini API key

5. Deploy

Notes:

- This project uses Next.js API routes (`/app/api/**`) so a single Render service is sufficient.
- If you run into Node runtime issues on Render, set Node to **20+** in Render’s settings.

---

## Key features

- **YouTube URL → Lecture Blueprint**
  - Produces a structured outline (Sections → Subsections) with **HH:MM:SS timestamps**.

- **Seek-on-click navigation (lecture navigator)**
  - Click a subsection to jump the video to the relevant moment (UI-level integration).

- **Professor Chat (grounded Q&A)**
  - Streaming chat answers are constrained to the generated blueprint.
  - The system prompt enforces a “ground truth” policy and requires timestamp citations.

- **Flashcards for active recall**
  - Generates exactly **20** Q/A flashcards per lecture processing request.

- **Modern dashboard UI**
  - Next.js App Router + componentized UI (Radix + Tailwind utilities) for a fast, responsive learning workflow.

---

## Innovation points

- **Multimodal lecture understanding**
  - The platform is designed around using a multimodal LLM to reason over lecture content and generate structured learning artifacts.

- **Ground-truth constrained tutoring**
  - Chat responses are intentionally limited to lecture-derived structure to reduce hallucinations, making answers more trustworthy.

- **Timestamp-first verification loop**
  - The UX emphasizes “answer → cited timestamp → jump to source” so students can verify and re-watch precisely.

- **From passive watching to active studying**
  - Blueprint navigation + flashcards shift the learner from consumption to retrieval practice and targeted review.

---

## Environment variables

| Name                           | Required | Description                                |
| ------------------------------ | -------- | ------------------------------------------ |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes      | Gemini API key used by server-side routes. |

---

## Security / operational notes

- **Do not commit secrets**: keep `.env` local and configure environment variables in Render.
- If a real key was ever committed or shared, **rotate it immediately** in Google Cloud / AI Studio.

---

## License

Add a license if you plan to distribute this project.
