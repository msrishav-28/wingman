---
description: How to deploy the Next.js Frontend and API to Vercel
---

# Deploying Frontend (Next.js) to Vercel

Since your project uses Next.js, **Vercel** is the optimal hosting choice. It handles both your static frontend pages and your server-side API routes (`/api/ai/chat`, `/api/scan`).

### Prerequisites
- A GitHub repository with your latest code pushed.
- A [Vercel Account](https://vercel.com).
- Your Supabase Project URL and Anon Key.

### Steps

1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import Git Repository**: Select your `student-companion` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
4.  **Environment Variables**:
    You MUST add the following variables in the Vercel dashboard:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
    *   `OPENAI_API_KEY`: Your OpenAI Key (for the secure AI route).
    *   `MODAL_OCR_URL`: The URL of your deployed Modal microservice (see Modal workflow).
5.  **Deploy**: Click **"Deploy"**. Vercel will build your app and verify it.

### Verification
- Visit the provided Vercel URL (e.g., `https://student-companion.vercel.app`).
- Test the login flow (Supabase Auth should work if redirects are set).
- Test the Dashboard to ensure API routes are functioning.
