import request from '@/utils/request'
import { id } from 'html-webpack-plugin/lib/chunksorter'

export function submitSingle(id) {
  return request({
    url: '/api/procurement/in/submit-single/' + id,
    method: 'get',
  })
}

export function submitBatch(ids) {
  return request({
    url: '/api/procurement/in/submit-batch',
    method: 'post',
    data: ids
  })
}

export function getInOrderById(id) {
  return request({
    url: '/api/procurement/in/get-by-id/' + id,
    method: 'get'
  })
}

export function getInOrderByCode(code) {
  return request({
    url: '/api/procurement/in/get-by-code/' + code,
    method: 'get'
  })
}

export function deleteOrderById(id) {
  return request({
    url: '/api/procurement/in/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteOrderByIds(ids) {
  return request({
    url: '/api/procurement/in/delete-batch',
    method: 'post',
    data: ids
  })
}

export function returnOrder(ids) {
  return request({
    url: '/api/procurement/in/return-by-ids',
    method: 'post',
    data: ids
  })
}
