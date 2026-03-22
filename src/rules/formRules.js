/**
 * 表单验证规则模块
 * 提供表单字段的验证规则
 */

/** 类型必填验证规则 */
export const typeRequiredRule = [
  value => {
    if (value) {
      return true
    }
    return '类型必填'
  }
]

/** 文件资源必填验证规则 */
export const messageRequiredRule = [
  value => {
    if (value) {
      return true
    }
    return '文件资源必填'
  }
]

/**
 * 创建关键字验证规则
 * @param {Function} checkExists - 检查关键字是否已存在的函数
 * @returns {Array} 验证规则数组
 */
export function createCodeRule(checkExists) {
  return [
    value => {
      if (!value) {
        return '关键字必填'
      }
      if (checkExists(value)) {
        return '关键字已存在'
      }
      return true
    }
  ]
}
