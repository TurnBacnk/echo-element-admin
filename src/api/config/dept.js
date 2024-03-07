import request from '@/utils/request'

export function getDeptList(data) {
  return request({
    url: '/api/dept/list',
    method: 'post',
    data: data
  })
}

export function getDeptTree(data) {
  return request({
    url: '/api/dept/get-dept-tree',
    method: 'get'
  })
}

export function delDept(id) {
  return request({
    url: '/api/dept/del-dept/' + id,
    method: 'get'
  })
}

export function getDeptById(id) {
  return request({
    url: '/api/dept/get-by-id/' + id,
    method: 'get'
  })
}
