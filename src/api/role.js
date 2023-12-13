import request from '@/utils/request'

export function getRoleById(id) {
  return request({
    url: '/api/role/get-by-id/' + id,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/api/role/insert-role',
    method: 'post',
    data: data
  })
}

export function modifyRole(data) {
  return request({
    url: '/api/role/update-role',
    method: 'post',
    data: data
  })
}

export function deleteRole(data) {
  return request({
    url: '/api/role/delete-role',
    method: 'post',
    data: data
  })
}

export function getMenuTreeByRoleId(id) {
  return request({
    url: '/api/role/get-menu-tree-by-role-id/'+ id,
    method: 'get'
  })
}
