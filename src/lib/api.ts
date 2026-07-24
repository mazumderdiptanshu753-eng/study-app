// Utility helper for resilient fetch requests during server cold starts or wake ups
export async function safeFetch(
  url: string,
  options?: RequestInit,
  retries = 3,
  delayMs = 1500
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, options);
      // Return if successful, or standard client errors (400 - 499, except 429 rate limit)
      if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
        return res;
      }
      console.warn(`[safeFetch] Server returned status ${res.status} for ${url}. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})...`);
    } catch (err) {
      console.warn(`[safeFetch] Network error for ${url}. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})...`, err);
    }
    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  // Return safe 503 response instead of throwing unhandled exception
  return new Response(JSON.stringify({ error: "Server warming up" }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}
