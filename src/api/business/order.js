import request from '@/utils/request'

export function getOrderById(id) {
  return request({
    url: '/api/order/get-order-by-id/' + id,
    method: 'get'
  })
}

export function voidOrderByIds(ids) {
  return request({
    url: '/api/order/void-order-by-ids',
    method: 'post',
    data: ids
  })
}
