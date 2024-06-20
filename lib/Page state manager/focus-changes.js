import { GetPageContentById, WritePageContent } from "./storage-management";


// Exported function
export function enableFocusChangeEventListener(editor, pageId) {
    console.log("Enabling focus loss detection")
    window.addEventListener("visibilitychange", () => vischange(editor, pageId), false);

}


async function vischange(editor, pageId) {
    console.log("Change")
    if (document.hidden) {
        console.log("Writing")
        WritePageContent(editor, pageId)
    } else {
        console.log("Reading")
        const storedContent = GetPageContentById(pageId)
        const visibleContent = await editor.save()

        if (!areJsonObjectsEqual(storedContent.blocks, visibleContent.blocks)) {
            console.log("Diff")
            await editor.blocks.render(storedContent)
            console.log(storedContent.blocks)
            console.log(visibleContent.blocks)
        } else {
            console.log("same")
        }
    }
}

function deepEqual(obj1, obj2, path = "") {
    if (obj1 === obj2) return true;

    if (obj1 == null || typeof obj1 !== 'object' || obj2 == null || typeof obj2 !== 'object') {
        console.log(`Difference found at ${path}:`, { obj1, obj2 });
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        console.log(`Difference found at ${path}: key lengths differ`);
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            console.log(`Difference found at ${path}.${key}: key missing in second object`);
            return false;
        }
        if (!deepEqual(obj1[key], obj2[key], `${path}.${key}`)) {
            return false;
        }
    }

    return true;
}

function areJsonObjectsEqual(json1, json2) {
    // Compare the objects
    return deepEqual(json1, json2);
}