/**
 * Test setup: provide a working in-memory localStorage.
 *
 * Node 24+ defines a global `localStorage` accessor that returns undefined
 * unless the process is started with --localstorage-file, and jsdom no longer
 * supplies one either. Storage-dependent tests (fighterProfile, storage,
 * recommendations) need a real Storage implementation, so install an
 * in-memory polyfill whenever the global is missing or inert.
 *
 * Methods live on MemoryStorage.prototype, which is also exposed as the
 * global `Storage`, so existing tests that stub via
 * `vi.spyOn(Storage.prototype, 'getItem')` intercept calls as expected.
 */

class MemoryStorage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const g = globalThis as Record<string, unknown>;

if (g.localStorage == null || g.sessionStorage == null) {
  g.Storage = MemoryStorage;
  for (const name of ['localStorage', 'sessionStorage']) {
    if (g[name] == null) {
      Object.defineProperty(globalThis, name, {
        value: new MemoryStorage(),
        writable: true,
        configurable: true,
      });
    }
  }
}
