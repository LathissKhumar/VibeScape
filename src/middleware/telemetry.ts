// Central telemetry initializer - safe to import anywhere
import { Sentry } from "../lib/sentry";
import { Otel } from "../lib/otel";

// This module intentionally does not export runtime logic; importing it ensures
// telemetry SDKs are initialized where appropriate (server startup).
export const telemetryReady = { sentry: !!Sentry, otel: !!Otel };
