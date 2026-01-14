import { useState, type ChangeEvent } from 'react';
import axios from 'axios';


// const [inputs, setInputs] = useState<Array<ReceiptInput>>([{item:'', price: 0.00, person: ''}]);
// const [allFees, setAllFees] = useState<Fees>({tax: 0, tip: 0, fees: 0});

function getItems(items) {
    return items.map(({menuItem, totalPrice}) => {
        return {
            item: menuItem,
            price: totalPrice,
            person: ''
        }
    })
}

function getFees(result) {
    const {tax, tip, fees} = result;
    return {
        tax: tax || 0,
        tip: tip || 0,
        fees: fees || 0
    }
}

function Upload({setInputs, setAllFees}) {
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
            setInputs(getItems(response?.data?.items));
            setAllFees(getFees(response?.data));
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