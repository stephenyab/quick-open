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
        const result = await client.getDirectoryContents(folderPath)
        const items = result instanceof Array ? result : [result]
        return items.sort((a, b) => {
            const timeA = new Date(a.lastmod || a.lastModified || 0).getTime()
            const timeB = new Date(b.lastmod || b.lastModified || 0).getTime()
            return timeB - timeA
        })
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
