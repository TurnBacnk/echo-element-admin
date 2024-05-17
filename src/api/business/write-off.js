import request from "@/utils/request";

export function getWriteOffById(id) {
  return request({
    url: '/api/financial-write-off/get-by-id/' + id,
    method: 'get'
  })
}

export function getWriteOffByCode() {}
