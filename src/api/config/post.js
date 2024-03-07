import request from '@/utils/request'

export function delPost(data) {
  return request({
    url: '/api/post/del',
    method: 'post',
    data
  })
}

export function getPostById(id) {
  return request({
    url: '/api/post/get-by-id/' + id,
    method: 'get'
  })
}

export function enablePost(id, status) {
  return request({
    url: '/api/post/change-status/' + id + '/' + status,
    method: 'get'
  })
}
