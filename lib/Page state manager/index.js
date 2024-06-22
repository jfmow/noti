import { isFunction } from "lodash"

export function SendPageChanges(pageId, changes) {
    if (pageId.length < 15) return Error("Missing pageId")

    const pagechannel = new BroadcastChannel(`page-changes-${pageId}`)
    pagechannel.postMessage(changes)

    const globalchannel = new BroadcastChannel(`page-changes`)
    globalchannel.postMessage({ id: pageId, ...changes })
}

export function ListenForAllPageChanges(callback) {
    if (!isFunction(callback)) {
        return Error("Callback is not a valid function")
    }

    const channel = new BroadcastChannel(`page-changes`)

    channel.onmessage = (event) => {
        const data = event.data
        callback(data)
    }
}

export function ListenForPageChange(pageId, callback) {
    if (!isFunction(callback)) {
        return Error("Callback is not a valid function")
    }

    const channel = new BroadcastChannel(`page-changes-${pageId}`)

    channel.onmessage = (event) => {
        const data = event.data
        callback(data)
    }
}