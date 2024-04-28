import request from "@/utils/request";

export function deleteOtherInboundByIds(ids) {
  return request({
    url: '/api/repo-other-inbound/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function deleteOtherInboundById(id) {
  return request({
    url: '/api/repo-other-inbound/delete-by-id/' + id,
    method: 'get'
  })
}

export function submitOtherInboundByIds(ids) {
  return request({
    url: '/api/repo-other-inbound/submit-batch-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitOtherInboundById(id) {
  return request({
    url: '/api/repo-other-inbound/submit-single-by-id/' + id,
    method: 'get'
  })
}

export function getOtherInboundById(id) {
  return request({
    url: '/api/repo-other-inbound/get-by-id/' + id,
    method: 'get'
  })
}

export function getOtherInboundByCode(code) {
  return request({
    url: '/api/repo-other-inbound/get-by-code/' + code,
    method: 'get'
  })
}
