import request from '@/utils/request'

export function getCache() {
  return request({
    url: '/api/cache/data',
    method: 'get'
  })
}

export function listCacheNames() {
  return request({
    url: '/api/cache/list',
    method: 'get'
  })
}

export function listCacheKeys(data) {
  return request({
    url: '/api/cache/keys/' + data,
    method: 'get'
  })
}

export function clearCacheName(data) {
  return request({
    url: '/api/cache/clear/' + data,
    method: 'get'
  })
}

export function getCacheValue(cacheName, cacheKey) {
  return request({
    url: '/api/cache/getValue/' + cacheName + '/' + cacheKey,
    method: 'get'
  })
}

export function clearCacheKey(cacheKey) {
  return request({
    url: '/api/cache/clearCacheKey/' + cacheKey,
    method: 'get'
  })
}

export function clearCacheAll() {
  return request({
    url: '/api/cache/clearAllCache',
    method: 'get'
  })
}
