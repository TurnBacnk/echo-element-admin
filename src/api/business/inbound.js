import request from '@/utils/request'

export function delInboundOrderByIds(ids) {
  return request({
    url: '/api/inbound-order/del-by-ids',
    method: 'post',
    data: ids
  })
}
