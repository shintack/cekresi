import { LocalStorage } from 'quasar';

const KEY_RAW_PROFILE = 's_raw_profile';
const KEY_ACCESS_TOKEN = 's_access_token';
const KEY_REFRESH_TOKEN = 's_refresh_token';
const KEY_CURRENT_ACCESS_ID = 's_current_access_id';
const KEY_MY_POINT = 's_my_point';

// cache
const kCPrefixKeyCache = 'DIVIRALIN_CACHEABLE_';
const kCLifeTime = 'lifetime';
const kCDefaultValueLifeTime = -1;
const kCDestroyOnLogout = 'destroyOnLogout';
const kCDefaultValueDestroyOnLogout = true;
const kCResponse = 'response';

function setOrRemove(storageKey, value) {
  if (value === null) {
    LocalStorage.remove(storageKey);
  } else {
    LocalStorage.set(storageKey, value);
  }
}

export function removeLocalStorage(key = null) {
  if (!key) {
    const localStorage = LocalStorage.getAll();
    Object.keys(localStorage).forEach(k => {
      LocalStorage.remove(k);
    });
  } else {
    const data = LocalStorage.getItem(kCPrefixKeyCache + key);
    if (data) {
      if (Object.prototype.hasOwnProperty.call(data, kCLifeTime)) {
        const time = data[kCLifeTime];
        if (time !== kCDefaultValueLifeTime) {
          const now = new Date().getTime();
          if (time < now) {
            LocalStorage.remove(kCPrefixKeyCache + key);
          }
        }
      }
    }
  }
}

export function setCredential(accessToken, refreshToken) {
  setOrRemove(KEY_ACCESS_TOKEN, accessToken);
  setOrRemove(KEY_REFRESH_TOKEN, refreshToken);
}

export function setRawProfile(data) {
  setOrRemove(KEY_RAW_PROFILE, data);
}

export function setCurrentAccessId(accessId) {
  setOrRemove(KEY_CURRENT_ACCESS_ID, accessId);
}

export function setMyPoint(data) {
  setOrRemove(KEY_MY_POINT, data);
}

export function getCredential() {
  return {
    accessToken: LocalStorage.getItem(KEY_ACCESS_TOKEN),
    refreshToken: LocalStorage.getItem(KEY_REFRESH_TOKEN),
    rawProfile: LocalStorage.getItem(KEY_RAW_PROFILE),
    currentAccessId: LocalStorage.getItem(KEY_CURRENT_ACCESS_ID),
    rawPoint: LocalStorage.getItem(KEY_MY_POINT)
  };
}

export function setApiCache(key, value, cacheConfig) {
  const data = {};
  const now = new Date().getTime();
  data[kCLifeTime] = Object.prototype.hasOwnProperty.call(
    cacheConfig,
    kCLifeTime
  )
    ? cacheConfig.lifetime + now
    : kCDefaultValueLifeTime;

  data[kCDestroyOnLogout] = Object.prototype.hasOwnProperty.call(
    cacheConfig,
    kCDestroyOnLogout
  )
    ? cacheConfig.destroyOnLogout
    : kCDefaultValueDestroyOnLogout;
  data[kCResponse] = value;
  LocalStorage.set(kCPrefixKeyCache + key, data);
}

export function getApiCache(key) {
  const data = LocalStorage.getItem(kCPrefixKeyCache + key);
  if (data && data[kCLifeTime] !== -1) {
    const now = new Date().getTime();
    if (data[kCLifeTime] > now) {
      removeLocalStorage(key);
      return null;
    }
    return data.response;
  }
  return null;
}
