import request from '@/utils/request'

export function getOtherPaymentById(id) {
  return request({
    url: '/api/financial-other-payment/get-by-id/' + id,
    method: 'get'
  })
}

export function getOtherPaymentByCode(code) {
  return request({
    url: '/api/financial-other-payment/get-by-code/' + code,
    method: 'get'
  })
}

export function submitOtherPaymentById(id) {
  return request({
    url: '/api/financial-other-payment/submit-by-id/' + id,
    method: 'get'
  })
}

export function submitOtherPaymentByIds(ids) {
  return request({
    url: '/api/financial-other-payment/submit-by-ids',
    method: 'post',
    data: ids
  })
}

export function deleteOtherPaymentById(id) {
  return request({
    url: '/api/financial-other-payment/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteOtherPaymentByIds(ids) {
  return request({
    url: '/api/financial-other-payment/delete-by-ids',
    method: 'post',
    data: ids
  })
}
