import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

type ReceiptInput = {
    item: string, 
    price: number, 
    person: string
}

// function getReceiptInputBox(persons: Array<string>) {
    function getReceiptInputBox(item = '', price = 0, person = '', index = 0, handleChange, handleDelete) {
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

    function handleAdd() {
        const newInputs = [...inputs, {item:'', price: 0.00, person: ''}];
        setInputs(newInputs);
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
        setInputs(newInputs.splice(i, 1));
    }

    return (
        <div className="container">
            {getPersonsListInputBox(persons, setPersons)}
            <form className="receipt-input">
                {
                    inputs.map((input, index) => {
                        return getReceiptInputBox(input.item, input.price, input.person, index, handleChange, handleDelete);
                    })
                }
                <button type="button" onClick={handleAdd}>Add Input</button>
            </form>
        </div>
    )
}