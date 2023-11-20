import request from '@/utils/request'

/**
 * 获取字典
 * @param params 配置
 * @returns {*} 字典
 */
export function getDictionary(params) {
  return request({
    url: '/api/dict/dictionary',
    method: 'post',
    data: params
  })
}

/**
 * 获取常量
 * @param params 配置
 * @returns {*} 常量
 */
export function getConstant(params) {
  return request({
    url: '/api/dict/constant',
    method: 'post',
    data: params
  })
}

/**
 * 获取java代码
 * @param params 配置
 * @returns {*} java代码
 */
export function getJavaCode(params) {
  return request({
    url: '/api/dict/java-code',
    method: 'post',
    data: params
  })
}
