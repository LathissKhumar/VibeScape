import { refreshMaterializedViews } from "../../lib/analytics";

export default async function handleAnalyticsJob(_payload: unknown) {
  await refreshMaterializedViews();
}
