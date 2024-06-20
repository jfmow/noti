export function RegisterEditorChangesBroadCast(editor, pageId) {
    const myChannel = new BroadcastChannel('editorContentChanges');

    myChannel.addEventListener('message', (event) => {
        const rawData = event.data

        const updatedPageId = rawData.pageid
        const updatedBlocks = rawData.blocks

        if (updatedPageId === pageId && document.hidden) {
            editor.render(updatedBlocks)
        }
    }, false);

}

export function SendEditorChangeMessage(editorData, pageId) {
    const myChannel = new BroadcastChannel('editorContentChanges');
    myChannel.postMessage({ pageid: pageId, blocks: editorData })
}