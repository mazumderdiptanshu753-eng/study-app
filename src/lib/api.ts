// Utility helper for resilient fetch requests during server cold starts or wake ups

let activeWakingRequests = 0;

function notifyWakeStatus(isWaking: boolean, message?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("server-wake-status", {
        detail: { isWaking, message }
      })
    );
  }
}

export async function safeFetch(
  url: string,
  options?: RequestInit,
  retries = 3,
  delayMs = 1500
): Promise<Response> {
  let isRetrying = false;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, options);
      // Return if successful, or standard client errors (400 - 499, except 429 rate limit)
      if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
        if (isRetrying) {
          activeWakingRequests = Math.max(0, activeWakingRequests - 1);
          if (activeWakingRequests === 0) {
            notifyWakeStatus(false);
          }
        }
        return res;
      }

      if (!isRetrying) {
        isRetrying = true;
        activeWakingRequests++;
        notifyWakeStatus(true, "সার্ভার প্রস্তুত হচ্ছে, সামান্য অপেক্ষা করুন...");
      }

      console.warn(`[safeFetch] Server returned status ${res.status} for ${url}. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})...`);
    } catch (err) {
      if (!isRetrying) {
        isRetrying = true;
        activeWakingRequests++;
        notifyWakeStatus(true, "ক্লাউড সার্ভারে সংযোগ স্থাপন করা হচ্ছে...");
      }
      console.warn(`[safeFetch] Network error for ${url}. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})...`, err);
    }

    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  if (isRetrying) {
    activeWakingRequests = Math.max(0, activeWakingRequests - 1);
    if (activeWakingRequests === 0) {
      notifyWakeStatus(false);
    }
  }

  // Return safe 503 response instead of throwing unhandled exception
  return new Response(JSON.stringify({ error: "Server warming up" }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}

