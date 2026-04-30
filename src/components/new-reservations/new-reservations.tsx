import { useState } from "react";
import UploadFile from "./upload";
import ProcessFile from "./process-file";
import Table from "./table";
import { ReservationsType } from "../../utils/interfaces";

function NewReservations() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState<ReservationsType[]>([]);

    // useEffect(() => {
    //     console.log(selectedFile)
    // }, [selectedFile])
    // useEffect(() => {
    //     console.log(data)
    // }, [data])

    return (
        <div className="page">
            <h1>New Reservations</h1>
            <UploadFile setSelectedFile={setSelectedFile} />
            <ProcessFile selectedFile={selectedFile} setData={setData} />
            <Table data={data} />
        </div>
    )

}

export default NewReservations;