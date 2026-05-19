import { emitEvent } from "../../lib/events";

// Minimal analytics worker scaffold — processes analytics batch payloads.
export default async function handleAnalyticsJob(payload: any) {
  try {
    await emitEvent("generic", { job: "analytics_processed", payload });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("analytics job error", err);
  }
}
