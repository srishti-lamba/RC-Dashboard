import { IDBPDatabase, openDB } from "idb";
import { ReservationsType } from "./interfaces";

class Database {
    private databaseName: string;
    private db: any;

    constructor(database: string) {
        this.databaseName = database;
    }

    public async createObjectStore(tableNames: string[]) {
        try {
            this.db = await openDB(this.databaseName, 1, {
                upgrade(db: IDBPDatabase) {
                    for (const tableName of tableNames) {
                        if (db.objectStoreNames.contains(tableName)) {
                            continue;
                        }
                        db.createObjectStore(tableName, { autoIncrement: false, keyPath: 'confirmationNumber' });
                    }
                },
                blocked(currentVersion, blockedVersion, event) {
                    // …
                },
                blocking(currentVersion, blockedVersion, event) {
                    // …
                },
                terminated() {
                    // …
                },
            });
        } catch (error) {
            return false;
        }
    }

    public async createObjectStore_newReservations() {
        const tableName = "newReservations"
        try {
            this.db = await openDB(this.databaseName, undefined, {
                upgrade(db: IDBPDatabase) {    
                    if (db.objectStoreNames.contains(tableName)) {
                        return;
                    }
                    const store = db.createObjectStore(tableName, { autoIncrement: false, keyPath: "confirmationNumber" });
                    store.createIndex("confirmationNumberIndex", "confirmationNumber", { unique: true });  
                },
                blocked(currentVersion, blockedVersion, event) {
                    // …
                },
                blocking(currentVersion, blockedVersion, event) {
                    // …
                },
                terminated() {
                    // …
                },
            });
        } catch (error) {
            return false;
        }
    }

    public async getValue(tableName: string, id: number) {
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        const result = await store.get(id);
        console.log('Get Data ', JSON.stringify(result));
        return result;
    }

    public async getAllValue(tableName: string) {
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        const result = await store.getAll();
        console.log('Get All Data', JSON.stringify(result));
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
        // const result = await store.getAll();
        // console.log('Get All Data', JSON.stringify(result));
        // return result;
    }

    public async putValue(tableName: string, value: object) {
        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        const result = await store.put(value);
        console.log('Put Data ', JSON.stringify(result));
        return result;
    }

    public async putBulkValue(tableName: string, values: object[]) {
        const tx : IDBTransaction = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        for (const value of values) {
            const result = await store.put(value);
            console.log('Put Bulk Data ', JSON.stringify(result));
        }
        return this.getAllValue(tableName);
    }

    public async putBulkValue_reservations(tableName: string, values: ReservationsType[]) {
        const tx : IDBTransaction = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        for (const value of values) {
            const result = await store.put(value);
            console.log('Put Bulk Reservation Data ', JSON.stringify(result));
        }
        return this.getAllValue(tableName);
    }

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