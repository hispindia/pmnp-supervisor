import DB from './tiny-idb';

export const setUpDatabase = async () => {
    await DB.createDB('metadataDatabase', 1, [
        // list of object stores to create after the DB is created
        {
            name: 'program_metadata',
            config: { keyPath: 'id' },
            data: [],
        },
    ]);
};

export const getIdbByKey = async (key) => {
    await setUpDatabase();
    let db = await DB.openDB('metadataDatabase', 1);
    const dataStore = await DB.transaction(
        db,
        ['program_metadata'],
        'readwrite'
    ).getStore('program_metadata');
    let allData = await DB.getObjectData(dataStore, key);
    return allData;
};

export const addIdbByKey = async (key, data) => {
    // open Database
    const db = await DB.openDB('metadataDatabase', 1);
    const dataStore = await DB.transaction(
        db,
        ['program_metadata'],
        'readwrite'
    ).getStore('program_metadata');
    dataStore.add({ id: key, value: data });
};
