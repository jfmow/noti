export function sortRecords(records, includeArchived = false) {

    const recordMap = {};
    const sortedRecords = [];
    const archivedRecordIds = new Set();

    // Identify records that are archived or have an archived parent
    records.forEach(record => {
        if (record.archived) {
            archivedRecordIds.add(record.id);
        }
    });

    // Create a map of records by their id and identify if they or their parents are archived
    records.forEach(record => {
        if (archivedRecordIds.has(record.parentId)) {
            archivedRecordIds.add(record.id);
        } else {
            record.children = record.children || [];
            recordMap[record.id] = record;
        }
    });

    // Populate the children arrays and create the hierarchical structure
    records.forEach(record => {
        if (includeArchived || !archivedRecordIds.has(record.id)) {
            if (record.parentId && recordMap[record.parentId]) {
                recordMap[record.parentId].children.push(record);
            } else if (!record.parentId) {
                sortedRecords.push(record);
            }
        }
    });


    return sortedRecords;
}

export function sortRfecords(records, includeArchived = false) {
    const unsortedRecordsMap = {}
    const sortedRecords = []

    function addRecordsToMap(records) {
        records.forEach(record => {
            unsortedRecordsMap[record.id] = record
            record.children = record.children || []
            if (record.children.length >= 1) {
                addRecordsToMap(record.children)
            }
        })
    }

    addRecordsToMap(records)

    records.forEach(record => {
        if (record.parentId && unsortedRecordsMap[record.parentId]) {
            unsortedRecordsMap[record.parentId].children.push(record);
        } else if (!record.parentId) {
            sortedRecords.push(record);
        }
    })

    console.log(records)
    console.log(unsortedRecordsMap)
    console.log(sortedRecords)

    return unsortedRecordsMap, sortedRecords
}

// Function to update a record's property by its id
function updateRecordById(records, id, updates) {
    function update(record) {
        if (record.id === id) {
            Object.assign(record, updates);
            return true;
        }
        if (record.children) {
            for (let child of record.children) {
                if (update(child)) {
                    return true;
                }
            }
        }
        return false;
    }

    const newRecords = [...records];
    for (let record of newRecords) {
        if (update(record)) {
            break;
        }
    }
    return newRecords;
}

// Function to insert a new record
function insertRecord(records, newRecord) {
    const updatedRecords = [...records];

    function insertIntoParent(records, newRecord) {
        for (let record of records) {
            if (record.id === newRecord.parentId) {
                record.children = record.children || []
                record.children.push(newRecord);
                return true;
            }
            if (record.children && insertIntoParent(record.children, newRecord)) {
                return true;
            }
        }
        return false;
    }

    // If the new record has a parentId, insert it into the correct parent
    if (newRecord.parentId) {
        insertIntoParent(updatedRecords, newRecord);
    } else {
        // If the new record doesn't have a parentId, add it to the root level
        updatedRecords.push(newRecord);
    }

    return sortRecords(updatedRecords);
}

// Function to remove a record by its id
function removeRecordById(records, id) {
    function remove(record) {
        if (record.id === id) {
            return true;
        }
        if (record.children) {
            record.children = record.children.filter(child => !remove(child));
        }
        return false;
    }

    return records.filter(record => !remove(record));
}

// Function to find a record and its ancestors by id
function findRecordAndAncestors(records, id) {
    const result = [];

    function find(record, ancestors = []) {
        // Push the current record into the ancestors array
        ancestors.push(record);

        if (record.id === id) {
            // When the target record is found, copy the ancestors array to the result
            result.push(...ancestors);
            return true;
        }

        if (record.children) {
            for (let child of record.children) {
                if (find(child, [...ancestors])) {
                    return true;
                }
            }
        }
        return false;
    }

    for (let record of records) {
        if (find(record)) {
            break;
        }
    }

    return result;
}


// Function to find a record and its ancestors by id
function findRecordById(records, id) {
    let resultRecord = {};

    function find(record, ancestors = []) {
        // Push the current record into the ancestors array
        ancestors.push(record);

        if (record.id === id) {
            // When the target record is found, copy the ancestors array to the result
            resultRecord = record;
            return true;
        }

        if (record.children) {
            for (let child of record.children) {
                if (find(child, [...ancestors])) {
                    return true;
                }
            }
        }
        return false;
    }

    for (let record of records) {
        if (find(record)) {
            break;
        }
    }

    return resultRecord;
}

// Functions to handle state updates
export const handleUpdateRecord = (id, updates, setListedPageItems) => {
    setListedPageItems(prevRecords => sortRecords(updateRecordById(prevRecords, id, updates)));
};

export const handleInsertRecord = (newRecord, setListedPageItems) => {
    setListedPageItems(prevItems => insertRecord(prevItems, newRecord));
};

export const handleRemoveRecord = (id, setListedPageItems) => {
    setListedPageItems(prevItems => sortRecords(removeRecordById(prevItems, id)));
};

export const handleFindRecordAndAncestors = (id, records) => {
    const ancestors = findRecordAndAncestors(records, id);
    return ancestors
};
export const handleFindRecordById = (id, records) => {
    const record = findRecordById(records, id);
    return record
};