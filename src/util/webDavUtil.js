import {createClient} from 'webdav'

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

export async function getDirectoryContents(client, folderPath = '/') {
    if (!client) {
        return []
    }

    if (typeof folderPath !== 'string' || !folderPath.trim()) {
        folderPath = '/'
    }

    try {
        return await client.getDirectoryContents(folderPath)
    } catch (error) {
        throw error
    }
}

export async function putFileContents(client, fileName, fileContent, subFolder = '', overwrite = false) {
    try {
        let normalizedSubFolder = ''
        if (subFolder) {
            normalizedSubFolder = `/${subFolder.trim().replace(/^\/+|\/+$/g, '')}`
        }

        const filePath = normalizedSubFolder ? `${normalizedSubFolder}/${fileName}` : `/${fileName}`

        if (normalizedSubFolder && !(await client.exists(normalizedSubFolder))) {
            await client.createDirectory(normalizedSubFolder)
        }

        await client.putFileContents(filePath, fileContent, {overwrite})
    } catch (error) {
        throw error
    }
}

export async function getFileContents(client, fileName) {
    try {
        return await client.getFileContents(fileName, {format: 'text'})
    } catch (error) {
        throw error
    }
}
