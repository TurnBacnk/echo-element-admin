import request from '@/utils/request'

export function setDefaultById(id) {
  return request({
    url: '/api/capital-account/set-default/' + id,
    method: 'get'
  })
}

export function getCapitalAccountById(id) {
  return request({
    url: '/api/capital-account/get-by-id/' + id,
    method: 'get'
  })
}

export function deleteCapitalAccountById(id) {
  return request({
    url: '/api/capital-account/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteCapitalAccountByIds(ids) {
  return request({
    url: '/api/capital-account/delete-by-ids',
    method: 'post',
    data: ids
  })
}
