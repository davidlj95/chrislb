export const resolveSequentially = async <T>(
  promises: readonly Promise<T>[],
): Promise<readonly T[]> => {
  const resolved: T[] = []
  for (const promise of promises) {
    resolved.push(await promise)
  }
  return resolved
}
