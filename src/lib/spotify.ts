export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images?: { url: string; height?: number; width?: number }[];
  external_urls?: { spotify: string };
  followers?: { total: number };
}

export interface SpotifyTrack {
  id: string;
  name: string;
}

export interface SpotifyAudioFeatures {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  tempo: number;
}

export interface SpotifyRecentlyPlayed {
  played_at: string;
  track: { id: string; name: string };
}
