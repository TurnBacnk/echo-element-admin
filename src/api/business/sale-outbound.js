import request from '@/utils/request'

export function getSaleOutboundInfoById(id) {
  return request({
    url: '/api/sale-outbound/get-sale-outbound-by-id/' + id,
    method: 'get'
  })
}
