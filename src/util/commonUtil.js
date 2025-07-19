import {WEB_DAV_FIELD_CONFIG, WEB_DAV_FIELD_PREFIX} from '@/config/webDavConfig'
import {getAllData} from '@/util/utoolsUtil'

export function isEmpty(value) {
    return (value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0) || (value instanceof Array && value.length === 0))
}

export function isNotEmpty(value) {
    return !isEmpty(value)
}

export function getAllListData() {
    const keys = WEB_DAV_FIELD_CONFIG.map(item => WEB_DAV_FIELD_PREFIX + item.key)
    return getAllData().filter(item => {
        return keys.indexOf(item._id) === -1
    })
}
