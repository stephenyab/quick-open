import {WEB_DAV_FIELD_CONFIG, WEB_DAV_FIELD_PREFIX} from '@/config/webDavConfig'
import {LOCAL_FIELD_CONFIG, LOCAL_FIELD_PREFIX} from '@/config/localConfig'
import {getAllData, saveData, deleteData, deleteFeature, setFeature, getData} from '@/utils/utoolsUtil'
import {getEntryTypeLabel, getOperateVerb, OPERATE_TYPE_UPDATE} from '@/constants/entryTypes'
import {normalizeMessageToArray} from '@/utils/messageCodec'

export function getAllListData() {
    const webDavKeys = WEB_DAV_FIELD_CONFIG.map(item => WEB_DAV_FIELD_PREFIX + item.key)
    const localKeys = LOCAL_FIELD_CONFIG.map(item => LOCAL_FIELD_PREFIX + item.key)
    const configKeys = [...webDavKeys, ...localKeys]
    return getAllData().filter(item => {
        return configKeys.indexOf(item._id) === -1
    })
}

export function saveEntry(webForm, type) {
    const tmpData = {
        _id: webForm.code,
        _rev: '',
        data: {
            code: webForm.code,
            message: normalizeMessageToArray(webForm.message),
            type: webForm.type
        }
    }
    if (type === OPERATE_TYPE_UPDATE) {
        deleteFeature(webForm.code)
        if (webForm.code === webForm.oriCode) {
            tmpData._rev = webForm.rev
        } else {
            deleteData(webForm.oriCode)
            deleteFeature(webForm.oriCode)
        }
    }
    if (!tmpData._rev) {
        delete tmpData._rev
    }
    saveData(tmpData)

    const operateType = getOperateVerb(webForm.type)
    const operateMessage = getEntryTypeLabel(webForm.type)
    const explain = `${operateType} ${webForm.code} [${operateMessage}]`
    const cmdData = [webForm.code]
    setFeature(webForm.code, explain, cmdData)
}
