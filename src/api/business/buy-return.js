import request from '@/utils/request'

export function submitReturnOrderById(id) {
  return request({
    url: '/api/return-order/submit-single-by-id/' + id,
    method: 'get'
  })
}

export function submitReturnOrderByIds(ids) {
  return request({
    url: '/api/return-order/submit-batch-by-ids',
    method: 'post',
  })
}

export function delBuyReturnOrderByIds(ids) {
  return request({
    url: '/api/return-order/del-return-order-by-ids',
    method: 'post',
    data: ids
  })
}

export function delBuyReturnOrderById(id) {
  return request({
    url: '/api/return-order/del-return-order-by-id/' + id,
    method: 'get'
  })
}

export function getReturnOrderByInboundId(inboundId) {
  return request({
    url: '/api/return-order/get-return-order-by-inboundId/' + inboundId,
    method: 'get'
  })
}

export function getReturnOrderById(id) {
  return request({
    url: '/api/return-order/get-return-order-by-id/' + id,
    method: 'get'
  })
}

export function getReturnOrderByCode(code) {
  return request({
    url: '/api/return-order/get-return-order-by-code/' + code,
    method: 'get'
  })
}
