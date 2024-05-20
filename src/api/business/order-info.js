import request from '@/utils/request'

export function getOrderInfoById(id) {
  return request({
    url: '/api/financial-order-info/get-by-id/' + id,
    method: 'get'
  })
}

export function getOrderInfoByOrderId(orderId) {
  return request({
    url: '/api/financial-order-info/get-by-order-id/' + orderId,
    method: 'get'
  })
}
