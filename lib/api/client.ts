// Client-side calls hit `/api/...` relative to the current origin (Traefik
// path-routes that to the api container). Server components have no origin
// of their own, so they need the api container's internal Docker DNS name.
const internalBaseUrl = process.env.API_INTERNAL_URL;

export const apiUrl = (path: string): string => {
  if (typeof window === "undefined" && internalBaseUrl) {
    return `${internalBaseUrl}${path}`;
  }
  return path;
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const apiFetch = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
  const response = await fetch(apiUrl(path), {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `${init.method ?? "GET"} ${path} failed`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
