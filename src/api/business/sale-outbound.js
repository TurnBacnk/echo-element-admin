import request from '@/utils/request'

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