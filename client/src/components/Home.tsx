import type {ReceiptInput, Fees, Persons} from '../types/receipt.ts';
import { useState } from 'react';
import Upload from './Upload.tsx';
import InputPrice from './InputPrice.tsx';
import  PersonsInput from './Persons.tsx';

export default function Home() {
    const [inputs, setInputs] = useState<ReceiptInput[]>([{item:'', price: '', person: []}]);
    const [allFees, setAllFees] = useState<Fees>({tax: '', tip: '', fees: ''});
    const [personsOptions, setPersonsOptions] = useState<Persons>([]);

    return (
        <div className="container">
            <h1 className="title">Receipt Splitter</h1>
            {/* {getPersonsListInputBox(persons, setPersons)} */}
            <Upload setInputs={setInputs} setAllFees={setAllFees} />
            <PersonsInput personsOptions={personsOptions} setPersonsOptions={setPersonsOptions} />
            <InputPrice inputs={inputs} setInputs={setInputs} allFees={allFees} setAllFees={setAllFees} personsOptions={personsOptions} />
        </div>
    )
}