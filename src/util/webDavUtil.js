import {createClient} from 'webdav'
import {isEmpty} from "@/util/commonUtil.js"

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
