import { IDBPDatabase, openDB } from "idb";
import { ReservationsType, ConfirmationNumberType } from "./interfaces";
import { dbNames } from "./constants";

class Database {
    private databaseName: string;
    private db: any;

    constructor(database: string) {
        this.databaseName = database;
    }

    // public async createObjectStore(tableNames: string[]) {
    //     try {
    //         this.db = await openDB(this.databaseName, 1, {
    //             upgrade(db: IDBPDatabase) {
    //                 for (const tableName of tableNames) {
    //                     if (db.objectStoreNames.contains(tableName)) {
    //                         continue;
    //                     }
    //                     db.createObjectStore(tableName, { autoIncrement: false, keyPath: 'confirmationNumber' });
    //                 }
    //             },
    //             blocked(currentVersion, blockedVersion, event) {
    //                 // …
    //             },
    //             blocking(currentVersion, blockedVersion, event) {
    //                 // …
    //             },
    //             terminated() {
    //                 // …
    //             },
    //         });
    //     } catch (error) {
    //         return false;
    //     }
    // }

    public async createObjectStore_allReservations() {
        try {
            this.db = await openDB(this.databaseName, undefined, {
                upgrade(db: IDBPDatabase) {    
                    let tableName = dbNames.ALL_RESERVATIONS
                    if (!db.objectStoreNames.contains(tableName)) {
                        const store = db.createObjectStore(tableName, { autoIncrement: false, keyPath: "confirmationNumber" });
                        store.createIndex("confirmationNumberIndex", "confirmationNumber", { unique: true });  
                        console.log(`${tableName} successfully created`)
                    }

                    tableName = dbNames.NEW_RESERVATIONS
                    if (!db.objectStoreNames.contains(tableName)) {
                        const store = db.createObjectStore(tableName, { autoIncrement: false, keyPath: "confirmationNumber" }); 
                        console.log(`${tableName} successfully created`)
                    }
                },
                blocked(currentVersion, blockedVersion, event) {},
                blocking(currentVersion, blockedVersion, event) {},
                terminated() {},
            });
        } catch (error) {
            return false;
        }
    }

    // -----------
    // --- Get ---
    // -----------

    public async getValue(tableName: string, id: number) {
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        const result = await store.get(id);
        console.log('Get Data ', JSON.stringify(result));
        return result;
    }

    public async getAllValues(tableName: string) {
        let result = []
        try {
            const tx = this.db.transaction(tableName, 'readonly');
            const store = tx.objectStore(tableName);
            result = await store.getAll();
        }
        catch(e) {
            console.error(e)
            return result;
        }
        console.log('Get All Data', JSON.stringify(result));
        return result;
    }

    public async getAllValues_newReservations() : Promise<ReservationsType[]> {
        let result : ReservationsType[] = []
        try {
            const tx : IDBTransaction = this.db.transaction(dbNames.NEW_RESERVATIONS, 'readwrite');
            const store_new : IDBObjectStore = tx.objectStore(dbNames.NEW_RESERVATIONS);
            
            const data_new =  await store_new.getAll();
            result = await this.getValuesFromKeys_allReservations(data_new as unknown as ConfirmationNumberType[]);
        }
        catch(e) {
            console.error(e)
            return result;
        }
        return result;
    }

    public async getValuesFromKeys_allReservations(keys : ConfirmationNumberType[]) : Promise<ReservationsType[]> {
        let result : ReservationsType[] = []
        try {
            const tx : IDBTransaction = this.db.transaction(dbNames.ALL_RESERVATIONS, 'readwrite');
            const store_all : IDBObjectStore = tx.objectStore(dbNames.ALL_RESERVATIONS);

            let data_all = await Promise.allSettled(
                keys.map(async num => store_all.get(num.confirmationNumber))
            )
            data_all.forEach(data => { 
                if (data.status === 'fulfilled') result.push(data.value as any)
            })
        }
        catch(e) {
            console.error(e)
            return result;
        }
        return result;
    }

    public async getAllValueQuery(tableName: string, range : IDBKeyRange, ) {
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        var index = store.index('index');
        var request = index.openCursor(range);
        request.onsuccess = function() {
        var cursor = this.result;
        if(cursor) {
            var adminUser = cursor.value;
            // callback(adminUser);
            cursor.continue();
            } else {
            // No admins found or all admins iterated
            }
        };
    }

    // -----------
    // --- Put ---
    // -----------

    public async putValue(tableName: string, value: object) {
        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        const result = await store.put(value);
        console.log('Put Data ', JSON.stringify(result));
        return result;
    }

    public async putBulkValue(tableName: string, values: object[]) {
        try {
            const tx : IDBTransaction = this.db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            for (const value of values) {
                const result = await store.put(value);
                console.log('Put Bulk Data ', JSON.stringify(result));
            }
        }
        catch(e) {
            console.error(e)
        }
        return this.getAllValues(tableName);
    }

    public async putBulkValue_newReservations(values: ReservationsType[]) {
        const tx : IDBTransaction = this.db.transaction([dbNames.ALL_RESERVATIONS, dbNames.NEW_RESERVATIONS], 'readwrite');
        const store_all : IDBObjectStore = tx.objectStore(dbNames.ALL_RESERVATIONS);
        const store_new : IDBObjectStore = tx.objectStore(dbNames.NEW_RESERVATIONS);

        for (const value of values) {
            const result_all = store_all.put(value);
            const result_new = store_new.put({confirmationNumber: value.confirmationNumber});
        }
    }

    // --------------
    // --- Delete ---
    // --------------

    public async deleteValue(tableName: string, id: number) {
        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        const result = await store.get(id);
        if (!result) {
            console.log('Id not found', id);
            return result;
        }
        await store.delete(id);
        console.log('Deleted Data', id);
        return id;
    }
}

export default Database;