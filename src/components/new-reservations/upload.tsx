import { useEffect, useState } from "react";

interface UploadFileProps {
    setSelectedFile : any
}

function UploadFile({setSelectedFile} : UploadFileProps) {


	const onFileChange = (event : any) => {
		setSelectedFile(event.target.files[0]);
	};

    return (
        <div>
            <input type="file" onChange={onFileChange} />
        </div>
    )
}

export default UploadFile;