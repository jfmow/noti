import { isFunction } from "lodash"
import pb from "../pocketbase"

export const pageUpdaterDebounce = createIDDebouncer();

export function SendPageChanges(pageId, changes, noDBUpdate) {
    if (pageId.length < 15) return Error("Missing pageId")

    const pagechannel = new BroadcastChannel(`page-changes-${pageId}`)
    pagechannel.postMessage(changes)

    const globalchannel = new BroadcastChannel(`page-changes`)
    globalchannel.postMessage({ id: pageId, ...changes })

    if (!noDBUpdate && pb && changes && Object.keys(changes).length >= 1) {
        pageUpdaterDebounce.debounce(pageId, () => {
            pb.collection('pages').update(pageId, changes).then((successRes) => {
                console.info(`${pageId} update sent `)
                //console.info(`\n${JSON.stringify(successRes)}`)
            }, (errorRes) => {
                console.error(errorRes?.message || errorRes)
            })
        });

    }
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

export function createIDDebouncer() {
    const timers = {};

    function debounce(pageId, callback, delay = 350) {
        if (timers[pageId]) {
            clearTimeout(timers[pageId]);
        }

        timers[pageId] = setTimeout(() => {
            callback();
            delete timers[pageId];
        }, delay);
    }

    function cancel(pageId) {
        if (timers[pageId]) {
            clearTimeout(timers[pageId]);
            delete timers[pageId];
        }
    }

    function cancelAll() {
        Object.keys(timers).forEach(pageId => {
            clearTimeout(timers[pageId]);
            delete timers[pageId];
        });
        console.log("Canceling all")
    }

    return {
        debounce,
        cancel,
        cancelAll,
    };
}