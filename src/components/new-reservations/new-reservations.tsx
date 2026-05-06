import { useContext, useRef, useState } from "react";
import UploadFile from "./upload";
import ProcessFile from "./process-file";
import Table from "./table";
import { ReservationsType } from "../../utils/interfaces";
import { DatabaseContext } from "../../utils/context";

function NewReservations() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [timestamp, setTimestamp] = useState<Date|undefined>(undefined);

    return (
        <div className="page">
            <h1>New Reservations</h1>
            <UploadFile setSelectedFile={setSelectedFile} />
            <ProcessFile selectedFile={selectedFile} setTimestamp={setTimestamp} />
            <Table timestamp={timestamp} />
        </div>
    )

}

export default NewReservations;