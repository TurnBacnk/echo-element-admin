import request from '@/utils/request'

export function getOne(id) {
  return request({
    url: '/api/generate-code/get-one/' + id,
    method: 'get'
  })
}

export  function enableOrDisableGenerateCodeRule(id, status) {
  return request({
    url: '/api/generate-code/enable-or-disable/' + id + '/' + status,
    method: 'get'
  })
}

export function generateCode(businessKey) {
  return request({
    url: '/api/generate-code/generate-single-code/' + businessKey,
    method: 'get'
  })
}
