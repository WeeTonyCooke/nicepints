/** Server-side Places key — not exposed to the browser when using Netlify functions. */
export function getPlacesApiKey(): string | null {
  const key =
    process.env.GOOGLE_PLACES_API_KEY?.trim() ||
    process.env.VITE_GOOGLE_PLACES_API_KEY?.trim();
  return key || null;
}

export function placesKeyResponse() {
  return {
    statusCode: 503,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: {
        message: 'Google Places is not configured on the server.',
        status: 'UNAVAILABLE',
      },
    }),
  };
}
