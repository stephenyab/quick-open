export function getData(key) {
    return window.utools.db.get(key)
}

export function getAllData(keys) {
    return window.utools.db.allDocs(keys)
}

export function saveData(data) {
    return window.utools.db.put(data)
}
