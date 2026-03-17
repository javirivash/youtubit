import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from '../../netlify/functions/youtube-player-data.js';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const videoSnippet = {
  title: 'Test &amp; Video',
  description: 'A &#34;great&#34; video',
  channelTitle: 'Test&#39;s Channel',
  thumbnails: { medium: { url: 'https://img.youtube.com/test.jpg' } },
};

const makeDetailsResponse = (items = []) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve({ items }),
});

const makeSearchResponse = (items = []) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve({ items }),
});

beforeEach(() => {
  vi.clearAllMocks();
  process.env.YOUTUBE_API_KEY = 'test-api-key';
});

describe('youtube-player-data handler', () => {
  it('returns 500 when YOUTUBE_API_KEY is missing', async () => {
    delete process.env.YOUTUBE_API_KEY;
    const res = await handler({ queryStringParameters: { videoId: 'abc' } });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).error).toBe('Missing YOUTUBE_API_KEY');
  });

  it('returns 400 when videoId is missing', async () => {
    const res = await handler({ queryStringParameters: {} });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toBe('Missing videoId');
  });

  it('returns selected video details on success', async () => {
    mockFetch.mockResolvedValueOnce(
      makeDetailsResponse([{ snippet: videoSnippet }]),
    );

    const res = await handler({
      queryStringParameters: { videoId: 'vid-1', includeRelated: 'false' },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.selectedVideo.id).toBe('vid-1');
    expect(body.selectedVideo.title).toBe('Test & Video');
    expect(body.selectedVideo.description).toBe('A "great" video');
    expect(body.selectedVideo.channelTitle).toBe("Test's Channel");
    expect(body.selectedVideo.isFavorite).toBeNull();
    expect(body.relatedItems).toEqual([]);
  });

  it('fetches related videos when includeRelated is true', async () => {
    const relatedItems = [{ id: { videoId: 'rel-1' }, snippet: videoSnippet }];
    mockFetch
      .mockResolvedValueOnce(makeDetailsResponse([{ snippet: videoSnippet }]))
      .mockResolvedValueOnce(makeSearchResponse(relatedItems));

    const res = await handler({
      queryStringParameters: { videoId: 'vid-1', includeRelated: 'true' },
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const body = JSON.parse(res.body);
    expect(body.relatedItems).toHaveLength(1);
  });

  it('does not fetch related videos when includeRelated is false', async () => {
    mockFetch.mockResolvedValueOnce(
      makeDetailsResponse([{ snippet: videoSnippet }]),
    );

    await handler({
      queryStringParameters: { videoId: 'vid-1', includeRelated: 'false' },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('returns 404 when video is not found', async () => {
    mockFetch.mockResolvedValueOnce(makeDetailsResponse([]));

    const res = await handler({
      queryStringParameters: { videoId: 'nonexistent' },
    });

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res.body).error).toBe('Video not found');
  });

  it('passes through YouTube API error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ error: { message: 'Quota exceeded' } }),
    });

    const res = await handler({
      queryStringParameters: { videoId: 'vid-1' },
    });

    expect(res.statusCode).toBe(403);
  });

  it('returns 500 on fetch exception', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));

    const res = await handler({
      queryStringParameters: { videoId: 'vid-1' },
    });

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).error).toContain('Network failure');
  });

  it('falls back to high/default thumbnail when medium is missing', async () => {
    const snippetNoMedium = {
      ...videoSnippet,
      thumbnails: { high: { url: 'https://img.youtube.com/high.jpg' } },
    };
    mockFetch.mockResolvedValueOnce(
      makeDetailsResponse([{ snippet: snippetNoMedium }]),
    );

    const res = await handler({
      queryStringParameters: { videoId: 'vid-1', includeRelated: 'false' },
    });

    const body = JSON.parse(res.body);
    expect(body.selectedVideo.thumbnail).toBe('https://img.youtube.com/high.jpg');
  });

  it('handles missing queryStringParameters gracefully', async () => {
    const res = await handler({});
    expect(res.statusCode).toBe(400);
  });
});
