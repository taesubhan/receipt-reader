import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import axios from 'axios';
import DisplayResult from './DisplayResults.tsx';

const apiURL = import.meta.env.VITE_API_URL

type ReceiptInput = {
    item: string, 
    price: number, 
    person: string
}

type Fees = {
    tax: number,
    tip: number,
    fees: number
}

// function getReceiptInputBox(persons: Array<string>) {
    function getReceiptInputBox(item = '', price = 0, person = '', index: number, handleChange, handleDelete) {
    // const personsDropDown = persons.map((person: string, index: number) => {
    //     return <option value={person} key={index}>{person}</option>
    // })

    return (
        <div className="input-box" key={index}>
            <label htmlFor={`receipt-item-${index}`}>Menu item: </label>
            <input type="text" className="receipt-item" id={`receipt-item-${index}`} name="item" value={item} onChange={(e) => handleChange(e, index)}/>
            
            <label htmlFor={`receipt-price-${index}`}>Price: </label>
            <input type="number" className="receipt-price" id={`receipt-price-${index}`} name="price" min="0" step="0.01" placeholder="0.00" value={price} onChange={(e) => handleChange(e, index)}/>

            <label htmlFor={`receipt-person-${index}`}>Person: </label>
            <input type="text" id={`receipt-person-${index}`} name="person" value={person} onChange={(e) => handleChange(e, index)}/>
            {/* <select className="receipt-person" id="receipt-person" name="receipt_person">
                {personsDropDown}
            </select> */}

            <button type="button" onClick={() => handleDelete(index)}>Delete</button>
        </div>
    )
}

function getPersonsListInputBox(persons: Array<string>, setPersons: Dispatch<SetStateAction<string[]>>) {

    const textareaVal = persons.join('\n');

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const personsText: string = e.target.value;
        const personsArr: Array<string> = personsText.split('\n');
        setPersons(personsArr);
    }
    
    return (
        <form className="persons-list">
            <label htmlFor="persons-list">Write down persons (Return after each name): </label>
            <textarea name="persons_list" id="persons-list" value={textareaVal} onChange={(e) => handleChange(e)}></textarea>
        </form>
    )
}

export default function InputPrice() {
    const [persons, setPersons] = useState<Array<string>>([]);
    const [inputs, setInputs] = useState<Array<ReceiptInput>>([{item:'', price: 0.00, person: ''}]);
    const [allFees, setAllFees] = useState<Fees>({tax: 0, tip: 0, fees: 0});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);

    function handleAdd() {
        const newInputs = [...inputs, {item:'', price: 0.00, person: ''}];
        setInputs(newInputs);
        console.log(newInputs);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, i: number) {
        const {name, value} = e.target;
        const data = inputs.map((input, index) => {
            if (i === index) {
                return { ...input, [name as keyof ReceiptInput]: value };
            }
            return input;
        })
        setInputs(data);
    }

    function handleDelete(i: number) {
        const newInputs = [...inputs];
        newInputs.splice(i, 1)
        setInputs(newInputs);
    }

    function handleFeeChange(e: ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;
        setAllFees({...allFees, [name as keyof ReceiptInput]: Number(value)});
    }

    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        const itemsPayload = {
            items: inputs.map(({ person, ...rest }) => {
                return {...rest, person: person.split(';')} ;
            }), 
            ...allFees
        }
        
        const url = apiURL + '/receipt/calculate';
        // console.log(itemsPayload);
        try {
            setLoading(true);
            const response = await axios.post(url, itemsPayload);
            console.log(response);
            setResult(response.data);
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            {getPersonsListInputBox(persons, setPersons)}
            <form className="receipt-input" onSubmit={async (e) => handleSubmit(e)}>
                {
                    inputs.map((input, index) => {
                        return getReceiptInputBox(input.item, input.price, input.person, index, handleChange, handleDelete);
                    })
                }
                <button type="button" onClick={handleAdd}>Add Input</button>

                <div className="all-fees">
                    <label htmlFor="tax">Tax: </label>
                    <input type="number" className="tax" id="tax" name="tax" min="0" step="0.01" placeholder="0.00" value={allFees['tax']} onChange={(e) => handleFeeChange(e)}/>

                    <label htmlFor="tip">Tip: </label>
                    <input type="number" className="tip" id="tip" name="tip" min="0" step="0.01" placeholder="0.00" value={allFees['tip']} onChange={(e) => handleFeeChange(e)}/>

                    <label htmlFor="fees">Fees: </label>
                    <input type="number" className="fees" id="fees" name="fees" min="0" step="0.01" placeholder="0.00" value={allFees['fees']} onChange={(e) => handleFeeChange(e)}/>
                </div>
                <button type="submit">Submit</button>
            </form>
            <div className="price-calculation-results">
                {loading ? <p>Loading...</p> : (result && DisplayResult(result))}
            </div>
        </div>
    )
}