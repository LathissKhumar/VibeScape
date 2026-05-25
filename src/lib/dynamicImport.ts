/**
 * Safe dynamic require wrapper.
 * Used only for optional peer dependencies that may not be installed
 * in all environments. The eval("require") pattern is necessary because Next.js
 * tree-shakes static imports for packages not in package.json.
 */
export function dynamicRequire<T = unknown>(moduleId: string): T | null {
  try {
    // eslint-disable-next-line no-eval
    const req = eval("require") as (id: string) => T;
    return req(moduleId);
  } catch {
    return null;
  }
}
