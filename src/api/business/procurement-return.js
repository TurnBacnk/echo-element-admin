import request from '@/utils/request'
import { id } from 'html-webpack-plugin/lib/chunksorter'

export function getProcurementReturnOrderById(id) {
  return request({
    url: '/api/procurement/return/get-by-id/' + id,
    method: 'get'
  })
}

export function getProcurementReturnOrderByCode(code) {
  return request({
    url: '/api/procurement/return/get-by-code' + code,
    method: 'get'
  })
}

export function deleteProcurementReturnOrderById(id) {
  return request({
    url: '/api/procurement/return/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteProcurementReturnOrderByIds(ids) {
  return request({
    url: '/api/procurement/return/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitProcurementReturnOrderById(id) {
  return request({
    url: '/api/procurement/return/submit-single/' + id,
    method: 'get'
  })
}

export function submitProcurementReturnOrderByIds(ids) {
  return request({
    url: '/api/procurement/return/submit-batch',
    method: 'post',
    data: ids
  })
}
