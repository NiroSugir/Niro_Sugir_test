import { GeoDistributedLRUCache } from "./GeoDistributedLRUCache";
import { CacheUpdate } from "./types";

// This should be something like Kafka or Redis. Creating a small mock to show
// the idea for coordinated updates.
export class MiniPubSub {
  private subscribers: GeoDistributedLRUCache[];

  constructor() {
    this.subscribers = [];
  }

  // Subscribe a cache to the Pub/Sub updates
  subscribe(cache: GeoDistributedLRUCache): void {
    this.subscribers.push(cache);
  }

  // Publish an update to all subscribers (caches)
  publish(update: CacheUpdate): void {
    // For network resilience, this should retry the publish if it fails. After
    // persisten fails, it should consider that subscriber to be offline and
    // remove it from the list of subscribers while logging/alerting to get to
    // re-establish the connection.
    for (const subscriber of this.subscribers) {
      subscriber.set(
        update.key,
        JSON.parse(update.serializedValue),
        update.ttl,
        false
      );
    }
  }
}
