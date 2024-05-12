import request from '@/utils/request'
import { re } from 'mathjs'

export function getSaleOutboundInfoById(id) {
  return request({
    url: '/api/sale-outbound/get-sale-outbound-by-id/' + id,
    method: 'get'
  })
}

export function delSaleOutboundById(id) {
  return request({
    url: '/api/sale-outbound/del-sale-outbound-by-id/' + id,
    method: 'get'
  })
}

export function delSaleOutboundByIds(ids) {
  return request({
    url: '/api/sale-outbound/del-sale-outbound-by-ids/',
    method: 'post',
    data: ids
  })
}

export function changeSaleOutboundStatusById(id, status) {
  return request({
    url: '/api/sale-outbound/change-sale-outbound-status/' + id + '/' + status,
    method: 'get',
    data: id
  })
}

export function getSaleOutboundInfoByCode(code) {
  return request({
    url: '/api/sale-outbound/get-sale-outbound-info-by-code/' + code,
    method: 'get'
  })
}

export function getSaleOutboundList() {
  return request({
    url: '/api/sale-outbound/get-sale-outbound-list',
    method: 'get'
  })
}

export function submitSaleOutboundOrderByIds(ids) {
  return request({
    url: '/api/sale-outbound/submit-sale-outbound-order',
    method: 'post',
    data: ids
  })
}

export function submitSaleOutboundOrderById(id) {
  return request({
    url: '/api/sale-outbound/submit-sale-outbound-order-by-id/' + id,
    method: 'get',
  })
}

export function getSaleOutboundListByClientId(clientId) {
  return request({
    url: '/api/sale-outbound/get-sale-outbound-list-by-client-id/' + clientId,
    method: 'get'
  })
}

export function getSaleOutboundInfoWithReceive(id) {
  return request({
    url: '/api/sale-outbound/get-sale-outbound-info-with-receive-by-id/' + id,
    method: 'get'
  })
}
