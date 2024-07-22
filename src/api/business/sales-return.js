import request from '@/utils/request'
import { id } from 'html-webpack-plugin/lib/chunksorter'

export function getReturnById(id) {
  return request({
    url: '/api/sales/return/get-by-id/' + id,
    method: 'get'
  })
}

export function getReturnByCode(code) {
  return request({
    url: '/api/sales/return/get-by-code/' + code,
    method: 'get'
  })
}

export function submitReturnById(id) {
  return request({
    url: '/api/sales/return/submit-single/' + id,
    method: 'get'
  })
}

export function submitReturnByIds(ids) {
  return request({
    url: '/api/sales/return/submit-batch',
    method: 'post',
    data: ids
  })
}

export function deleteReturnById(id) {
  return request({
    url: '/api/sales/return/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteReturnByIds(ids) {
  return request({
    url: '/api/sales/return/delete-by-ids',
    method: 'post',
    data: ids
  })
}
