import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from './youtube-search.js';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.YOUTUBE_API_KEY = 'test-api-key';
});

describe('youtube-search handler', () => {
  it('returns 500 when YOUTUBE_API_KEY is missing', async () => {
    delete process.env.YOUTUBE_API_KEY;
    const res = await handler({ queryStringParameters: {} });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).error).toBe('Missing YOUTUBE_API_KEY');
  });

  it('proxies search request to YouTube API with default params', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      headers: { get: () => 'application/json' },
      text: () => Promise.resolve(JSON.stringify({ items: [] })),
    });

    const res = await handler({ queryStringParameters: {} });

    expect(res.statusCode).toBe(200);
    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('key=test-api-key');
    expect(fetchUrl).toContain('part=snippet');
    expect(fetchUrl).toContain('type=video');
    expect(fetchUrl).toContain('maxResults=50');
  });

  it('includes search query when q param is provided', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      headers: { get: () => 'application/json' },
      text: () => Promise.resolve(JSON.stringify({ items: [] })),
    });

    await handler({ queryStringParameters: { q: 'react tutorial' } });

    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('q=react+tutorial');
  });

  it('passes through custom part, type, and maxResults params', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      headers: { get: () => 'application/json' },
      text: () => Promise.resolve('{}'),
    });

    await handler({
      queryStringParameters: { part: 'id', type: 'channel', maxResults: '10' },
    });

    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('part=id');
    expect(fetchUrl).toContain('type=channel');
    expect(fetchUrl).toContain('maxResults=10');
  });

  it('returns YouTube API error status', async () => {
    mockFetch.mockResolvedValue({
      status: 403,
      headers: { get: () => 'application/json' },
      text: () => Promise.resolve(JSON.stringify({ error: 'Forbidden' })),
    });

    const res = await handler({ queryStringParameters: {} });
    expect(res.statusCode).toBe(403);
  });

  it('returns 500 on fetch exception', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));

    const res = await handler({ queryStringParameters: {} });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).error).toContain('Network failure');
  });

  it('handles missing queryStringParameters gracefully', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      headers: { get: () => 'application/json' },
      text: () => Promise.resolve('{}'),
    });

    const res = await handler({});
    expect(res.statusCode).toBe(200);
  });
});
