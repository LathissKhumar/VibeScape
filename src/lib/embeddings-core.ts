export function computeProfileEmbedding(genres: string[], topArtists: string[], dim = 64) {
  const genreWeights = computeGenreWeights(genres);
  const artistWeights = computeArtistWeights(topArtists);

  const combined = new Array(dim).fill(0);
  for (let i = 0; i < dim; i++) {
    combined[i] = ((genreWeights[i] ?? 0) * 0.6 + (artistWeights[i] ?? 0) * 0.4);
  }

  const mag = Math.sqrt(combined.reduce((acc, v) => acc + v * v, 0)) || 1;
  return combined.map((v) => v / mag);
}

function computeGenreWeights(genres: string[]): number[] {
  const genreMap: Record<string, number[]> = {
    "pop": [0.8, 0.7, 0.9, 0.2, 0.1, 0.3, 120],
    "rock": [0.9, 0.5, 0.4, 0.3, 0.4, 0.2, 130],
    "hip hop": [0.7, 0.6, 0.8, 0.1, 0.1, 0.8, 95],
    "electronic": [0.8, 0.4, 0.9, 0.2, 0.6, 0.1, 128],
    "indie": [0.5, 0.6, 0.5, 0.6, 0.3, 0.3, 110],
    "jazz": [0.3, 0.7, 0.4, 0.7, 0.5, 0.2, 100],
    "classical": [0.1, 0.3, 0.2, 0.9, 0.8, 0.05, 80],
    "r&b": [0.5, 0.8, 0.7, 0.3, 0.1, 0.4, 90],
    "metal": [1.0, 0.3, 0.3, 0.1, 0.3, 0.2, 150],
    "folk": [0.3, 0.7, 0.3, 0.8, 0.2, 0.2, 100],
    "country": [0.5, 0.8, 0.6, 0.5, 0.1, 0.3, 115],
    "reggae": [0.4, 0.9, 0.8, 0.3, 0.1, 0.2, 85],
    "latin": [0.7, 0.9, 0.9, 0.2, 0.05, 0.3, 110],
    "k-pop": [0.7, 0.7, 0.8, 0.2, 0.1, 0.3, 120],
    "ambient": [0.1, 0.4, 0.2, 0.8, 0.7, 0.05, 70],
    "techno": [0.9, 0.3, 0.9, 0.1, 0.5, 0.1, 135],
    "house": [0.7, 0.6, 0.9, 0.2, 0.3, 0.1, 125],
    "indie rock": [0.8, 0.5, 0.4, 0.4, 0.3, 0.2, 125],
    "post-rock": [0.6, 0.5, 0.3, 0.6, 0.5, 0.1, 110],
    "soul": [0.4, 0.8, 0.6, 0.4, 0.1, 0.3, 95],
    "funk": [0.6, 0.9, 0.8, 0.2, 0.1, 0.3, 110],
    "blues": [0.4, 0.5, 0.4, 0.6, 0.3, 0.2, 95],
    "punk": [0.9, 0.4, 0.5, 0.2, 0.1, 0.3, 160],
    "trap": [0.7, 0.5, 0.8, 0.1, 0.05, 0.7, 140],
    "dance pop": [0.7, 0.8, 0.9, 0.1, 0.05, 0.2, 125],
    "electropop": [0.6, 0.7, 0.8, 0.2, 0.3, 0.15, 120],
    "deep house": [0.5, 0.6, 0.8, 0.3, 0.4, 0.1, 122],
    "minimal techno": [0.6, 0.3, 0.7, 0.2, 0.6, 0.05, 130],
    "neo soul": [0.4, 0.8, 0.6, 0.5, 0.1, 0.3, 90],
    "hard rock": [0.9, 0.4, 0.4, 0.2, 0.3, 0.2, 140],
    "singer-songwriter": [0.3, 0.7, 0.3, 0.7, 0.2, 0.3, 100],
    "americana": [0.4, 0.7, 0.4, 0.6, 0.2, 0.2, 110],
    "dancehall": [0.6, 0.8, 0.9, 0.1, 0.05, 0.4, 105],
    "reggaeton": [0.7, 0.8, 0.9, 0.1, 0.05, 0.4, 100],
    "j-pop": [0.7, 0.7, 0.7, 0.2, 0.1, 0.2, 130],
    "alternative rock": [0.8, 0.5, 0.4, 0.3, 0.3, 0.2, 125],
    "shoegaze": [0.5, 0.4, 0.3, 0.5, 0.4, 0.1, 110],
  };

  const weights = new Array(64).fill(0);
  const seen = new Set<string>();
  const genreItems = genres.slice(0, 10);
  const genreCount = genreItems.length;

  for (const genre of genreItems) {
    const normalized = genre.toLowerCase().trim();
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    const vector = genreMap[normalized] || genreMap["pop"] || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 100];
    const multiplier = genreCount > 0 ? 1 / genreCount : 0;

    weights[0] += (vector[0] ?? 0) * multiplier;
    weights[1] += (vector[1] ?? 0) * multiplier;
    weights[2] += (vector[2] ?? 0) * multiplier;
    weights[3] += (vector[3] ?? 0) * multiplier;
    weights[4] += (vector[4] ?? 0) * multiplier;
    weights[5] += (vector[5] ?? 0) * multiplier;
    weights[6] += ((vector[6] ?? 120) / 200) * multiplier;
  }

  return weights;
}

function computeArtistWeights(artists: string[]): number[] {
  const weights = new Array(64).fill(0);
  const seen = new Set<string>();
  const artistItems = artists.slice(0, 10);
  const artistCount = artistItems.length;

  for (const artist of artistItems) {
    const normalized = artist.toLowerCase().trim();
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    const multiplier = artistCount > 0 ? 1 / artistCount : 0;

    for (let i = 7; i < 64; i++) {
      weights[i] = (weights[i] ?? 0) + (hashArtist(normalized, i) / 200) * multiplier;
    }
  }

  return weights;
}

function hashGenre(genre: string, index: number): number {
  let hash = 0;
  const str = `${genre}:${index}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 100;
}

function hashArtist(artist: string, index: number): number {
  let hash = 0;
  const str = `${artist}:${index}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 100;
}
