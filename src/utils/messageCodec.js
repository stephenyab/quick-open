/**
 * 消息编解码工具模块
 * 处理消息在字符串和数组之间的转换
 */

/**
 * 将消息标准化为数组格式
 * 支持字符串（按换行符分割）和数组输入
 * @param {string|Array|null|undefined} message - 输入消息
 * @returns {Array} 消息数组
 */
export function normalizeMessageToArray(message) {
    if (message === null || message === undefined) return []
    if (Array.isArray(message)) return message
    if (typeof message === 'string') return message.split('\n')
    return []
}

/**
 * 将消息标准化为字符串格式
 * 支持数组（用换行符连接）和字符串输入
 * @param {string|Array} message - 输入消息
 * @returns {string} 消息字符串
 */
export function normalizeMessageToString(message) {
    if (Array.isArray(message)) return message.join('\n')
    if (typeof message === 'string') return message
    return ''
}
