import request from "@/utils/request";

export function getTicketOrderById(id) {
  return request({
    url: "/api/financial-ticket-order/get-by-id/" + id,
    method: 'get'
  })
}

export function getTicketOrderByCode(code) {
  return request({
    url: "/api/financial-ticket-order/get-by-code/" + code,
    method: 'get'
  })
}

export function deleteTicketOrderById(id) {
  return request({
    url: "/api/financial-ticket-order/delete-by-id/" + id,
    method: 'get'
  })
}

export function deleteTicketOrderByIds(ids) {
  return request({
    url: '/api/financial-ticket-order/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitTicketOrderByIds(ids) {
  return request({
    url: '/api/financial-ticket-order/submit-batch-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitTicketOrderById(id) {
  return request({
    url: '/api/financial-ticket-order/submit-by-id/' + id,
    method: 'get'
  })
}
