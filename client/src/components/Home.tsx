import type {ReceiptInput, Fees} from '../types/receipt.ts';
import { useState } from 'react';
import Upload from './Upload.tsx';
import InputPrice from './InputPrice.tsx';

export default function Home() {
    const [inputs, setInputs] = useState<ReceiptInput[]>([{item:'', price: '', person: ''}]);
    const [allFees, setAllFees] = useState<Fees>({tax: '', tip: '', fees: ''});

    return (
        <div className="container">
            <h1 className="title">Receipt Splitter</h1>
            {/* {getPersonsListInputBox(persons, setPersons)} */}
            <Upload setInputs={setInputs} setAllFees={setAllFees}/>
            <InputPrice inputs={inputs} setInputs={setInputs} allFees={allFees} setAllFees={setAllFees} />
        </div>
    )
}