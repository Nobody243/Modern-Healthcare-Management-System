import test from 'node:test';
import assert from 'node:assert/strict';

// In-memory cache simulation matching lib/api-cache.ts
class ApiCache {
  constructor(defaultTTL = 30000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  invalidate(urlPrefix) {
    let deletedCount = 0;
    for (const key of this.cache.keys()) {
      if (!urlPrefix || key.startsWith(urlPrefix)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  clear() {
    const count = this.cache.size;
    this.cache.clear();
    return count;
  }
}

test('API Cache Manager Suite', async (t) => {
  await t.test('Sets and retrieves unexpired cached values', () => {
    const cache = new ApiCache(5000);
    cache.set('/api/patients', [{ id: 1, name: 'Alice' }]);

    const retrieved = cache.get('/api/patients');
    assert.deepStrictEqual(retrieved, [{ id: 1, name: 'Alice' }]);
  });

  await t.test('Expires items after TTL duration', async () => {
    const cache = new ApiCache(50); // 50ms TTL
    cache.set('/api/doctors', [{ id: 1, name: 'Dr. John' }], 50);

    assert.ok(cache.get('/api/doctors') !== null);
    await new Promise(r => setTimeout(r, 60));
    assert.strictEqual(cache.get('/api/doctors'), null);
  });

  await t.test('Invalidates specific endpoint prefix properly', () => {
    const cache = new ApiCache(5000);
    cache.set('/api/patients', [{ id: 1 }]);
    cache.set('/api/patients?page=2', [{ id: 2 }]);
    cache.set('/api/doctors', [{ id: 99 }]);

    const count = cache.invalidate('/api/patients');
    assert.strictEqual(count, 2);
    assert.strictEqual(cache.get('/api/patients'), null);
    assert.strictEqual(cache.get('/api/patients?page=2'), null);
    assert.ok(cache.get('/api/doctors') !== null);
  });

  await t.test('Clear empties all keys in cache', () => {
    const cache = new ApiCache(5000);
    cache.set('/api/vitals', [1, 2, 3]);
    cache.set('/api/surgery', [4, 5, 6]);

    cache.clear();
    assert.strictEqual(cache.get('/api/vitals'), null);
    assert.strictEqual(cache.get('/api/surgery'), null);
  });
});
