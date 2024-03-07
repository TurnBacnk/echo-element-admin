import request from '@/utils/request'

export function insertDictionary(data) {
  return request({
    url: '/api/dict/insert-dict',
    method: 'post',
    data: data
  })
}

export function updateDictionary(data) {
  return request({
    url: '/api/dict/update-dict',
    method: 'post',
    data: data
  })
}

export function batchDeleteDictionary(ids) {
  return request({
    url: '/api/dict/delete',
    method: 'post',
    data: ids
  })
}

export function getSingleDict(id) {
  return request({
    url: '/api/dict/get-single-dict/' + id,
    method: 'get'
  })
}
