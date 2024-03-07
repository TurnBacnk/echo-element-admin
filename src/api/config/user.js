import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login/form-login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/login/info/' + token,
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/api/login/logout/' + token,
    method: 'get'
  })
}

export function getCode() {
  return request({
    url: '/api/login/captcha',
    method: 'get'
  })
}

export function enableOrDisableUser(data) {
  return request({
    url: '/api/user/enable-or-disable',
    method: 'post',
    data: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data: data
  })
}

export function modifyUser(data) {
  return request({
    url: '/api/user/edit',
    method: 'post',
    data: data
  })
}

export function queryUserInfoById(id) {
  return request({
    url: '/api/user/get-by-id/' + id,
    method: 'get'
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/user/delete',
    method: 'post',
    data: data
  })
}
