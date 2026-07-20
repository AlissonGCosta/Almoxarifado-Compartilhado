import type { AuthResponse, AuthSession } from "@/lib/types";

const AUTH_STORAGE_KEY = "almoxarifado:auth";

type JwtClaims = {
  id?: string;
  nome?: string;
  role?: string;
  sub?: string;
  exp?: number;
};

function decodeJwtClaims(token: string): JwtClaims {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return {};
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));

    return JSON.parse(new TextDecoder().decode(bytes)) as JwtClaims;
  } catch {
    return {};
  }
}

export function createAuthSession(response: AuthResponse): AuthSession {
  const claims = decodeJwtClaims(response.token);

  return {
    name: response.name || claims.nome || "Usuário",
    email: response.email || claims.sub || "",
    token: response.token,
    userId: claims.id,
    role: claims.role,
    expiresAt: claims.exp,
  };
}

export function getStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const session = JSON.parse(stored) as AuthSession;
    const isExpired = session.expiresAt ? session.expiresAt * 1000 <= Date.now() : false;

    if (!session.token || isExpired) {
      clearStoredAuthSession();
      return null;
    }

    return session;
  } catch {
    clearStoredAuthSession();
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
