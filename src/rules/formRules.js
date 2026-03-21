import {getData} from '@/util/utoolsUtil'

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

export function createAddCodeRule() {
  return [
    value => {
      if (value) {
        if (getData(value)) {
          return '关键字已存在'
        }
        return true
      }
      return '关键字必填'
    }
  ]
}

export function createEditCodeRule(oriCode) {
  return [
    value => {
      if (value) {
        if (value !== oriCode.value && getData(value)) {
          return '关键字已存在'
        }
        return true
      }
      return '关键字必填'
    }
  ]
}
