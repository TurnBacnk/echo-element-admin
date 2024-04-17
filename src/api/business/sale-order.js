import request from '@/utils/request'

export function delSaleOrderByIds(ids) {
  return request({
    url: '/api/sale-order/del-by-ids',
    method: 'post',
    data: ids
  })
}

export function delSaleOrderById(id) {
  return request({
    url: '/api/sale-order/del-by-id/' + id,
    method: 'get'
  })
}

export function submitBatchByIds(ids) {
  return request({
    url: '/api/sale-order/submit-batch',
    method: 'post',
    data: ids
  })
}

export function getSaleOrderInfoById(id) {
  return request({
    url: '/api/sale-order/get-sale-order-by-id/' + id,
    method: 'get',
    data: id
  })
}

export function submitSingleById(id) {
  return request({
    url: '/api/sale-order/submit-single-by-id/' + id,
    method: 'get'
  })
}

export function getSaleOrderInfoByCode(code) {
  return request({
    url: '/api/sale-order/get-sale-order-by-code/' + code,
    method: 'get'
  })
}
