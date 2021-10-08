export const getMenuId = (arr, path) => {
    if (arr === '{}') {
        return 0
    }
    let id = JSON.parse(arr)[path]
    return id
}