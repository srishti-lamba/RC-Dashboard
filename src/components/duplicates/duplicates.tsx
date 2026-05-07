import { useState } from "react";
import Table from "./table";

function Duplicates() {

    const [timestamp, setTimestamp] = useState<Date|undefined>(undefined);

    return (
        <div className="page">
            <h1>Duplicates</h1>
            <Table timestamp={timestamp} />
        </div>
    )
}

export default Duplicates;