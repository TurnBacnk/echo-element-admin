import request from '@/utils/request'

export function getWriteOffById(id) {
  return request({
    url: '/api/financial-write-off/get-by-id/' + id,
    method: 'get'
  })
}

export function getWriteOffByCode() {}

export function getPreOrderByOrderId(id) {
  return request({
    url: '/api/financial-write-off/get-pre-order-by-order-id/' + id,
    method: 'get'
  })
}


export function getPreOrderListByClientIdAndOrderType(id, orderType) {
  return request({
    url: '/api/financial-write-off/get-pre-order-list-by-client-id-and-order-type/' + id + '/' + orderType,
    method: 'get'
  })
}
