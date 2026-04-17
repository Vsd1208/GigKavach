const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(typeof payload === "string" ? payload : payload.error ?? "API request failed");
  }

  return payload;
}

export function getApiBaseUrl() {
  return BASE_URL;
}
