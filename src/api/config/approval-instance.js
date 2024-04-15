import request from '@/utils/request'

export function getAllNeedApproval() {
  return request({
    url: '/api/approval-instance/get-all-need-approval',
    method: 'get'
  })
}

export function startInstance(data) {
  return request({
    url: '/api/approval-instance/start-instance',
    method: 'post',
    data: data
  })
}

export function approvalPassOrRefuse(data) {
  return request({
    url: '/api/approval-instance/approval-pass-or-refuse',
    method: 'post',
    data: data
  })
}
