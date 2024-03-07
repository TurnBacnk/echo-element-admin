import request from '@/utils/request'

export function insertJob(data) {
  return request({
    url: '/api/task/insert',
    method: 'post',
    data: data
  })
}

export function updateJob(data) {
  return request({
    url: '/api/task/update-by-id',
    method: 'post',
    data: data
  })
}

export function queryTaskById(id) {
  return request({
    url: '/api/task/query-by-id/' + id,
    method: 'get'
  })
}

export function enableJob(id, status) {
  return request({
    url: '/api/task/update-job-status/' + id + '/' + status,
    method: 'get'
  })
}

export function disableJob(id, status) {
  return request({
    url: '/api/task/update-job-status/' + id + '/' + status,
    method: 'get',
  })
}

export function startOrPauseJob(id, status, jobGroup) {
  return request({
    url: '/api/task/change-status/' + jobGroup + '/' + id + '/' + status,
    method: 'get',
  })
}

export function execute(id, jobGroup) {
  return request({
    url: '/api/task/execute-job/' + id + '/' + jobGroup,
    method: 'get'
  })
}
