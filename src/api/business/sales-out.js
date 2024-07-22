import request from '@/utils/request'
import { id } from 'html-webpack-plugin/lib/chunksorter'
import {exp} from "mathjs";

export function getOutById(id) {
  return request({
    url: '/api/sales/out/get-by-id/'+ id,
    method: 'get'
  })
}

export function getOutByCode(code) {
  return request({
    url: '/api/sales/out/get-by-code/' + code,
    method: 'get'
  })
}

export function submitOutSingle(id) {
  return request({
    url: '/api/sales/out/submit-single/' + id,
    method: 'get'
  })
}

export function submitOutBatch(ids) {
  return request({
    url: '/api/sales/out/submit-batch' ,
    method: 'post',
    data: ids
  })
}

export function deleteOutById(id) {
  return request({
    url: '/api/sales/out/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteOutByIds(ids) {
  return request({
    url: '/api/sales/out/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function salesReturnByIds(ids) {
  return request({
    url: '/api/sales/out/return-by-ids',
    method: 'post',
    data: ids
  })
}

export function getOutOrderInvoiceInfoWithOrderId(orderId) {
  return request({
    url: '/api/sales/out/order-invoice-info/' + orderId,
    method: 'get'
  })
}
