/** get nested id for an object  */
export function nestedId<T>(doc: T, key: keyof T): string {
  return typeof doc[key] === 'string' ? doc[key] : (doc[key] as any).id;
}
