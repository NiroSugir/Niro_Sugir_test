import { MiniPubSub } from "./MiniPubSub";
import { CacheItem, IGeoDistributedCache, Serializable } from "./types";

export class GeoDistributedLRUCache implements IGeoDistributedCache {
  private cache: Map<string, CacheItem>;
  private maxSize: number;
  private pubSub: MiniPubSub;

  constructor(maxSize: number, pubSub: MiniPubSub) {
    this.cache = new Map<string, CacheItem>();
    this.maxSize = maxSize;
    this.pubSub = pubSub;

    // TODO:
    // For crash recovery, this should load the cache from disk and then
    // coordinate with the other caches to ensure they are all in sync.
  }

  get(key: string): Serializable | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (item.expiresAt < now) {
      this.cache.delete(key);
      return null;
    }

    // Deserialize the value before returning
    try {
      const value = JSON.parse(item.serializedValue);
      // Refresh the item in the cache
      this.cache.delete(key);
      this.cache.set(key, item);

      // TODO: For crash recovery, this should be persisted to disk

      return value;
    } catch (e) {
      console.error("Failed to deserialize the value for key:", key, e);
      return null;
    }
  }

  set(
    key: string,
    value: Serializable,
    ttl: number,
    broadcast: boolean = true
  ): void {
    let serializedValue: string;

    // Attempt to serialize the value
    try {
      serializedValue = JSON.stringify(value);
    } catch (e) {
      console.error("Failed to serialize the value for key:", key, e);
      return;
    }

    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (LRU) item
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }

    const expiresAt = Date.now() + ttl;

    // if the call to set came from the pubSub, then don't republish the update
    if (broadcast) {
      this.pubSub.publish({ key, serializedValue: serializedValue, ttl }); // Publish the update
    }

    this.cache.set(key, { serializedValue, expiresAt });

    // TODO:
    // for crash recovery, this should be persisted to disk and then cache
    // should be repopulated from disk on startup using the constructor
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
