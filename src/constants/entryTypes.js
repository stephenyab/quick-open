/**
 * 条目类型常量模块
 * 定义条目类型、操作类型及相关工具函数
 */

/** 条目类型：文件/文件夹 */
export const ENTRY_TYPE_FILE = '1'
/** 条目类型：Shell 脚本 */
export const ENTRY_TYPE_SHELL = '2'
/** 条目类型：传入参数 */
export const ENTRY_TYPE_ARGS = '3'

/** 操作类型：创建 */
export const OPERATE_TYPE_CREATE = '1'
/** 操作类型：更新 */
export const OPERATE_TYPE_UPDATE = '2'

/** 条目类型选项列表 */
export const ENTRY_TYPES = [
    {code: ENTRY_TYPE_FILE, message: '文件/文件夹'},
    {code: ENTRY_TYPE_SHELL, message: 'Shell 脚本'},
    {code: ENTRY_TYPE_ARGS, message: '传入参数'},
]

/**
 * 根据类型代码获取类型标签
 * @param {string} typeCode - 类型代码
 * @returns {string} 类型标签文本
 */
export function getEntryTypeLabel(typeCode) {
    const code = String(typeCode)
    return ENTRY_TYPES.find(item => item.code === code)?.message ?? code
}

/**
 * 根据类型代码获取操作动词
 * @param {string} typeCode - 类型代码
 * @returns {string} 操作动词（"打开"或"执行"）
 */
export function getOperateVerb(typeCode) {
    const code = String(typeCode)
    return code === ENTRY_TYPE_FILE ? '打开' : '执行'
}
