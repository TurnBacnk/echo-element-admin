import request from "@/utils/request";

export function getStocktakingInfoById(id) {
  return request({
    url: 'api/repo-stocktaking/get-by-id/' + id,
    method: 'get'
  })
}
