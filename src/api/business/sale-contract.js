import request from '@/utils/request'

export function removeSaleContract(ids) {
  return request({
    url: '/api/sale-contract/delete',
    method: 'post',
    data: ids
  })
}
