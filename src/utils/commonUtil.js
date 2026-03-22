/**
 * 通用工具函数模块
 */

/**
 * 检查值是否非空
 * 支持多种类型的判断：字符串、数组、对象等
 * @param {*} value - 要检查的值
 * @returns {boolean} 如果值非空则返回 true
 */
export const isNotEmpty = (value) => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return true
}
