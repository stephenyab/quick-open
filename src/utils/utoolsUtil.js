/**
 * uTools 数据库操作工具模块
 * 封装 uTools 数据库和功能相关的操作
 */

/**
 * 根据 key 获取单条数据
 * @param {string} key - 数据键名
 * @returns {Object|null} 数据对象，不存在则返回 null
 */
export function getData(key) {
    return window.utools.db.get(key)
}

/**
 * 获取所有数据
 * @returns {Array} 所有数据数组
 */
export function getAllData() {
    return window.utools.db.allDocs()
}

/**
 * 根据 key 列表批量获取数据
 * @param {Array<string>} keys - 数据键名数组
 * @returns {Array} 匹配的数据数组
 */
export function getAllDataByKeys(keys) {
    return window.utools.db.allDocs(keys)
}

/**
 * 保存数据到数据库
 * @param {Object} data - 要保存的数据对象，需包含 _id 字段
 * @returns {Object} 保存结果，包含 ok、id、rev 等字段
 */
export function saveData(data) {
    return window.utools.db.put(data)
}

/**
 * 根据 key 删除数据
 * @param {string} key - 数据键名
 */
export function deleteData(key) {
    window.utools.db.remove(key)
}

/**
 * 删除动态功能
 * @param {string} key - 功能关键字
 */
export function deleteFeature(key) {
    window.utools.removeFeature(key)
}

/**
 * 设置动态功能
 * @param {string} code - 功能代码
 * @param {string} explain - 功能说明
 * @param {Array} cmds - 触发命令配置
 */
export function setFeature(code, explain, cmds) {
    window.utools.setFeature({
        code: code, explain: explain, cmds: cmds
    })
}
