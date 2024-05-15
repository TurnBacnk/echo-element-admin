import request from '@/utils/request'

export function delInboundOrderByIds(ids) {
  return request({
    url: '/api/inbound-order/del-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitInboundOrderByIds(ids) {
  return request({
    url: '/api/inbound-order/submit-inbound-order-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitInboundOrderById(id) {
  return request({
    url: '/api/inbound-order/submit-single-by-id/' + id,
    method: 'post',
    data: id
  })
}

export function delInboundOrderById(id) {
  return request({
    url: '/api/inbound-order/del-by-id/' + id,
    method: 'get'
  })
}

export function getInboundOrderById(id) {
  return request({
    url: '/api/inbound-order/get-inbound-order-by-id/' + id,
    method: 'get'
  })
}

export function getInboundOrderByCode(code) {
  return request({
    url: '/api/inbound-order/get-inbound-order-by-code/' + code,
    method: 'get'
  })
}

export function getInboundOrderByIdForPayment(id) {
  return request({
    url: '/api/inbound-order/get-inbound-order-by-id-for-payment/' + id,
    post: 'get'
  })
}
