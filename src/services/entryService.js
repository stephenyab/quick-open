/**
 * 条目服务模块
 * 提供条目的数据管理和持久化功能
 */
import {WEB_DAV_FIELD_CONFIG, WEB_DAV_FIELD_PREFIX} from '@/config/webDavConfig'
import {LOCAL_FIELD_CONFIG, LOCAL_FIELD_PREFIX} from '@/config/localConfig'
import {getAllData, saveData, deleteData, deleteFeature, setFeature, getData} from '@/utils/utoolsUtil'
import {getEntryTypeLabel, getOperateVerb, OPERATE_TYPE_UPDATE, ENTRY_TYPE_ARGS} from '@/constants/entryTypes'
import {normalizeMessageToArray} from '@/utils/messageCodec'

/**
 * 获取所有条目列表数据
 * 排除配置相关的数据项，只返回用户创建的条目
 * @returns {Array} 条目列表数组
 */
export function getAllListData() {
    const webDavKeys = WEB_DAV_FIELD_CONFIG.map(item => WEB_DAV_FIELD_PREFIX + item.key)
    const localKeys = LOCAL_FIELD_CONFIG.map(item => LOCAL_FIELD_PREFIX + item.key)
    const configKeys = [...webDavKeys, ...localKeys]
    return getAllData().filter(item => {
        return configKeys.indexOf(item._id) === -1
    })
}

/**
 * 保存条目到数据库
 * 支持新建和更新两种操作模式
 * @param {Object} webForm - 表单数据对象
 * @param {string} webForm.code - 条目关键字（唯一标识）
 * @param {string|Array} webForm.message - 条目内容（文件路径或脚本）
 * @param {string} webForm.type - 条目类型
 * @param {string} webForm.oriCode - 原始关键字（更新时使用）
 * @param {string} webForm.rev - 数据版本号（更新时使用）
 * @param {string} type - 操作类型：OPERATE_TYPE_CREATE 或 OPERATE_TYPE_UPDATE
 */
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
    let cmdData = [webForm.code]
    if (webForm.type === ENTRY_TYPE_ARGS) {
        cmdData = [{type: 'over', label: webForm.code}]
    }
    setFeature(webForm.code, explain, cmdData)
}
