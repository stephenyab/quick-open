export const typeRequiredRule = [
  value => {
    if (value) {
      return true
    }
    return '类型必填'
  }
]

export const messageRequiredRule = [
  value => {
    if (value) {
      return true
    }
    return '文件资源必填'
  }
]

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
