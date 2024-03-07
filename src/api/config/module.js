import request from '@/utils/request'

export function delModule(ids) {
  return request({
    url: '/api/module/del',
    method: 'post',
    data: ids
  })
}
