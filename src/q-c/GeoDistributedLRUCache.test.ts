import { GeoDistributedLRUCache } from "./GeoDistributedLRUCache";
import { MiniPubSub } from "./MiniPubSub";

describe("GeoDistributedLRUCache", () => {
  let cache: GeoDistributedLRUCache;
  let pubSub: MiniPubSub;

  beforeEach(() => {
    pubSub = new MiniPubSub();
    cache = new GeoDistributedLRUCache(3, pubSub);
  });

  it("should set and get a value", () => {
    cache.set("key1", "value1", 5000);
    expect(cache.get("key1")).toBe("value1");
  });

  it("should return null for a non-existent key", () => {
    expect(cache.get("nonExistentKey")).toBeNull();
  });

  it("should overwrite an existing key", () => {
    cache.set("key1", "value1", 5000);
    cache.set("key1", "value2", 5000);
    expect(cache.get("key1")).toBe("value2");
  });

  it("should evict least recently used item when max size is reached", () => {
    cache.set("key1", "value1", 5000);
    cache.set("key2", "value2", 5000);
    cache.set("key3", "value3", 5000);
    cache.set("key4", "value4", 5000);
    expect(cache.get("key1")).toBeNull();
  });

  it("should remove a key", () => {
    cache.set("key1", "value1", 5000);
    cache.remove("key1");
    expect(cache.get("key1")).toBeNull();
  });

  it("should clear all keys", () => {
    cache.set("key1", "value1", 5000);
    cache.set("key2", "value2", 5000);
    cache.clear();
    expect(cache.get("key1")).toBeNull();
    expect(cache.get("key2")).toBeNull();
  });
});
