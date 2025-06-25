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
    return new Promise((resolve, reject) => {
        if (client) {
            if (isEmpty(folderPath)) {
                folderPath = '/'
            }
            try {
                client.getDirectoryContents(folderPath).then(result => {
                    resolve(result)
                }).catch(e => {
                    reject(e)
                })
            } catch (e) {
                reject(e)
            }
        } else {
            resolve([])
        }
    })
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
            }).catch(e => {
                reject(e)
            })
        } catch (e) {
            reject(e)
        }
    })
}
