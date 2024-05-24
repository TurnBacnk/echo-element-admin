import request from '@/utils/request'

export function submitFundTransferById(id) {
  return request({
    url: '/api/financial-fund-transfer/submit-by-id/' + id,
    method: 'get'
  })
}

export function submitFundTransferByIds(ids) {
  return request({
    url: '/api/financial-fund-transfer/submit-batch-by-ids',
    method: 'post',
    data: ids
  })
}

export function deleteFundTransferById(id) {
  return request({
    url: '/api/financial-fund-transfer/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteFundTransferByIds(ids) {
  return request({
    url: '/api/financial-fund-transfer/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function getFundTransferById(id) {
  return request({
      url: '/api/financial-fund-transfer/get-by-id/' + id,
    method: 'get'
  })
}

export function getFundTransferByCode(code) {
  return request({
    url: '/api/financial-fund-transfer/get-by-code/' + code,
    method: 'get'
  })
}
