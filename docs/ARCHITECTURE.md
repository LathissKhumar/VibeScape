# Architecture

## System Overview

Resona is a **server-first** Next.js application that processes music data through a multi-stage pipeline before rendering the dashboard.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│  ┌───────────┐  ┌────────────┐  ┌───────────┐  ┌────────────┐  │
│  │ Landing   │  │ Dashboard  │  │ Compare   │  │ 3D Galaxy  │  │
│  │ Page      │  │ Client     │  │ Page      │  │ (Three.js) │  │
│  └───────────┘  └────────────┘  └───────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Server                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Auth Route   │  │ API Routes   │  │ Dashboard Page (SSR)  │ │
│  │ (NextAuth)   │  │ /api/*       │  │ Data Pipeline         │ │
│  └──────────────┘  └──────────────┘  └───────────┬───────────┘ │
└──────────────────────────────────────────────────┼─────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────┐
                    │         External APIs        │              │
                    │  ┌──────────┐  ┌──────────┐  │  ┌────────┐  │
                    │  │ YouTube  │  │ Deezer   │  │  │ Gemini │  │
                    │  │ Music    │  │ (free)   │  │  │ AI     │  │
                    │  └──────────┘  └──────────┘  │  └────────┘  │
                    └──────────────────────────────┼──────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────┐
                    │         Supabase             │              │
                    │  ┌──────────┐  ┌──────────┐  │  ┌────────┐  │
                    │  │ Postgres │  │ pgvector │  │  │ Sentry │  │
                    │  │ (data)   │  │ (embed)  │  │  │ (logs) │  │
                    │  └──────────┘  └──────────┘  │  └────────┘  │
                    └──────────────────────────────┴──────────────┘
```

## Data Pipeline

The dashboard page (`src/app/dashboard/page.tsx`) orchestrates the entire data flow:

### Stage 1: Authentication
- NextAuth.js with Credentials provider
- No OAuth required — works with anonymous YouTube Music access
- Session token passed to client

### Stage 2: Music Data Fetching (Parallel)
Three concurrent API calls:
1. **`getTopArtists(20)`** — Searches YouTube Music across 8 genres (pop, rock, hip hop, electronic, indie, jazz, classical, r&b), 3 artists each
2. **`getTopTracks(20)`** — Searches YouTube Music for trending/popular tracks across 4 queries
3. **`getListeningHistory(50)`** — Derives history from top tracks with simulated timestamps

### Stage 3: Deezer Enrichment (Sequential)
For each of the top 10 tracks:
1. **`searchTrack(title, artist)`** — Finds matching track on Deezer
2. **`getArtistGenres(artistId)`** — Fetches real genres from Deezer artist endpoint
3. Genres are cached in a `Map<string, string[]>` for reuse

### Stage 4: Audio Feature Computation
For each matched Deezer track, computes 7 audio features using a **sigmoid-based ML model**:

| Feature | Computation |
|---|---|
| **Energy** | `sigmoid(rank * 0.6 + explicitBonus + shortTrackBonus)` |
| **Valence** | `sigmoid(0.3 + rank * 0.4 + explicitBonus)` |
| **Danceability** | `sigmoid(rank * 0.5 + explicitBonus + durationBonus)` |
| **Acousticness** | `1 - sigmoid(rank * 0.5 + explicitBonus + longTrackPenalty)` |
| **Instrumentalness** | `sigmoid(duration > 6min ? 0.5 + rank * 0.3 : rank * 0.15)` |
| **Speechiness** | `sigmoid((explicit ? 0.35 : 0.08) + rank * 0.25)` |
| **Tempo** | `70 + rank * 50 + explicitBonus + shortTrackBonus` |

Inputs:
- `rank` (0-1000, normalized to 0-1): Deezer popularity score
- `duration` (minutes): Track length
- `explicit_lyrics` (boolean): Content flag

### Stage 5: AI Personality Analysis
Sends enriched data to **Gemini 2.0 Flash**:
- Top artist names + genres
- Audio feature averages
- Prompt instructs AI to choose from 12 archetypes
- Output validated and sanitized against injection attacks

### Stage 6: Client Rendering
Passes all computed data to `DashboardClient.tsx` which renders:
- PersonalityHero (archetype display)
- ListeningHeatmapSection (time-based listening patterns)
- ArtistCardsSection (top artists with aura)
- AudioRadarSection (radar chart of audio features)
- PersonalityCard (exportable card)
- Galaxy (3D artist visualization)
- MusicTwinFinder (similarity matching)
- RecommendationsSection (personalized suggestions)
- ListeningTimeline (genre evolution)
- FeatureFlagsAdminPanel (feature toggles)
- ActivityFeed (event log)

## Embedding System

### Client-Safe Architecture

To avoid bundling Node.js modules (`pg`, `dns`) in the browser, the embedding system is split:

| File | Purpose | Environment |
|---|---|---|
| `embeddings-core.ts` | Pure computation (genre weights, artist hashes) | Client + Server |
| `embeddings.ts` | DB persistence (`upsertEmbedding`) | Server only |
| `recommend/index.ts` | Imports from `embeddings-core` | Client + Server |

### Vector Generation

1. **Genre Taxonomy** (35 genres × 7 dimensions):
   - Each genre maps to a 7-element vector: `[energy, valence, danceability, acousticness, instrumentalness, speechiness, tempo]`
   - Based on music psychology research and genre characteristics

2. **Artist Profiling** (hash-based, 64 dimensions):
   - Deterministic hash function maps artist names to 64-dimensional space
   - Same artist always produces same vector

3. **Combined Vector** (64 dimensions):
   - `combined = genreWeights * 0.6 + artistWeights * 0.4`
   - L2-normalized for cosine similarity

### Similarity Matching

```
cosineSimilarity(A, B) = (A · B) / (||A|| × ||B||)
```

Results mapped to compatibility labels:
- `≥ 0.90`: Music Twin
- `≥ 0.70`: Soulmate
- `≥ 0.50`: Harmonic
- `≥ 0.30`: Familiar
- `≥ 0.10`: Distant
- `< 0.10`: Alien

## Caching Strategy

| Layer | Implementation | TTL |
|---|---|---|
| **API Response** | Supabase `spotify_cache` table | 5 minutes |
| **Feature Flags** | In-memory + Supabase cache | 7 days |
| **Rate Limiting** | Supabase Postgres sliding window | 1 minute |
| **Client Events** | localStorage (last 100 events) | Persistent |

## Error Handling

- **API failures**: Graceful fallbacks (e.g., empty arrays instead of crashes)
- **AI failures**: Default personality archetype returned
- **Database failures**: In-memory fallbacks for feature flags
- **Build safety**: No `as any`, no `@ts-ignore`, no `console.log` in new code
