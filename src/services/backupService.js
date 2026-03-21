import {getAllListData, saveEntry} from '@/services/entryService'
import {getDirectoryContents, getFileContents, initWebDavClient, putFileContents} from '@/util/webDavUtil'
import {OPERATE_TYPE_CREATE} from '@/constants/entryTypes'

function buildBackupFileName(date = new Date()) {
    const yyyy = date.getFullYear()
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hash = Math.random().toString(36).substring(2, 10)
    return `backup-${yyyy}-${MM}-${dd}-${hash}.json`
}

function createNoDataError() {
    const err = new Error('无数据可备份')
    err.code = 'NO_DATA'
    return err
}

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

export async function listWebDavBackupFiles({webDavUrl, webDavAccount, webDavPassword, webDavSubFolder}) {
    const webDavClient = initWebDavClient(webDavUrl, webDavAccount, webDavPassword)
    const result = await getDirectoryContents(webDavClient, webDavSubFolder)
    const tmpList = result instanceof Array ? result : [result]
    return tmpList.filter(item => item.type === 'file')
}

export async function restoreWebDavBackupFile({webDavUrl, webDavAccount, webDavPassword, webDavSubFolder, fileItem}) {
    const webDavClient = initWebDavClient(webDavUrl, webDavAccount, webDavPassword)
    const result = await getFileContents(webDavClient, fileItem.filename)
    const backupData = JSON.parse(result)

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

export function listLocalBackupFiles({backupPath}) {
    return window.services.readBackupFileList(backupPath)
}

export function restoreLocalBackupFile({fileItem}) {
    const result = window.services.readBackupFile(fileItem.filename)
    const backupData = JSON.parse(result)

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

