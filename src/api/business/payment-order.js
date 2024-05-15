import request from '@/utils/request'

export function submitPaymentOrderById(id) {
  return request({
    url: '/api/financial-payment-order/submit-by-id/' + id,
    method: 'get'
  })
}

export function submitPaymentOrderByIds(ids) {
  return request({
    url: '/api/financial-payment-order/submit-by-ids',
    method: 'post',
    data: ids
  })
}

export function deletePaymentOrderById(id) {
  return request({
    url: '/api/financial-payment-order/delete-by-id/' + id,
    method: 'get'
  })
}

export function deletePaymentOrderByIds(ids) {
  return request({
    url: '/api/financial-payment-order/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function getPaymentOrderById(id, paymentType) {
  return request({
    url: '/api/financial-payment-order/get-by-id/' + id + '/' + paymentType,
    method: 'get'
  })
}

export function getPaymentOrderByIds(ids) {
  return request({
    url: '/api/financial-payment-order/get-by-ids',
    method: 'post',
    data: ids
  })
}

export function getPrePaymentOrderById(id) {
  return request({
    url: '/api/financial-payment-order/get-pre-payment-by-id/' + id,
    method: 'get'
  })
}

export function getPaymentOrderByCode(code) {
  return request({
    url: '/api/financial-payment-order/get-by-code/' + code,
    method: 'get'
  })
}
