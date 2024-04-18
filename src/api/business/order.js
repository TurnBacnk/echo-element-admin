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

export function delBuyOrderByIds(ids) {
  return request({
    url: '/api/order/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitBuyOrderByIds(ids) {
  return request({
    url: '/api/order/submit-order-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitBuyOrderById(id) {
  return request({
    url: '/api/order/submit-order-by-id/' + id,
    method: 'get'
  })
}

export function getBuyOrderByCode(code) {
  return request({
    url: '/api/order/get-order-by-code/' + code,
    method: 'get'
  })
}
