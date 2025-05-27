import {createClient} from 'webdav'
import {isEmpty, isNotEmpty} from "@/util/commonUtil.js"

export function initWebDavClient(url, userName, password) {
    try {
        return createClient(url, {
            username: userName, password: password
        })
    } catch (e) {
        console.error(e)
        return null
    }
}

export function getDirectoryContents(client, folderPath = '/') {
    if (client) {
        if (isEmpty(folderPath)) {
            folderPath = '/'
        }
        try {
            return client.getDirectoryContents(folderPath)
        } catch (e) {
            console.error(e)
            return []
        }
    } else {
        return []
    }
}

export function putFileContents(client, fileName, fileContent, subFolder = '', overwrite = false) {
    return new Promise((resolve, reject) => {
        try {
            if (isNotEmpty(subFolder)) {
                fileName = `/${subFolder}/${fileName}`
            } else {
                fileName = `/${fileName}`
            }
            client.putFileContents(fileName, fileContent, {overwrite: overwrite}).then(() => {
                resolve()
            })
        } catch (e) {
            reject(e)
        }
    })
}
