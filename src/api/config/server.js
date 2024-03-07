import request from '@/utils/request'

export function getServerInfo() {
  return request({
    url: '/api/server/info',
    method: 'get'
  })
}
