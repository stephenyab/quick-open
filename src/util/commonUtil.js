export function isEmpty(value) {
    return (value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0) || (value instanceof Array && value.length === 0))
}

export function isNotEmpty(value) {
    return !isEmpty(value)
}
