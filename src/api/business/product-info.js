import request from '@/utils/request'

export function batchDeleteProductInfo(ids) {
  return request({
    url: '/api/product-info/batch-delete',
    method: 'post',
    data: ids
  })
}

export function getProductInfoById(id) {
  return request({
    url: '/api/product-info/get-by-id/' + id,
    method: 'get'
  })
}
