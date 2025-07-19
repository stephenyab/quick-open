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
