import request from "@/utils/request";
import {id} from "html-webpack-plugin/lib/chunksorter";

export function getMaterialsById(id) {
  return request({
    url: '/api/repo-materials/get-by-id/' + id,
    method: 'get'
  })
}

export function deleteMaterialsById(id) {
  return request({
    url: '/api/repo-materials/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteMaterialsByIds(ids) {
  return request({
    url: '/api/repo-materials/delete-by-ids',
    method: 'post',
    data: ids
  })
}
