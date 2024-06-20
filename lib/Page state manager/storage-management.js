export const storageItemName = "cachedPages"
export async function WritePageContent(editor, pageId) {
    const editorContent = await editor.save()
    let otherPages = GetAllPageContent()
    otherPages[pageId] = editorContent
    window.localStorage.setItem(storageItemName, JSON.stringify(otherPages))
}

function GetAllPageContent() {
    const storedPages = JSON.parse(window.localStorage.getItem(storageItemName))
    if (storedPages && Object.keys(storedPages).length >= 1) {
        return storedPages
    } else {
        return {}
    }
}

export function GetPageContentById(pageId) {
    const storedContent = GetAllPageContent()
    const content = storedContent[pageId]
    return content
}