import hash from 'object-hash';

type LocalStorageItem<T> = {
  data: T;
  hash?: string;
};

// This object is used for hashing
// if data or user agent changes, the hash will change
type Hash<T> = {
  data: T;
  userAgent: string;
};

export function getItem<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const parsedObject = JSON.parse(item) as LocalStorageItem<T>;
  if (!parsedObject.hash) return parsedObject.data;

  const hashObject: Hash<T> = {
    data: parsedObject.data,
    userAgent: navigator.userAgent,
  };

  const hashValue = hash(hashObject);
  if (hashValue === parsedObject.hash) return parsedObject.data;

  localStorage.removeItem(key);
  return null;
}

export function setItem<T>(key: string, value: T, hashed?: boolean) {
  const item: LocalStorageItem<T> = {
    data: value,
  };

  if (hashed) {
    const hashObject: Hash<T> = {
      data: value,
      userAgent: navigator.userAgent,
    };

    item.hash = hash(hashObject);
  }

  localStorage.setItem(key, JSON.stringify(item));
}

// Optional
export function removeItem(key: string) {
  localStorage.removeItem(key);
}
