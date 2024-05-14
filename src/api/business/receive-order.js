import request from '@/utils/request'

export function deleteReceiveOrderById(id) {
  return request({
    url: '/api/financial-receive-order/delete-by-id/' + id,
    method: 'get',
  })
}

export function deleteReceiveOrderByIds(ids) {
  return request({
    url: '/api/financial-receive-order/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitReceiveOrderByIds(ids) {
  return request({
    url: '/api/financial-receive-order/submit-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitReceiveOrderById(id) {
  return request({
    url: '/api/financial-receive-order/submit-by-id/' + id,
    method: 'get'
  })
}

export function getReceiveOrderById(id, receiveType) {
  return request({
    url: '/api/financial-receive-order/get-receive-order-by-id/' + id + '/' + receiveType,
    method: 'get'
  })
}

export function getReceiveOrderByCode(code, receiveType) {
  return request({
    url: '/api/financial-receive-order/get-receive-order-by-code/' + code + '/' + receiveType,
    method: 'get'
  })
}

export function getReceiveOrderReceiveTypeByCode(code){
  return request({
    url: '/api/financial-receive-order/get-receive-order-receive-type-by-code/' + code,
    method: 'get'
  })
}


export function getPreReceiveOrderById(id) {
  return request({
    url: '/api/financial-receive-order/get-pre-receive-order-by-id/' + id,
    method: 'get'
  })
}
