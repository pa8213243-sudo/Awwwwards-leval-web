# Gemini API Configuration

This folder handles server-side Gemini API initialization for AI-assisted financial strategy and copilot functionality.

## Environment Variable Setup

1. Create a `.env.local` file in the root directory (this file is ignored by `.gitignore`).
2. Add your Gemini API Key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## Security Best Practices
- **NEVER** expose `GEMINI_API_KEY` in client-side frontend code or prefix it with `VITE_`.
- The key is securely loaded on the Express server (`server.ts`) via `process.env.GEMINI_API_KEY`.
- `.env` and `.env.local` are listed in `.gitignore` to prevent key exposure.
