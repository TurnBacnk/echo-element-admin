import request from '@/utils/request'

export function getOtherReceiveById(id) {
  return request({
    url: '/api/financial-other-receive/get-by-id/' + id,
    method: 'get'
  })
}

export function getOtherReceiveByCode(code) {
  return request({
    url: '/api/financial-other-receive/get-by-code/' + code,
    method: 'get'
  })
}

export function submitOtherReceiveById(id) {
  return request({
    url: '/api/financial-other-receive/submit-by-id/' + id,
    method: 'get'
  })
}

export function submitOtherReceiveByIds(ids) {
  return request({
    url: '/api/financial-other-receive/submit-by-ids',
    method: 'post',
    data: ids
  })
}

export function deleteOtherReceiveById(id) {
  return request({
    url: '/api/financial-other-receive/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteOtherReceiveByIds(ids) {
  return request({
    url: '/api/financial-other-receive/delete-by-ids',
    method: 'post',
    data: ids
  })
}
