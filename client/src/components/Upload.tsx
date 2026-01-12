import { useState, type ChangeEvent } from 'react';
import axios from 'axios';

function Upload() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) return alert('Please select a file');

        // FormData object used to store file
        const formData = new FormData();
        formData.append('receipt-image', file);

        try {
            const response = await axios.post('http://localhost:3000/api/receipt/upload', formData);
            console.log(response);
            setMessage('Successful');
        } catch (err) {
            console.log(err);
            setMessage('Failed');
        }
    }

    return (
        <div className="container">
            <form action="" onSubmit={handleSubmit}>
                <input type="file" onChange={handleChange}/>
                <button type="submit">Upload</button>
            </form>
            <div>{message}</div>
        </div>
    )
}

export default Upload;