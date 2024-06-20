import { GetPageContentById, WritePageContent } from "./storage-management";


// Exported function
export function enableFocusChangeEventListener(editor, pageId) {
    document.addEventListener("visibilitychange", () => vischange(editor, pageId));
}


async function vischange(editor, pageId) {
    if (document.hidden) {
        console.log("Writing")
        WritePageContent(editor, pageId)
    } else {
        console.log("Reading")
        const storedContent = GetPageContentById(pageId)
        const visibleContent = await editor.save()

        if (!areJsonObjectsEqual(JSON.stringify(storedContent.blocks), JSON.stringify(visibleContent.blocks))) {
            console.log("Diff")
            await editor.blocks.render(storedContent)
            console.log(storedContent.blocks)
            console.log(visibleContent.blocks)
        } else {
            console.log("same")
        }
    }
}

function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (obj1 == null || typeof obj1 !== 'object' || obj2 == null || typeof obj2 !== 'object') {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

function areJsonObjectsEqual(json1, json2) {
    // Convert JSON strings to objects
    let obj1 = JSON.parse(json1);
    let obj2 = JSON.parse(json2);

    // Compare the objects
    return deepEqual(obj1, obj2);
}