import request from '@/utils/request'

export function getWriteOffById(id) {
  return request({
    url: '/api/financial-write-off/get-by-id/' + id,
    method: 'get'
  })
}

export function getWriteOffByCode(code) {
  return request({
    url: '/api/financial-write-off/get-by-code/' + code,
    method: 'get'
  })
}

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

export function deleteWriteOffById(id) {
  return request({
    url: '/api/financial-write-off/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteWriteOffByIds(ids) {
  return request({
    url: '/api/financial-write-off/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitWriteOffOrderByIds(ids) {
  return request({
    url: '/api/financial-write-off/submit-batch-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitWriteOffOrderById(id) {
  return request({
    url: '/api/financial-write-off/submit-single-by-id/' + id,
    method: 'get'
  })
}
