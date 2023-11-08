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
