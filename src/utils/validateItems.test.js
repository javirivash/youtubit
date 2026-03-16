import validateItems from './validateItems';

const makeItem = (overrides = {}) => ({
  id: { videoId: 'abc123' },
  snippet: {
    title: 'Test Video',
    description: 'A description',
    channelTitle: 'Test Channel',
    thumbnails: { medium: { url: 'https://img.youtube.com/test.jpg' } },
  },
  ...overrides,
});

describe('validateItems', () => {
  it('transforms valid API items into internal video format', () => {
    const items = [makeItem()];
    const result = validateItems(items);
    expect(result).toEqual([
      {
        id: 'abc123',
        title: 'Test Video',
        description: 'A description',
        channelTitle: 'Test Channel',
        thumbnail: 'https://img.youtube.com/test.jpg',
        isFavorite: null,
      },
    ]);
  });

  it('filters out items missing snippet', () => {
    const items = [makeItem(), { id: { videoId: 'no-snippet' } }];
    const result = validateItems(items);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('abc123');
  });

  it('filters out items missing id.videoId', () => {
    const items = [makeItem(), { id: {}, snippet: makeItem().snippet }];
    const result = validateItems(items);
    expect(result).toHaveLength(1);
  });

  it('filters out items with no id at all', () => {
    const items = [makeItem(), { snippet: makeItem().snippet }];
    const result = validateItems(items);
    expect(result).toHaveLength(1);
  });

  it('returns empty array for empty input', () => {
    expect(validateItems([])).toEqual([]);
  });

  it('decodes HTML entities in title, description, and channelTitle', () => {
    const items = [
      makeItem({
        snippet: {
          title: 'Rock &amp; Roll &#34;Live&#34;',
          description: 'It&#39;s a &quot;great&quot; show',
          channelTitle: 'Tom &amp; Jerry&#39;s &apos;Channel&apos;',
          thumbnails: { medium: { url: 'https://img.youtube.com/test.jpg' } },
        },
      }),
    ];
    const result = validateItems(items);
    expect(result[0].title).toBe('Rock & Roll "Live"');
    expect(result[0].description).toBe('It\'s a "great" show');
    expect(result[0].channelTitle).toBe("Tom & Jerry's 'Channel'");
  });

  it('limits results to 24 items', () => {
    const items = Array.from({ length: 30 }, (_, i) =>
      makeItem({ id: { videoId: `vid-${i}` } }),
    );
    const result = validateItems(items);
    expect(result).toHaveLength(24);
  });

  it('sets isFavorite to null for all items', () => {
    const items = [makeItem(), makeItem({ id: { videoId: 'xyz' } })];
    const result = validateItems(items);
    result.forEach((item) => {
      expect(item.isFavorite).toBeNull();
    });
  });
});
