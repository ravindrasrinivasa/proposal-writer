# Proposal Generator - AI-Powered Deal Maker 🚀

An elegant, minimalist end-to-end web application developed for agency founders to instantly generate, refine, and save client proposals. It includes a beautiful editable rich preview document controller and integrates directly with any Supabase SQL backend.

## Tech Stack
- **Frontend Engine**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend Proxy**: Express custom server
- **AI Engine**: Google Gemini API via `@google/genai` TypeScript SDK
- **Database + Auth**: Supabase (PostgreSQL with RLS)
- **Styling**: Minimalist, clean Tailwind CSS layout with Inter & JetBrains Mono pairing

---

## Complete Setup & Installation Steps

### 1. Repository Configuration
Clone or download the project files into your local directory.

### 2. Install Package Dependencies
Install all required Node dependencies:
```bash
npm install
```

### 3. Setup Your Database System (Supabase)
1. Go to [Supabase](https://supabase.com) and create a free project.
2. In your Supabase Dashboard, navigate to the **SQL Editor**.
3. Create a new query, paste the entire schema provided in `supabase_schema.sql`, and execute it. This will:
   - Create your `proposals` table.
   - Configure Indexes.
   - Enable Row Level Security (RLS) policies allowing users to view/edit only their own data.
   - Attach triggers to manage UTC timestamps.

### 4. Setup Environment Variables
Create a `.env` or `.env.local` file at the project root based on `.env.example`:

```env
# Google Gemini Credentials (required on server-side)
GEMINI_API_KEY="AI_STUDIO_INJECTED_OR_YOUR_OWN_GOOGLE_API_KEY"

# Supabase database parameters (optional fallback, if missing App executes in Local Demo mode)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-public-anon-key"
```

### 5. Running the Application locally
Boot up the development environment:
```bash
npm run dev
```
The server will start listening at `http://localhost:3000`.

To build and compile static client code + CJS server bundles for production testing:
```bash
npm run build
npm run start
```

---

## Vercel Deployment Notes 🌟

This repository is optimized for quick, robust deployment directly to Vercel (or Cloud Run, Netlify, Render).

### Deploying the App to Vercel:

1. **Upload Code**: Push this project directory to a GitHub/GitLab repository.
2. **Import Project**: Look up your repo on Vercel Dashboard and click 'Import'.
3. **Environment Variables**: In Vercel's installation steps under "Environment Variables", configure:
   - `GOOGLE_API_KEY`: Your Gemini access key from Google AI Studio.
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
4. **Build Settings**: Confirm standard defaults for Vite (Next.js-style projects automatically hook build artifacts from `dist/` or equivalent).
5. **Launch**: Click **Deploy** and your Proposal Generator is instantly live!

---

## Sandbox / Local Demo Mode (No Setup Required)

If initialized without environment secrets, the application gracefully launches in **Demo Mode**. 
- It simulates authentication instantly.
- It restores existing proposals and persists modifications within `localStorage`.
- It gives previewers 100% full-function tester pathways.
