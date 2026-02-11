import { useState, type ChangeEvent } from 'react';
import axios from 'axios';

const fileMaxSizeMB: number = 5;
const allowedFileTypes: string[] = ['image/jpeg', 'image/png'];

type ReceiptItem = {
    menuItem: string,
    pricePerQuantity?: number,
    quantity?: number,
    totalPrice: number
}

type FormattedItem = {
    item: string,
    price: number,
    person: string[]
}

type Fees = {
    tax: number,
    tip: number,
    fees: number
}

type UploadProps = {
    setInputs: (items: FormattedItem[]) => void,
    setAllFees: (fees: Fees) => void
}

const apiURL = import.meta.env.VITE_API_URL;

// Retrieve desired receipt data from Azure API response
function getItems(items: ReceiptItem[]): FormattedItem[] {
    return items.map(({menuItem, totalPrice}) => {
        return {
            item: menuItem,
            price: totalPrice,
            person: [] // The receipt does not have info on who's paying what, the user will have to input that
        }
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFees(result: any): Fees {
    const {tax, tip, fees} = result;
    return {
        tax: tax || 0,
        tip: tip || 0,
        fees: fees || 0
    }
}

function Upload({setInputs, setAllFees}: UploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [fileChosen, setFileChosen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>();

    // Upload image file to input
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const targetFile = e.target.files[0];
            console.log(targetFile);
            if (targetFile.size > (fileMaxSizeMB * 1024 * 1024)) {
                setError('File size too large');
                e.target.value = "";
                setFile(null);
                return;
            } else if (!allowedFileTypes.includes(targetFile.type)) {
                setError('File must be .jpg or .png');
                e.target.value = "";
                setFile(null);
                return;
            }

            setFile(targetFile);
            setFileChosen(true);
            setError(null);
        }
    }

    // Submit image file to server
    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) return alert('Please select a file');

        // FormData object used to store file
        const formData = new FormData();
        formData.append('receipt-image', file);

        try {
            setLoading(true);
            const response = await axios.post(`${apiURL}/receipt/upload`, formData);
            console.log(response);
            setInputs(getItems(response?.data?.items));
            setAllFees(getFees(response?.data));
            setMessage('Successful!');
        } catch (err) {
            console.log(err);
            setMessage('Failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            {loading 
            ? <div className="loading-spinner"></div> 
            :( 
                <>
                    <form action="" onSubmit={handleSubmit}>
                        <label htmlFor="" className="upload-receipt-label">Upload image of a receipt (5MB max): </label>
                        <input type="file" onChange={handleChange} className="upload-receipt-input"/>
                        { error && <div className="error-message">{error}</div> }
                        { fileChosen && <button type="submit" className="scan-receipt-btn">Scan Receipt</button> }
                    </form>
                    <div className="receipt-scan-results">{message}</div>
                </>
            )
            }
        </div>
    )
}

export default Upload;