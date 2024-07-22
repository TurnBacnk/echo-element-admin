import request from '@/utils/request'
import { id } from 'html-webpack-plugin/lib/chunksorter'

export function deleteProcurementOrderById(id) {
  return request({
    url: '/api/procurement/order/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteProcurementOrderByIds(ids) {
  return request({
    url: '/api/procurement/order/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function getProcurementOrderById(id) {
  return request({
    url: '/api/procurement/order/get-by-id/' + id,
    method: 'get'
  })
}

export function procurementIn(ids) {
  return request({
    url: '/api/procurement/order/in-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitProcurementOrderById(id) {
  return request({
    url: '/api/procurement/order/submit-by-id/' + id,
    method: 'get'
  })
}

export function submitProcurementOrderByIds(ids) {
  return request({
    url: '/api/procurement/order/submit-batch',
    method: 'post',
    data: ids
  })
}

export function getProcurementOrderByCode(code) {
  return request({
    url: '/api/procurement/order/get-by-code/' + code,
    method: 'get',
  })
}
