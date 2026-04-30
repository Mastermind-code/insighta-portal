# Insighta Labs+ — Web Portal

React-based web portal for the Insighta Labs+ Profile Intelligence System.

## Live URL

_(add your deployed URL here)_

## Pages

| Route | Description | Auth required |
|---|---|---|
| `/` | Login (GitHub OAuth) | No |
| `/dashboard` | Summary stats | Yes |
| `/profiles` | Profiles list with filters + pagination | Yes |
| `/profiles/:id` | Profile detail view | Yes |
| `/search` | Natural language search | Yes |
| `/account` | Current user info | Yes |

## Authentication Flow

1. User clicks **Continue with GitHub**
2. Browser is redirected to `GET /api/v1/auth/github` on the backend
3. Backend redirects to GitHub OAuth
4. After authorisation, GitHub redirects to the backend callback
5. Backend sets **HTTP-only cookies** (`access_token`, `refresh_token`) — tokens are never accessible to JavaScript
6. A non-sensitive `has_session` cookie is also set so the frontend can detect that a session exists
7. Backend redirects the browser to `/dashboard` (no tokens in the URL)
8. On `/dashboard` the app calls `/auth/whoami` (cookies sent automatically) to fetch user info

## Token Handling

- Auth tokens are stored **exclusively in HTTP-only cookies** set by the backend
- The frontend never reads or stores auth tokens in `sessionStorage` or `localStorage`
- Only non-sensitive display data (username, role, email) is cached in `sessionStorage`
- All API calls use `credentials: "include"` so the browser sends cookies automatically
- On a `401` response the frontend calls `POST /auth/refresh` (with credentials) to get new cookies, then retries
- If refresh fails the session is cleared and the user is redirected to login

## Role Enforcement

| Role | What they can do in the portal |
|---|---|
| `analyst` | View profiles, search, export |
| `admin` | All analyst actions + create profiles |

## Local Development

```bash
npm install
npm run dev
```

The portal expects the backend at:
```
https://stage-1-data-persistence-api-design.vercel.app/api/v1
```

To point at a local backend, update `API_BASE` in `src/api.js` and `src/pages/Dashboard.jsx`.

> **Note:** HTTP-only cookie authentication requires both the frontend and backend to be served over HTTPS in production (`SameSite=None; Secure`). For local development, run both services locally on the same machine.

## Tech Stack

- React 19 + Vite
- React Router v7
- Vanilla CSS (inline styles)
