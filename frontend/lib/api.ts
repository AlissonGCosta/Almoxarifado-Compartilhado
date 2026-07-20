import { getStoredAuthSession } from "@/lib/auth";

export class BackendError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BackendError";
    this.status = status;
  }
}

export async function backendRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const session = getStoredAuthSession();
  const response = await fetch(`/api/backend${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Não foi possível sincronizar com a API.";

    try {
      const error = (await response.json()) as { message?: string };
      message = error.message || message;
    } catch {
      message = response.statusText || message;
    }

    throw new BackendError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  return (contentType.includes("application/json") ? JSON.parse(text) : text) as T;
}
