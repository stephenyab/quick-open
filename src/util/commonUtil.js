import {WEB_DAV_FIELD_CONFIG, WEB_DAV_FIELD_PREFIX} from '@/config/webDavConfig'
import {LOCAL_FIELD_CONFIG, LOCAL_FIELD_PREFIX} from '@/config/localConfig'
import {getAllData, saveData, deleteData, deleteFeature, setFeature, getData} from '@/util/utoolsUtil'

export const addFormTypeDict = [
    {code: '1', message: '文件/文件夹'},
    {code: '2', message: 'Shell 脚本'}
]

export function isEmpty(value) {
    return (value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0) || (value instanceof Array && value.length === 0))
}

export function isNotEmpty(value) {
    return !isEmpty(value)
}

export function getAllListData() {
    const webDavKeys = WEB_DAV_FIELD_CONFIG.map(item => WEB_DAV_FIELD_PREFIX + item.key)
    const localKeys = LOCAL_FIELD_CONFIG.map(item => LOCAL_FIELD_PREFIX + item.key)
    const configKeys = [...webDavKeys, ...localKeys]
    return getAllData().filter(item => {
        return configKeys.indexOf(item._id) === -1
    })
}

export function commonSaveData(webForm, type) {
    const tmpData = {
        _id: webForm.code,
        _rev: '',
        data: {
            code: webForm.code,
            message: typeof webForm.message === 'string' ? webForm.message.split('\n') : webForm.message,
            type: webForm.type
        }
    }
    if (type === '2') {
        deleteFeature(webForm.code)
        if (webForm.code === webForm.oriCode) {
            tmpData._rev = webForm.rev
        } else {
            deleteData(webForm.oriCode)
            deleteFeature(webForm.oriCode)
        }
    }
    if (isEmpty(tmpData._rev)) {
        delete tmpData._rev
    }
    saveData(tmpData)

    const operateType = webForm.type === '1' ? '打开' : '执行'
    const operateMessage = addFormTypeDict.find(item => item.code === webForm.type).message
    const explain = `${operateType} ${webForm.code} [${operateMessage}]`
    const cmdData = [webForm.code]
    setFeature(webForm.code, explain, cmdData)
}
