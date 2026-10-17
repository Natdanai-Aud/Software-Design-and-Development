import { fetchArrayBuffer, fetchText } from './downloader';

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

describe('downloader', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  describe('fetchText', () => {
    it('returns the body on success', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('hello'),
      });

      const result = await fetchText('https://example.com/a', 1000);

      expect(result).toEqual({ ok: true, text: 'hello' });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('reports the HTTP status on failure', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      });

      const result = await fetchText('https://example.com/a', 1000);

      expect(result).toEqual({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      });
    });

    it('reports the error message when fetch throws', async () => {
      fetchMock.mockRejectedValue(new Error('network down'));

      const result = await fetchText('https://example.com/a', 1000);

      expect(result).toEqual({ ok: false, errorMessage: 'network down' });
    });
  });

  describe('fetchArrayBuffer', () => {
    it('returns a Buffer on success', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new Uint8Array([104, 105]).buffer),
      });

      const result = await fetchArrayBuffer('https://example.com/f.xlsx', 1000);

      expect(result.ok).toBe(true);
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer?.toString()).toBe('hi');
    });

    it('reports the HTTP status on failure', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await fetchArrayBuffer('https://example.com/f.xlsx', 1000);

      expect(result).toEqual({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('reports the error message when fetch throws', async () => {
      fetchMock.mockRejectedValue(new Error('timeout'));

      const result = await fetchArrayBuffer('https://example.com/f.xlsx', 1000);

      expect(result).toEqual({ ok: false, errorMessage: 'timeout' });
    });
  });
});
