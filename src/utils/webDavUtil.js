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

    const result = await client.getDirectoryContents(folderPath)
    const items = result instanceof Array ? result : [result]
    return items.sort((a, b) => {
        const timeA = new Date(a.lastmod || a.lastModified || 0).getTime()
        const timeB = new Date(b.lastmod || b.lastModified || 0).getTime()
        return timeB - timeA
    })
}

export async function putFileContents(client, fileName, fileContent, subFolder = '', overwrite = false) {
    let normalizedSubFolder = ''
    if (subFolder) {
        normalizedSubFolder = `/${subFolder.trim().replace(/^\/+|\/+$/g, '')}`
    }

    const filePath = normalizedSubFolder ? `${normalizedSubFolder}/${fileName}` : `/${fileName}`

    if (normalizedSubFolder && !(await client.exists(normalizedSubFolder))) {
        await client.createDirectory(normalizedSubFolder)
    }

    await client.putFileContents(filePath, fileContent, {overwrite})
}

export async function getFileContents(client, fileName) {
    return await client.getFileContents(fileName, {format: 'text'})
}
