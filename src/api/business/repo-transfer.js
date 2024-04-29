import request from "@/utils/request";
import {id} from "html-webpack-plugin/lib/chunksorter";

export function submitTransferOrderByIds(ids) {
  return request({
    url: '/api/repo-transfer-order/sumit-batch-by-ids',
    method: 'post'
  })
}

export function submitTransferOrderById(id) {
  return request({
    url: '/api/repo-transfer-order/submit-singel-by-id/' + id,
    method: 'get'
  })
}

export function getTransferOrderById(id) {
  return request({
    url: '/api/repo-transfer-order/get-by-id/' + id,
    method: 'get'
  })
}

export function getTransferOrderByCode(code) {
  return request({
    url: '/api/repo-transfer-order/get-by-code/' + code,
    method: 'get'
  })
}

export function deleteTransferOrderById(id) {
  return request({
    url: '/api/repo-transfer-order/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteTransferOrderByIds(ids) {
  return request({
    url: '/api/repo-transfer-order/delete-by-ids',
    method: 'post',
    data: ids
  })
}
