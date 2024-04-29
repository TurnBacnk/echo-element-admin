import request from "@/utils/request";

export function deleteOtherOutboundByIds(ids) {
  return request({
    url: '/api/repo-other-outbound/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function deleteOtherOutboundById(id) {
  return request({
    url: '/api/repo-other-outbound/delete-by-id/' + id,
    method: 'get'
  })
}

export function submitOtherOutboundByIds(ids) {
  return request({
    url: '/api/repo-other-outbound/submit-batch-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitOtherOutboundById(id) {
  return request({
    url: '/api/repo-other-outbound/submit-by-id/' + id,
    method: 'get'
  })
}

export function getOtherOutboundById(id) {
  return request({
    url: '/api/repo-other-outbound/get-by-id/' + id,
    method: 'get'
  })
}

export function getOtherOutboundByCode(code) {
  return request({
    url: '/api/repo-other-outbound/get-by-code/' + code,
    method: 'get'
  })
}
