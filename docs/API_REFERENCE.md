# API Reference

## Authentication

### `GET/POST /api/auth/[...nextauth]`

NextAuth.js handler. Supports Credentials provider for anonymous YouTube Music access.

**Sign In:**
```ts
import { signIn } from "next-auth/react";
await signIn("credentials");
```

**Session:**
```ts
import { getServerSession } from "next-auth/next";
const session = await getServerSession(authOptions);
```

## Recommendations

### `POST /api/recommend/personalized`

Returns personalized music recommendations based on user profile.

**Request:**
```json
{
  "profile": {
    "genres": ["indie rock", "electronic", "ambient"],
    "topArtists": ["Radiohead", "Daft Punk", "Bon Iver"]
  },
  "candidates": {
    "genres": ["techno", "house"],
    "topArtists": ["Carl Cox", "Charlotte de Witte"]
  }
}
```

**Response:**
```json
{
  "ok": true,
  "recommendations": [
    {
      "type": "genre",
      "label": "Explore house",
      "reason": "Fans of electronic often enjoy house",
      "confidence": 0.6
    },
    {
      "type": "mood",
      "label": "Deep Listening Session",
      "reason": "Based on your taste in Radiohead & Daft Punk...",
      "confidence": 0.5
    }
  ],
  "basedOnProfile": {
    "genres": ["indie rock", "electronic", "ambient"],
    "topArtists": ["Radiohead", "Daft Punk", "Bon Iver"]
  }
}
```

**Rate Limit:** 30 requests per minute per IP.

### `POST /api/recommend/vibe-compatibility`

Computes vibe compatibility between two user profiles.

**Request:**
```json
{
  "profileA": {
    "genres": ["indie rock", "electronic"],
    "topArtists": ["Radiohead", "Daft Punk"]
  },
  "profileB": {
    "genres": ["post-rock", "ambient"],
    "topArtists": ["Sigur Rós", "Explosions in the Sky"]
  }
}
```

**Response:**
```json
{
  "ok": true,
  "compatibility": {
    "score": 0.723,
    "label": "Soulmate — extremely compatible"
  },
  "sharedGenres": ["electronic"]
}
```

**Rate Limit:** 30 requests per minute per IP.

## Profile

### `POST /api/profile`

Persist user profile or find similar users.

**Persist Profile:**
```json
{
  "action": "persist",
  "profile": {
    "genres": ["indie rock", "electronic"],
    "topArtists": ["Radiohead", "Daft Punk"]
  }
}
```

**Find Similar Users:**
```json
{
  "action": "find_similar",
  "userId": "anonymous",
  "limit": 3
}
```

**Response:**
```json
{
  "ok": true,
  "results": [
    { "entity_id": "user-1", "similarity": 0.847 },
    { "entity_id": "user-2", "similarity": 0.723 },
    { "entity_id": "user-3", "similarity": 0.612 }
  ]
}
```

**Rate Limit:** 10 requests per minute per IP.

## Feature Flags

### `GET /api/feature-flags`

Returns all feature flags.

**Response:**
```json
{
  "flags": {
    "galaxy_3d": true,
    "friend_comparison": true,
    "personality_card_export": true,
    "listening_timeline": true,
    "ai_insights": true
  }
}
```

### `POST /api/feature-flags`

Toggle a feature flag.

**Request:**
```json
{
  "key": "galaxy_3d",
  "value": false
}
```

**Response:**
```json
{ "ok": true }
```

## Analytics

### `POST /api/analytics`

Track user events.

**Request:**
```json
{
  "type": "section_view",
  "section": "sonic-dna",
  "element": "audio-radar",
  "metadata": { "duration": 5.2 },
  "timestamp": 1716307200000
}
```

**Response:**
```json
{ "ok": true }
```

**Rate Limit:** 100 requests per minute per IP.

## Workers

### `POST /api/workers`

Async job handler for background tasks.

**Request:**
```json
{
  "type": "analytics",
  "payload": { "action": "refresh_nightly" }
}
```

**Response:**
```json
{ "ok": true, "jobId": "job-123" }
```

## Error Responses

All endpoints return consistent error format:

```json
{
  "ok": false,
  "error": "error_code"
}
```

| Error Code | HTTP Status | Description |
|---|---|---|
| `invalid_json` | 400 | Request body is not valid JSON |
| `missing profile` | 400 | Required profile field missing |
| `rate_limited` | 429 | Too many requests |
| `invalid_action` | 400 | Unknown action parameter |
