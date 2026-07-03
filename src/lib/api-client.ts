/**
 * CoutureWay API client — talks to the Flask REST backend.
 *
 * This module replaces the old Supabase client. It owns:
 *  - the JWT access token (persisted in localStorage)
 *  - request/response handling ({ data } on success, { error } on failure)
 *  - a tiny auth event emitter so the AuthProvider can react to sign-in/out
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5000/api";

const TOKEN_KEY = "cw_access_token";

export type ApiUser = { id: string; email: string };
export type AuthEvent = "SIGNED_IN" | "SIGNED_OUT";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// ---------------------------------------------------------------- token ----
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

// -------------------------------------------------------------- request ----
async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let payload: { data?: T; error?: string; details?: unknown } | null = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    throw new ApiError(payload?.error ?? `Request failed (${res.status})`, res.status, payload?.details);
  }
  return (payload?.data ?? null) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ----------------------------------------------------------------- auth ----
type Listener = (event: AuthEvent, user: ApiUser | null) => void;
const listeners = new Set<Listener>();

function emit(event: AuthEvent, user: ApiUser | null) {
  listeners.forEach((l) => l(event, user));
}

export const auth = {
  onAuthStateChange(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  hasToken(): boolean {
    return !!getToken();
  },

  async signUp(input: { email: string; password: string; full_name?: string }): Promise<ApiUser> {
    const data = await api.post<{ user: ApiUser; access_token: string }>("/auth/signup", input);
    setToken(data.access_token);
    emit("SIGNED_IN", data.user);
    return data.user;
  },

  async signIn(input: { email: string; password: string }): Promise<ApiUser> {
    const data = await api.post<{ user: ApiUser; access_token: string }>("/auth/signin", input);
    setToken(data.access_token);
    emit("SIGNED_IN", data.user);
    return data.user;
  },

  async signOut(): Promise<void> {
    try {
      if (getToken()) await api.post("/auth/signout");
    } catch {
      // token may already be expired — signing out locally is still correct
    }
    setToken(null);
    emit("SIGNED_OUT", null);
  },

  /** Validate the stored token against the backend; null when signed out/invalid. */
  async getUser(): Promise<ApiUser | null> {
    if (!getToken()) return null;
    try {
      const me = await api.get<{ user: ApiUser }>("/auth/me");
      return me.user;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setToken(null);
      return null;
    }
  },

  /** Full identity payload: user + profile + roles. */
  async getMe() {
    return api.get<{
      user: ApiUser;
      profile: Record<string, unknown> | null;
      roles: string[];
    }>("/auth/me");
  },
};
