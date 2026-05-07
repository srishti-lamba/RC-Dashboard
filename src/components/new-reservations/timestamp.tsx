import { JSX, useContext, useEffect, useRef, useState } from "react";
import { DatabaseContext } from "../../utils/context";
import { dbNames } from "../../utils/constants";

interface TimestampProps {
    ts : Date|undefined;
}

function Timestamp({ts} : TimestampProps) {

    const database = useContext(DatabaseContext).database!;
    const [timestamp, setTimestamp] = useState<JSX.Element>(<>No data</>)

    useEffect(() => {
        async function getTimestamp(){
            let data = await database.current?.getTimestamp(dbNames.NEW_RESERVATIONS)
            if (data === undefined) return
            let d = new Date(data.timestamp)
            setTimestamp(<>{d.toDateString()} <small>at</small> {d.toLocaleTimeString()}</>)
        }
        getTimestamp();
    }, [ts])

    return (
        <div className="timestamp">
            <small>Last updated:</small> {timestamp}
        </div>
    )
}

export default Timestamp;