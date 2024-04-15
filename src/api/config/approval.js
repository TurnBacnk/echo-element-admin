import request from '@/utils/request'

export function startOrPauseApproval(id, status) {
  return request({
    url: '/api/approval-config/start-or-pause/' + id + '/' + status,
    method: 'get'
  })
}

export function deleteConfigById(id) {
  return request({
    url: '/api/approval-config/remove-by-id/' + id,
    method: 'get'
  })
}

export function deleteConfigListByIds(ids) {
  return request({
    url: '/api/approval-config/remove-by-ids',
    method: 'post',
    data: ids
  })
}

export function getConfigById(id) {
  return request({
    url: '/api/approval-config/get-by-id/' + id,
    method: 'get'
  })
}
