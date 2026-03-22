/**
 * WebDAV 客户端工具模块
 * 封装 WebDAV 操作相关功能
 */
import {createClient} from 'webdav'

/**
 * 初始化 WebDAV 客户端
 * @param {string} url - WebDAV 服务器地址
 * @param {string} userName - 用户名
 * @param {string} password - 密码
 * @returns {Object|null} WebDAV 客户端实例，初始化失败返回 null
 */
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

/**
 * 获取目录内容列表
 * @param {Object} client - WebDAV 客户端实例
 * @param {string} folderPath - 目录路径，默认为根目录
 * @returns {Promise<Array>} 目录内容数组，按修改时间倒序排列
 */
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

/**
 * 上传文件内容到 WebDAV
 * @param {Object} client - WebDAV 客户端实例
 * @param {string} fileName - 文件名
 * @param {string} fileContent - 文件内容
 * @param {string} subFolder - 子文件夹路径
 * @param {boolean} overwrite - 是否覆盖已存在的文件
 */
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

/**
 * 获取文件内容
 * @param {Object} client - WebDAV 客户端实例
 * @param {string} fileName - 文件路径
 * @returns {Promise<string>} 文件内容（文本格式）
 */
export async function getFileContents(client, fileName) {
    return await client.getFileContents(fileName, {format: 'text'})
}
