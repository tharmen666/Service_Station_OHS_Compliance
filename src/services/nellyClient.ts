export interface NellyCitation {
  statute: string;
  clause: string;
  lastVerified: string;
  sourceUrl: string;
}

export interface NellyCcpStatus {
  readingCelsius: number;
  thresholdCelsius: number;
  compliant: boolean;
}

export interface NellyApiResponse {
  reply: string;
  citation: NellyCitation | null;
  matchedSourceId: string | null;
  ccpStatus: NellyCcpStatus | null;
  temperature: number;
  disclaimer: string;
}

export async function queryNellyBackend(
  query: string,
  ccpReadingCelsius?: number | null
): Promise<NellyApiResponse> {
  const res = await fetch('/api/nelly', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      ccpReadingCelsius: ccpReadingCelsius ?? null,
    }),
  });

  if (!res.ok) {
    throw new Error(`Nelly API returned HTTP ${res.status}`);
  }

  return await res.json();
}

