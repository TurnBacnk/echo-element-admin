import request from "@/utils/request";

export function deleteInvoiceOrderById(id) {
  return request({
    url: '/api/financial-invoice-order/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteInvoiceOrderByIds(ids) {
  return request({
    url: '/api/financial-invoice-order/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitInvoiceOrderById(id) {
  return request({
    url: '/api/financial-invoice-order/submit-single-by-id/' + id,
    method: 'get'
  })
}

export function submitInvoiceOrderByIds(ids) {
  return request({
    url: '/api/financial-invoice-order/submit-batch-by-ids',
    method: 'post',
    data: ids
  })
}

export function getInvoiceOrderById(id) {
  return request({
    url: '/api/financial-invoice-order/get-by-id/' + id,
    method: 'get'
  })
}

export function getInvoiceOrderByCode(code) {
  return request({
    url: '/api/financial-invoice-order/get-by-code/' + code,
    method: 'get'
  })
}
