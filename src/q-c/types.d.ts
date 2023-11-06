export type Serializable = string | number | boolean | object | null;

export type CacheUpdate = {
  key: string;
  serializedValue: string; // serialized value
  ttl: number;
};

// CacheItem represents an item stored in the cache
export type CacheItem = {
  serializedValue: string;
  expiresAt: number; // Timestamp indicating when this item should expire
};

export type IGeoDistributedCache = {
  get(key: string): Serializable;
  set(key: string, value: Serializable, ttl: number, republish: boolean): void;
  remove(key: string): void;
  clear(): void;
};
