# Series A Readiness Score — Unicorn CFO

Free assessment tool for SaaS founders preparing for Series A.

## Stack
- React 18 + Vite
- Claude API (via Vercel Edge Function)
- Zero dependencies beyond React

## Deploy to Vercel

1. Fork/clone this repo
2. Connect to Vercel
3. Add environment variable: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
4. Deploy — done.

## Custom Domain
Add `score.unicorncfo.com` in Vercel dashboard → Settings → Domains.
Then add a CNAME record in your DNS (Wix):
- Name: `score`
- Value: `cname.vercel-dns.com`

## Local Development
```bash
npm install
npm run dev
```
