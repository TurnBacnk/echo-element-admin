import request from '@/utils/request'

export function getNextOrderNO(parentId) {
  return request({
    url: '/api/category/get-next-order-no/' + parentId,
    method: 'get'
  })
}
