import request from '@/utils/request'

export function disableOrEnabledWarehouse(id, status) {
  return request({
    url: '/api/warehouse/disable-or-enable-warehouse/' + id + '/' + status,
    method: 'get'
  })
}

export function getWarehouseById(id) {
  return request({
    url: '/api/warehouse/get-warehouse-by-id/'+ id,
    method: 'get'
  })
}
