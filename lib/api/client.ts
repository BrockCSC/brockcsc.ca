// Server components have no browser origin, so they need the api container's
// internal Docker DNS name; the client just uses relative /api/... paths.
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
  init: RequestInit = {},
): Promise<T> => {
  const response = await fetch(apiUrl(path), {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `${init.method ?? "GET"} ${path} failed`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
