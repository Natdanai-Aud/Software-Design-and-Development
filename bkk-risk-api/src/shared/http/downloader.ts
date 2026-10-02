/**
 * Thin wrapper around fetch with a timeout, used by every external-data
 * source in this app (KML, xlsx downloads). Never throws: callers get an
 * `ok: false` result with either an HTTP status or an error message, which
 * mirrors how each source already reported failures before this was
 * extracted (see risk-points/kml-risk-point.source.ts, ranking/ranking.service.ts,
 * bottlenecks/bottlenecks.service.ts).
 */
interface BaseResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  errorMessage?: string;
}

export interface TextFetchResult extends BaseResult {
  text?: string;
}

export interface BufferFetchResult extends BaseResult {
  buffer?: Buffer;
}

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
): Promise<{ response: Response } | { errorMessage: string }> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { response };
  } catch (error) {
    return { errorMessage: (error as Error).message };
  }
}

export async function fetchText(
  url: string,
  timeoutMs: number,
): Promise<TextFetchResult> {
  const result = await fetchWithTimeout(url, timeoutMs);
  if ('errorMessage' in result) {
    return { ok: false, errorMessage: result.errorMessage };
  }
  const { response } = result;
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      statusText: response.statusText,
    };
  }
  return { ok: true, text: await response.text() };
}

export async function fetchArrayBuffer(
  url: string,
  timeoutMs: number,
): Promise<BufferFetchResult> {
  const result = await fetchWithTimeout(url, timeoutMs);
  if ('errorMessage' in result) {
    return { ok: false, errorMessage: result.errorMessage };
  }
  const { response } = result;
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      statusText: response.statusText,
    };
  }
  return { ok: true, buffer: Buffer.from(await response.arrayBuffer()) };
}
