import { MiniPubSub } from "./MiniPubSub";
import { GeoDistributedLRUCache } from "./GeoDistributedLRUCache";

describe("MiniPubSub", () => {
  let pubSub: MiniPubSub;
  let cache1: GeoDistributedLRUCache;
  let cache2: GeoDistributedLRUCache;

  beforeEach(() => {
    pubSub = new MiniPubSub();
    cache1 = new GeoDistributedLRUCache(3, pubSub);
    cache2 = new GeoDistributedLRUCache(3, pubSub);
  });

  it("should subscribe a cache", () => {
    pubSub.subscribe(cache1);
    expect((pubSub as any).subscribers).toContain(cache1);
  });

  it("should publish an update to all subscribers", () => {
    pubSub.subscribe(cache1);
    pubSub.subscribe(cache2);

    const update = {
      key: "key1",
      serializedValue: JSON.stringify("value1"),
      ttl: 5000,
    };
    pubSub.publish(update);

    expect(cache1.get("key1")).toBe("value1");
    expect(cache2.get("key1")).toBe("value1");
  });
});
