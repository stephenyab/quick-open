export const ENTRY_TYPE_FILE = '1'
export const ENTRY_TYPE_SHELL = '2'

export const OPERATE_TYPE_CREATE = '1'
export const OPERATE_TYPE_UPDATE = '2'

export const ENTRY_TYPES = [
    {code: ENTRY_TYPE_FILE, message: '文件/文件夹'},
    {code: ENTRY_TYPE_SHELL, message: 'Shell 脚本'},
]

export function getEntryTypeLabel(typeCode) {
    const code = String(typeCode)
    return ENTRY_TYPES.find(item => item.code === code)?.message ?? code
}

export function getOperateVerb(typeCode) {
    const code = String(typeCode)
    return code === ENTRY_TYPE_FILE ? '打开' : '执行'
}

