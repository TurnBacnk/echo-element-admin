import request from '@/utils/request'

export function getSalesOrderById(id) {
  return request({
    url: '/api/sales/order/get-by-id/' + id,
    method: 'get'
  })
}

export function getSalesOrderByCode(code) {
  return request({
    url: '/api/sales/order/get-by-code/' + code,
    method: 'get'
  })
}

export function deleteSalesOrderById(id) {
  return request({
    url: '/api/sales/order/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteSalesOrderByIds(ids) {
  return request({
    url: '/api/sales/order/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitSalesOrderByIds(ids) {
  return request({
    url: '/api/sales/order/submit-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitSalesOrderById(id) {
  return request({
    url: '/api/sales/order/submit-by-id/' + id,
    method: 'get'
  })
}

export function procurement(ids) {
  return request({
    url: '/api/sales/order/procurement',
    method: 'post',
    data: ids
  })
}

export function out(ids) {
  return request({
    url: '/api/sales/order/out',
    method: 'post',
    data: ids
  })
}

export function batchProcurement(ids) {
  return request({
    url: '/api/sales/order/batch-procurement',
    method: 'post',
    data: ids
  })
}
