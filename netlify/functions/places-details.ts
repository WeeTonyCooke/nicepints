import { getPlacesApiKey, placesKeyResponse } from './_placesKey';

const DETAILS_FIELD_MASK =
  'id,displayName,formattedAddress,location,addressComponents';

export const handler = async (event: {
  httpMethod?: string;
  queryStringParameters?: Record<string, string | undefined> | null;
}) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const placeId = event.queryStringParameters?.placeId?.trim();
  if (!placeId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: 'placeId is required.' } }),
    };
  }

  const apiKey = getPlacesApiKey();
  if (!apiKey) {
    return placesKeyResponse();
  }

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': DETAILS_FIELD_MASK,
      },
    }
  );

  const body = await response.text();

  return {
    statusCode: response.status,
    headers: { 'Content-Type': 'application/json' },
    body,
  };
};
