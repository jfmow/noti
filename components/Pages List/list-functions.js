export function sortAndNestObjects(data) {
    // Create a map to store each object by its id for quick lookup
    const idMap = {};
    data.forEach(obj => {
        idMap[obj.id] = obj;
        obj.children = []; // Initialize children array for each object
    });

    // Array to hold root objects (those with parentId === null or "")
    const roots = [];

    // Iterate through the data to build the tree structure
    data.forEach(obj => {
        // Treat empty string "" as null
        const parentId = obj.parentId === "" ? null : obj.parentId;

        if (parentId !== null) {
            // If parentId exists, find the parent object and nest current object under it
            const parent = idMap[parentId];
            if (parent) {
                parent.children.push(obj);
            } else {
                // Handle case where parentId doesn't match any existing id (optional)
                console.error(`Parent object with id ${parentId} not found for object with id ${obj.id}`);
            }
        } else {
            // If parentId is null, it's a root object
            roots.push(obj);
        }
    });

    // Return the sorted and nested objects
    return roots;
}

export function findPageListPage(id, pageListItems) {
    if (!pageListItems || pageListItems.length < 1) { return Error("Missing pageListItems") }
    return pageListItems.find((item) => item.id === id) || null
}