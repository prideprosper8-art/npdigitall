# Run doc — NP Digital website

## 1. Reproduce the build artifacts

The production server serves the compiled frontend from `dist/` and the API from `dist-server/`. Both are committed artifacts of the build; regenerate with:

```bash
npm install                 # dependencies (package-lock.json)
npm run build               # images (logo derivatives + 10 service PNGs) -> vite build -> typecheck
npm run server:build        # compiles server/index.ts -> dist-server/index.js
```

`npm run build` runs, in order:
1. `scripts/prepare-images.mjs` — crops the watermark from the master logo, emits `public/assets/logo*.png`, favicon, OG image
2. `scripts/make-service-images.mjs` — renders the 10 blueprint service illustrations into `public/assets/services/`
3. `vite build` — multi-page build (`index`, `projects`, `privacy`, `terms`, `404`) into `dist/`
4. `tsc --noEmit` twice (frontend + server configs)

No `.env` file is required. Optional env vars: `PORT` (default 8787), `DATA_DIR` (default `.data`, created on first enquiry), `ENQUIRY_TOKEN`, `TRUST_PROXY`.

## 2. Run the server

```bash
npm start                   # NODE_ENV=production node dist-server/index.js, default port 8787
```

Detached on Windows (Freebuff recipe):

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'node.exe' -ArgumentList 'dist-server/index.js' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

Note: `Start-Process` with output redirection can exceed the shell tool's timeout while returning fine — verify with `netstat -ano | grep ":8787" | grep LISTEN` and `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8787/` instead of trusting the exit.

Verify liveness via `GET /api/health` (`{"ok":true,...}`). Enquiries POST to `/api/inquiries` and persist to `.data/inquiries.ndjson`.

## Frontend-only dev mode

`npm run dev` — Vite dev server on :5173; API routes won't exist there (form submits will fail), so use the production server above for full behavior.
