import request from '@/utils/request'

export function getMessage(username) {
  return request({
    url: '/api/message/get-message/' + username,
    method: 'get'
  })
}

export function getMessageCount(id) {
  return request({
    url: '/api/message/get-message-count/' + id,
    method: 'get'
  })
}
