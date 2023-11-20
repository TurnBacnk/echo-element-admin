import request from '@/utils/request'

/**
 * 产品类别列表查询
 * @param params 列表查询参数,包括业务参数与分页参数
 * @returns {*} 列表数据 携带分页结果
 */
export function listProductCategoryByPage(params) {
  return request({
    url: '/api/product/category/list',
    method: 'post',
    data: params
  })
}
