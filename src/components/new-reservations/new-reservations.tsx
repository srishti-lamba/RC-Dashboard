import { useState, useEffect } from "react";
import UploadFile from "./upload";
import ProcessFile, { NewReservationsType } from "./process-file";
import Table from "./table";

function NewReservations() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState<NewReservationsType[]>([]);

    // useEffect(() => {
    //     console.log(selectedFile)
    // }, [selectedFile])
    // useEffect(() => {
    //     console.log(data)
    // }, [data])

    return (
        <div className="page">
            <UploadFile setSelectedFile={setSelectedFile} />
            <ProcessFile selectedFile={selectedFile} setData={setData} />
            <Table data={data} />
        </div>
    )

}

export default NewReservations;