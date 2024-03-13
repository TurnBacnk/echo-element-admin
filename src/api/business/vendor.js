import request from '@/utils/request'

export function getVendorById(id) {
  return request({
    url: '/api/vendor/get-vendor-by-id/'+ id,
    method: 'get'
  })
}

export function delVendorByIds(ids) {
  return request({
    url: '/api/vendor/del-vendor-by-ids',
    method: 'post',
    data: ids
  })
}
