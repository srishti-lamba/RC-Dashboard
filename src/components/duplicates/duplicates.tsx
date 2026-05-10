import { useContext, useEffect, useState } from "react";
import Table from "./table";
import { DatabaseContext } from "../../utils/context";

function Duplicates() {

    const [timestamp, setTimestamp] = useState<Date|undefined>(undefined);
    const dbSet : boolean = useContext(DatabaseContext).dbSet

    useEffect(() => {
        if (dbSet === true)
            setTimestamp(new Date())
    }, [dbSet])

    return (
        <div className="page">
            <h1>Duplicates</h1>
            <Table timestamp={timestamp} />
        </div>
    )
}

export default Duplicates;