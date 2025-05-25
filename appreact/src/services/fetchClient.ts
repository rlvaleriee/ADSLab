const BASE_URL = import.meta.env.VITE_API_URL;

console.log("BASE_URL", BASE_URL); // e.g., http://localhost:5000

export async function fetchClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error ${response.status}: ${response.statusText}\n${errorText}`
      );
    }

    // Manejar 204 No Content (sin cuerpo)
    if (response.status === 204) {
      return {} as T;
    }

    // Intenta parsear el JSON
    const data = (await response.json()) as T;
    return data;
  } catch (err) {
    // Si lo deseas, podrías reportar a un sistema externo aquí
    throw err;
  }
}
