// Minimal cold-tier placeholder for long-term archival storage (S3, Glacier, etc.)
// Currently unimplemented — returns null for get, and true for set/del to preserve semantics.

export const coldStore = {
  async get<T = unknown>(_key: string): Promise<T | null> {
    // Not implemented yet
    return null;
  },

  async set<T = unknown>(_key: string, _value: T): Promise<boolean> {
    // Not implemented
    return true;
  },

  async del(_key: string): Promise<boolean> {
    // Not implemented
    return true;
  },
};

export default coldStore;
