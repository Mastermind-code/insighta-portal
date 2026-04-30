const API_BASE =
  "https://stage-1-data-persistence-api-design.vercel.app/api/v1";

// ─── Cookie helper (for non-httponly cookies) ────────────────────────────────
function getCookie(name) {
  return document.cookie.split("; ").reduce((acc, part) => {
    const [k, v] = part.split("=");
    return k === name ? decodeURIComponent(v) : acc;
  }, null);
}

// ─── Token storage (local dev — tokens arrive via URL redirect) ──────────────
export function saveTokens(accessToken, refreshToken) {
  sessionStorage.setItem("access_token", accessToken);
  sessionStorage.setItem("refresh_token", refreshToken);
}

export function getToken() {
  return sessionStorage.getItem("access_token");
}

function getRefreshToken() {
  return sessionStorage.getItem("refresh_token");
}

export function clearTokens() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
}

// ─── User display data (non-sensitive — just username/role/email) ─────────────
export function saveUser(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  const u = sessionStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function clearSession() {
  sessionStorage.removeItem("user");
}

// ─── Auth status ─────────────────────────────────────────────────────────────
// Checks sessionStorage token (local dev) OR has_session cookie (production)
export function isLoggedIn() {
  return (
    !!getToken() ||
    getCookie("has_session") === "true" ||
    !!sessionStorage.getItem("user")
  );
}

// ─── Token refresh ────────────────────────────────────────────────────────────
async function refreshSession() {
  const refreshToken = getRefreshToken();

  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    // Send body token for local dev; empty body for production (cookie sent automatically)
    body: JSON.stringify(refreshToken ? { refresh_token: refreshToken } : {}),
  });

  if (response.ok) {
    const data = await response.json();
    // Update sessionStorage tokens if backend returned new ones (local dev)
    if (data.access_token) {
      saveTokens(data.access_token, data.refresh_token);
    }
    return true;
  }
  return false;
}

// ─── Logout ──────────────────────────────────────────────────────────────────
export async function logout() {
  const refreshToken = getRefreshToken();
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refreshToken ? { refresh_token: refreshToken } : {}),
    });
  } catch (_) {
    // Ignore network errors on logout
  }
  clearTokens();
  clearSession();
}

// ─── API requests ─────────────────────────────────────────────────────────────
// Uses Authorization header when a token is in sessionStorage (local dev),
// falls back to httponly cookie via credentials:include (production).
export async function apiRequest(method, endpoint, body = null, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);

  Object.keys(params).forEach((key) => {
    if (
      params[key] !== null &&
      params[key] !== undefined &&
      params[key] !== ""
    ) {
      url.searchParams.append(key, params[key]);
    }
  });

  const buildOptions = () => {
    const token = getToken();
    const options = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-API-Version": "1",
      },
    };
    if (token) options.headers["Authorization"] = `Bearer ${token}`;
    if (body) options.body = JSON.stringify(body);
    return options;
  };

  let response = await fetch(url.toString(), buildOptions());

  if (response.status === 401) {
    const refreshed = await refreshSession();
    if (refreshed) {
      response = await fetch(url.toString(), buildOptions());
    } else {
      clearTokens();
      clearSession();
      window.location.href = "/";
      return null;
    }
  }

  return response;
}
