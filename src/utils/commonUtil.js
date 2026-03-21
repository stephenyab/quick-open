export const isNull = (val) => val === null

export const isUndefined = (val) => val === undefined

export const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val)

export const isEmptyObject = (val) => isObject(val) && Object.keys(val).length === 0

export const isEmptyArray = (val) => Array.isArray(val) && val.length === 0

export const isEmptyString = (val) => typeof val === 'string' && val.trim().length === 0

export function isEmpty(value) {
    return isNull(value) || 
           isUndefined(value) || 
           isEmptyObject(value) || 
           isEmptyArray(value) || 
           isEmptyString(value)
}

export function isNotEmpty(value) {
    return !isEmpty(value)
}
