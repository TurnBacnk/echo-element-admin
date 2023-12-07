import request from '@/utils/request'
import * as url from 'url'

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
