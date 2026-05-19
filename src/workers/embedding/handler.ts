import { emitEvent } from "../../lib/events";

// Minimal embedding worker scaffold — handles embedding requests.
export default async function handleEmbeddingJob(payload: any) {
  try {
    await emitEvent("generic", { job: "embedding_processed", payload });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("embedding job error", err);
  }
}
