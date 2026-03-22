/**
 * 备份服务模块
 * 提供 WebDAV 远程备份和本地备份功能
 */
import {getAllListData, saveEntry} from '@/services/entryService'
import {getDirectoryContents, getFileContents, initWebDavClient, putFileContents} from '@/utils/webDavUtil'
import {OPERATE_TYPE_CREATE} from '@/constants/entryTypes'

/**
 * 生成备份文件名
 * 格式：backup-YYYY-MM-DD-随机字符串.json
 * @param {Date} date - 日期对象，默认为当前时间
 * @returns {string} 备份文件名
 */
function buildBackupFileName(date = new Date()) {
    const yyyy = date.getFullYear()
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hash = Math.random().toString(36).substring(2, 10)
    return `backup-${yyyy}-${MM}-${dd}-${hash}.json`
}

/**
 * 创建"无数据可备份"错误对象
 * @returns {Error} 带有 NO_DATA 错误码的 Error 对象
 */
function createNoDataError() {
    const err = new Error('无数据可备份')
    err.code = 'NO_DATA'
    return err
}

/**
 * 从备份数据恢复条目
 * 遍历备份数据，逐条创建条目
 * @param {Array} backupData - 备份数据数组
 */
function restoreFromBackupData(backupData) {
    for (const dataItem of backupData) {
        const webForm = {
            code: dataItem.data.code,
            message: dataItem.data.message,
            type: dataItem.data.type,
            rev: dataItem._rev
        }
        saveEntry(webForm, OPERATE_TYPE_CREATE)
    }
}

/**
 * 备份数据到 WebDAV 服务器
 * @param {Object} options - 备份配置选项
 * @param {string} options.webDavUrl - WebDAV 服务器地址
 * @param {string} options.webDavAccount - WebDAV 账号
 * @param {string} options.webDavPassword - WebDAV 密码
 * @param {string} options.webDavSubFolder - 子文件夹路径
 * @returns {Promise<{fileName: string}>} 返回备份文件名
 * @throws {Error} 无数据时抛出 NO_DATA 错误
 */
export async function backupToWebDav({webDavUrl, webDavAccount, webDavPassword, webDavSubFolder}) {
    const listData = getAllListData()
    if (!listData || listData.length === 0) {
        throw createNoDataError()
    }

    const fileName = buildBackupFileName()
    const fileContent = JSON.stringify(listData, null, 2)

    const webDavClient = initWebDavClient(webDavUrl, webDavAccount, webDavPassword)
    await putFileContents(webDavClient, fileName, fileContent, webDavSubFolder, true)
    return {fileName}
}

/**
 * 获取 WebDAV 服务器上的备份文件列表
 * @param {Object} options - 配置选项
 * @param {string} options.webDavUrl - WebDAV 服务器地址
 * @param {string} options.webDavAccount - WebDAV 账号
 * @param {string} options.webDavPassword - WebDAV 密码
 * @param {string} options.webDavSubFolder - 子文件夹路径
 * @returns {Promise<Array>} 备份文件列表，按修改时间倒序排列
 */
export async function listWebDavBackupFiles({webDavUrl, webDavAccount, webDavPassword, webDavSubFolder}) {
    const webDavClient = initWebDavClient(webDavUrl, webDavAccount, webDavPassword)
    const result = await getDirectoryContents(webDavClient, webDavSubFolder)
    const tmpList = result instanceof Array ? result : [result]
    return tmpList.filter(item => item.type === 'file')
}

/**
 * 从 WebDAV 服务器恢复备份数据
 * @param {Object} options - 恢复配置选项
 * @param {string} options.webDavUrl - WebDAV 服务器地址
 * @param {string} options.webDavAccount - WebDAV 账号
 * @param {string} options.webDavPassword - WebDAV 密码
 * @param {string} options.webDavSubFolder - 子文件夹路径
 * @param {Object} options.fileItem - 要恢复的文件对象
 */
export async function restoreWebDavBackupFile({webDavUrl, webDavAccount, webDavPassword, webDavSubFolder, fileItem}) {
    const webDavClient = initWebDavClient(webDavUrl, webDavAccount, webDavPassword)
    const result = await getFileContents(webDavClient, fileItem.filename)
    const backupData = JSON.parse(result)
    restoreFromBackupData(backupData)
}

/**
 * 备份数据到本地目录
 * @param {Object} options - 备份配置选项
 * @param {string} options.backupPath - 本地备份目录路径
 * @returns {{fileName: string}} 返回备份文件名
 * @throws {Error} 无数据时抛出 NO_DATA 错误
 */
export function backupToLocal({backupPath}) {
    const listData = getAllListData()
    if (!listData || listData.length === 0) {
        throw createNoDataError()
    }

    const fileName = buildBackupFileName()
    const fileContent = JSON.stringify(listData, null, 2)
    window.services.writeBackupFile(backupPath, fileName, fileContent)
    return {fileName}
}

/**
 * 获取本地备份文件列表
 * @param {Object} options - 配置选项
 * @param {string} options.backupPath - 本地备份目录路径
 * @returns {Array} 备份文件列表，按修改时间倒序排列
 */
export function listLocalBackupFiles({backupPath}) {
    return window.services.readBackupFileList(backupPath)
}

/**
 * 从本地备份文件恢复数据
 * @param {Object} options - 恢复配置选项
 * @param {Object} options.fileItem - 要恢复的文件对象
 */
export function restoreLocalBackupFile({fileItem}) {
    const result = window.services.readBackupFile(fileItem.filename)
    const backupData = JSON.parse(result)
    restoreFromBackupData(backupData)
}
