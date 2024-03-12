import request from '@/utils/request'

export function getNextOrderNO(parentId) {
  return request({
    url: '/api/category/get-next-order-no/' + parentId,
    method: 'get'
  })
}

export function getCategoryTree() {
  return request({
    url: '/api/category/get-category-tree',
    method: 'get'
  })
}

export function delCategory(id) {
  return request(({
    url: '/api/category/del/' + id,
    method: 'get'
  }))
}
