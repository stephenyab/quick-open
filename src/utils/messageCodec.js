export function normalizeMessageToArray(message) {
    if (message === null || message === undefined) return []
    if (Array.isArray(message)) return message
    if (typeof message === 'string') return message.split('\n')
    return []
}

export function normalizeMessageToString(message) {
    if (Array.isArray(message)) return message.join('\n')
    if (typeof message === 'string') return message
    return ''
}
