import './App.css';
import Sidebar from './components/sidebar/sidebar';
import { BrowserRouter } from "react-router-dom";
import Router from './components/router/router';
import { useEffect, useRef, useState } from 'react';
import { DatabaseContext } from './utils/context';
import Database from './utils/database';
import { dbNames } from './utils/constants';

function App() {

  const database = useRef<Database>(undefined);
  const [dbSet, setDbSet] = useState<boolean>(false);

  useEffect(() => {
    async function createDatabase() {
      database.current = new Database(dbNames.DATABASE);
      await database.current.createObjectStore_allReservations();
      setDbSet(true)
    }

    createDatabase();
  }, [])

  return (
    <div className="App">
      <DatabaseContext value={{
          database: database,
          dbSet: dbSet
        }}>
        <BrowserRouter>
          <Sidebar />
          <Router />
        </BrowserRouter>
      </DatabaseContext>
    </div>
  );
}

export default App;
