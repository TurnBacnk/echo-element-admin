import request from '@/utils/request'

export function getAllNeedApproval() {
  return request({
    url: '/api/approval-instance/get-all-need-approval',
    method: 'get'
  })
}
