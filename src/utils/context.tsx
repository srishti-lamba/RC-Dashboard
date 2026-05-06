import { createContext } from 'react';
import Database from './database';

export interface Dictionary<T> {
    [key: string]: T;
}

interface DatabaseType {
    database : React.RefObject<Database|undefined>|undefined;
};

export const DatabaseContext = createContext<DatabaseType>({ database : undefined });

