import request from '@/utils/request'

export function delClient(ids) {
  return request({
    url: '/api/client/del',
    method: 'post',
    data: ids
  })
}

export function getClientById(id) {
  return request({
    url: '/api/client/get-client-by-id/' + id,
    method: 'get'
  })
}
