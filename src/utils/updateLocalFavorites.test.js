import updateLocalFavorites from './updateLocalFavorites';

const makeVideo = (id, isFavorite = null) => ({
  id,
  title: `Video ${id}`,
  isFavorite,
});

const makeFavorite = (id) => ({
  id,
  title: `Video ${id}`,
  isFavorite: true,
});

describe('updateLocalFavorites', () => {
  it('returns results, related, and favorites keys', () => {
    const result = updateLocalFavorites([], [], []);
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('related');
    expect(result).toHaveProperty('favorites');
  });

  it('passes through videos unchanged when there are no favorites', () => {
    const results = [makeVideo('a'), makeVideo('b')];
    const related = [makeVideo('c')];
    const output = updateLocalFavorites(results, related, []);
    expect(output.results).toEqual(results);
    expect(output.related).toEqual(related);
    expect(output.favorites).toEqual([]);
  });

  it('marks matching videos as isFavorite when favorites overlap', () => {
    const results = [makeVideo('a'), makeVideo('b')];
    const related = [makeVideo('c')];
    const favorites = [makeFavorite('a'), makeFavorite('c')];

    const output = updateLocalFavorites(results, related, favorites);
    expect(output.results.find((v) => v.id === 'a').isFavorite).toBe(true);
    expect(output.results.find((v) => v.id === 'b').isFavorite).toBeNull();
    expect(output.related.find((v) => v.id === 'c').isFavorite).toBe(true);
  });

  it('unfavorites videos that were previously marked but no longer in favorites', () => {
    const results = [makeVideo('a', true), makeVideo('b', true)];
    const related = [];
    const favorites = [makeFavorite('a')];

    const output = updateLocalFavorites(results, related, favorites);
    expect(output.results.find((v) => v.id === 'a').isFavorite).toBe(true);
    expect(output.results.find((v) => v.id === 'b').isFavorite).toBe(false);
  });

  it('handles empty result and related arrays', () => {
    const favorites = [makeFavorite('a')];
    const output = updateLocalFavorites([], [], favorites);
    expect(output.results).toEqual([]);
    expect(output.related).toEqual([]);
    expect(output.favorites).toEqual(favorites);
  });

  it('handles favorites that do not match any video', () => {
    const results = [makeVideo('a')];
    const favorites = [makeFavorite('z')];
    const output = updateLocalFavorites(results, [], favorites);
    expect(output.results.find((v) => v.id === 'a').isFavorite).toBeNull();
  });

  it('marks all matching videos when all results are favorites', () => {
    const results = [makeVideo('a'), makeVideo('b')];
    const favorites = [makeFavorite('a'), makeFavorite('b')];

    const output = updateLocalFavorites(results, [], favorites);
    output.results.forEach((v) => {
      expect(v.isFavorite).toBe(true);
    });
  });
});
