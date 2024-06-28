import request from '@/utils/request'

export function delProjectById(id) {
  return request({
    url: '/api/sale/project/del-project-by-id/' + id,
    method: 'get'
  })
}

export function delProjectByIds(ids) {
  return request({
    url: '/api/sale/project/del-project-by-ids',
    method: 'post',
    data: ids
  })
}

export function getProjectById(id) {
  return request({
    url: '/api/sale/project/get-project-by-id/' + id,
    method: 'get'
  })
}

