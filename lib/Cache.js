
export const Cache = {
    async set(key, value) {
        window.sessionStorage.setItem(key, value)
    },
    async get(key) {
        const data = await window.sessionStorage.getItem(key)
        const parsed = JSON.parse(data)
        return parsed
    }
}