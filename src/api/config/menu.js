import request from '@/utils/request'

export function insertMenu(data) {
  return request({
    url: '/api/menu/insert-menu',
    method: 'post',
    data: data
  })
}

export function modifyMenu(data) {
  return request({
    url: '/api/menu/update-menu',
    method: 'post',
    data: data
  })
}

export function deleteMenu(id) {
  return request({
    url: '/api/menu/delete-menu/' + id,
    method: 'post'
  })
}

export function getMenuTree() {
  return request({
    url: '/api/menu/get-menu-tree',
    method: 'get'
  })
}

export function getMenuById(id) {
  return request({
    url: '/api/menu/get-menu-by-id/' + id,
    method: 'get'
  })
}

export function getRouters() {
  return request({
    url: '/api/menu/get-router',
    method: 'get'
  })
}
