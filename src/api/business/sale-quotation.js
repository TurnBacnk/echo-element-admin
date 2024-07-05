import request from '@/utils/request'

export function getQuotationById(id) {
  return request({
    url: '/api/sale/quotation/get-quotation-by-id/' + id,
    method: 'get'
  })
}

export function deleteQuotationById(id) {
  return request({
    url: '/api/sale/quotation/del-by-id/' + id,
    method: 'get'
  })
}

export function deleteQuotationByIds(ids) {
  return request({
    url: '/api/sale/quotation/delete-quotation-by-ids',
    method: 'post',
    data: ids
  })
}

export function effectQuotation(ids) {
  return request({
    url: '/api/sale/quotation/effect',
    method: 'post',
    data: ids
  })
}
