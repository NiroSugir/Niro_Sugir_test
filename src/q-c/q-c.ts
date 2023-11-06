import { MiniPubSub } from "./MiniPubSub";
import { GeoDistributedLRUCache } from "./GeoDistributedLRUCache";

/**
 * Design:
 * - Each cache is a node in a pub/sub system. Each cache subscribes to the pub/sub.
 * - When a cache is updated, it publishes the update to the pub/sub.
 * - Each cache receives the update and updates its own cache.
 * - Each cache is responsible for its own cache. It is not responsible for
 *  other caches. This is a simple implementation of a distributed cache.
 * - When setting a new value to cache, the cache will check if over the capacity
 *   and evict the least recently used item if it is over capacity.
 * - When retrieving from cache, it will return null if none are found, or the
 *   value if it is found. It will also resort the list by forcing the cache
 *   entry to the end for most recent used.
 * - When setting a new value to cache, it will check if the key already exists.
 *   If it does, it will remove the old value and set the new value. If it does
 *   not exist, it will check if it is over capacity and evict the least recently
 *   used item if it is over capacity.
 * - When savign to cache, it will serialize the value to JSON for flexible
 *   schema. When reading, it will do the same. Anything serializable is cachable
 *   therefore.
 */

/**
 * Missing features and info:
 * - Persistence to storage for crash recovery
 * - Retries after Network failures. Different failures would require different
 *   strategies. For example, if another cache is down, we could retry after a few
 *   seconds and notify sys admin. If local network is down, we need to keep
 *   retrying until it comes back up without much wait.
 * - The pub/sub system would need to be more feature-rich. For example, if a cache
 *   goes down, it should be able to recover and resubscribe to the pub/sub. The
 *   pub/subs themselves need to be highly available and fault tolerant. This simple
 *   implementation uses a single pub/sub. The latency to this one would be a bottleneck
 *   and a single point of failure. There should be a pub/sub per region, and then
 *   a global pub/sub that is responsible for routing messages to the correct region.
 * - The pub/sub is missing unsubscribe features. Each cache needs to have an id
 *   to identify itself to the pub/sub. This way, the pub/sub can unsubscribe
 *   a cache if it goes down and logs would be able to identify across services.
 * - For perfect consistency, when publishing an update, the cache should send
 *   the expiry time instead of ttl. The latency will be extendiing the real ttl *
 **/

// Create the Pub/Sub system
const pubSub = new MiniPubSub(); // this would be something like Kafka

const montreal = new GeoDistributedLRUCache(100, pubSub);
const ny = new GeoDistributedLRUCache(100, pubSub);
const paris = new GeoDistributedLRUCache(100, pubSub);

pubSub.subscribe(montreal);
pubSub.subscribe(ny);
pubSub.subscribe(paris);

// print initial values
console.log("Initial values:");
console.log("Montreal:", montreal.get("test"));
console.log("NY", ny.get("test"));

console.log("Set new value in Montreal, then let it propagate:");
montreal.set("test", [{ string: "cached value" }], 30000);

// prove that the values are consistent in real-time (nothing's perfectly real-time)
console.log("Montreal:", montreal.get("test"));
console.log("NY:", ny.get("test"));

// User gets from closest cache. This would really be done using a service
// capable of geoip lookups and then routing to the closest cache.
const userFromMontreal = montreal.get("test");
console.log("userFromMontreal:", userFromMontreal);
