import request from '@/utils/request'

export function deleteAssemblyById(id) {
  return request({
    url: '/api/repo-assembly/delete-by-id/' + id,
    method: 'get'
  })
}

export function deleteAssemblyByIds(ids) {
  return request({
    url: '/api/repo-assembly/delete-by-ids',
    method: 'post',
    data: ids
  })
}

export function getAssemblyById(id) {
  return request({
    url: '/api/repo-assembly/get-by-id/' + id,
    method: 'get'
  })
}

export function getAssemblyByCode(code) {
  return request({
    url: '/api/repo-assembly/get-by-code/' + code,
    method: 'get'
  })
}

export function submitAssemblyBatchByIds(ids) {
  return request({
    url: '/api/repo-assembly/submit-batch-by-ids',
    method: 'post',
    data: ids
  })
}

export function submitAssemblyById(id) {
  return request({
    url: '/api/repo-assembly/submit-by-id/' + id,
    method: 'get'
  })
}
