import request from "@/utils/request";
import {id} from "html-webpack-plugin/lib/chunksorter";

export function submitSaleReturnOrderById(id) {
  return request({
    url: '/api/sale-return/submit-single-by-id/' + id,
    method: 'get'
  })
}

export function submitSaleReturnOrderByIds(ids) {
  return request({
    url: '/api/sale-return/submit-batch-by-ids',
    method: 'post',
    data: ids
  })
}

export function delSaleReturnOrderById(id) {
  return request({
    url: '/api/sale-return/del-return-order-by-id/' + id,
    method: 'get'
  })
}

export function getSaleReturnOrderById(id) {
  return request({
    url: '/api/sale-return/get-return-order-by-id/' + id,
    method: 'get'
  })
}

export function delSaleReturnOrderByIds(ids) {
  return request({
    url: '/api/sale-return/del-sale-return-order-by-ids',
    method: 'get'
  })
}

export function getSaleReturnOrderByCode(code) {
  return request({
    url: '/api/sale-return/get-return-order-by-code/' + code,
    method: 'get'
  })
}
