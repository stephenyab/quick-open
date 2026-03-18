export function getData(key) {
    return window.utools.db.get(key)
}

export function getAllData() {
    return window.utools.db.allDocs()
}

export function getAllDataByKeys(keys) {
    return window.utools.db.allDocs(keys)
}

export function saveData(data) {
    return window.utools.db.put(data)
}

export function deleteData(key) {
    window.utools.db.remove(key)
}

export function deleteFeature(key) {
    window.utools.removeFeature(key)
}

export function setFeature(code, explain, cmds) {
    window.utools.setFeature({
        code: code, explain: explain, cmds: cmds
    })
}
