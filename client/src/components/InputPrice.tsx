import type { ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import type {ReceiptInput, Fees, Persons} from '../types/receipt.ts';
import { useState } from 'react';
import axios from 'axios';
import DisplayResult from './DisplayResults.tsx';
import trashIcon from '../assets/trash-can.svg';

const apiURL = import.meta.env.VITE_API_URL

type Props = {
    inputs: ReceiptInput[],
    setInputs: Dispatch<SetStateAction<ReceiptInput[]>>,
    allFees: Fees,
    setAllFees: Dispatch<SetStateAction<Fees>>,
    personsOptions: Persons
};

type PersonsCheckbox = {
    personsOptions: Persons, 
    selectedPersons: Persons,
    toggleOption: HandleChangePersons,
    inputIndex: number
};

type ReceiptInputBoxProps = {
    input: ReceiptInput;
    index: number;
    personsOptions: Persons;
    onChange: HandleChange;
    onDelete: HandleDelete;
    onChangePersons: HandleChangePersons;
  };

type HandleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, i: number) => void;
type HandleDelete = (i: number) => void;
type HandleChangePersons = (personOption: string, i: number) => void;

function PersonsCheckbox({personsOptions, selectedPersons, toggleOption, inputIndex}: PersonsCheckbox) {
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);

    function handleToggle() {
        setDropDownOpen((prev) => !prev);
    }

    function dropDownText() {
        if (!dropDownOpen && selectedPersons.length > 0) {
            return selectedPersons.join(', ')
        } else if (!dropDownOpen) {
            return 'Select Options'
        } else if (personsOptions.length === 0) {
            return 'No options'
        } else {
            return ''
        }
    }

    return (
        <div className="name-dropdown">
            <button className="toggle-name-dropdown" onClick={handleToggle}>
                {dropDownOpen ? '^' : '⌄'}
            </button>
            {dropDownText()}

            {
                dropDownOpen && 
                <div>
                    {personsOptions.map((person, index) => (
                        <label key={person + index} style={{ display: "block" }}>
                        <input
                            type="checkbox"
                            checked={selectedPersons.includes(person)}
                            onChange={() => toggleOption(person, inputIndex)}
                        />
                        {person}
                        </label>
                    ))}
                </div>
            }
            
        </div>
    )
}

// Area where users input item, price and person paying
function ReceiptInputBox({input, index, personsOptions, onChange, onDelete, onChangePersons}: ReceiptInputBoxProps) {
    const {item, price, person} = input

    return (
        <div className="input-box" key={index}>
            <div className="item-description-price-input input-top-half">
                <label htmlFor={`receipt-item-${index}`} className="receipt-item-label">Menu item: </label>
                <input type="text" className="receipt-item" id={`receipt-item-${index}`} name="item" value={item} onChange={(e) => onChange(e, index)}/>
                
                <label htmlFor={`receipt-price-${index}`} className="receipt-price-label">Price: </label>
                <input type="number" className="receipt-price" id={`receipt-price-${index}`} name="price" min="0" step="0.01" placeholder="0.00" value={price} onChange={(e) => onChange(e, index)}/>
            </div>

            <div className="input-bottom-half">
                <PersonsCheckbox personsOptions={personsOptions} selectedPersons={person} toggleOption={onChangePersons} inputIndex={index} />
                
                <button type="button" className="delete-input-btn" onClick={() => onDelete(index)}>
                    <img className="trash-icon" src={trashIcon} alt="" />
                </button>
            </div>
        </div>
    )
}

// Users input receipt items, price, and person paying
export default function InputPrice({inputs, setInputs, allFees, setAllFees, personsOptions}: Props) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);

    function handleAddItem() {
        const newInputs = [...inputs, {item:'', price: '', person: []}];
        setInputs(newInputs);
    }

    function handleChangeItem(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, i: number) {
        const {name, value} = e.target;
        const data = inputs.map((input, index) => {
            if (i === index) {
                return { ...input, [name as keyof ReceiptInput]: value };
            }
            return input;
        })
        setInputs(data);
    }

    function handleChangePersons(personOption: string, i: number) {

        setInputs((prev) => {
            return prev.map((input, index) => {
                if (index === i) {
                    const newPerson = input.person.includes(personOption)
                        ? input.person.filter((p) => p !== personOption)
                        : [...input.person, personOption]
                    return {
                        ...input,
                        person: newPerson
                    }
                } else {
                    return input
                }
            })
        })
    }

    function handleDeleteItem(i: number) {
        const newInputs = [...inputs];
        newInputs.splice(i, 1)
        setInputs(newInputs);
    }

    function handleChangeFees(e: ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;
        setAllFees({...allFees, [name as keyof ReceiptInput]: value});
    }

    async function handleSubmitItems(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const itemsPayload = {
            items: inputs.map(({ person, ...rest }) => {
                return {...rest, person: person} ;
            }), 
            ...allFees
        }
        
        const url = apiURL + '/receipt/calculate';
        try {
            setLoading(true);
            const response = await axios.post(url, itemsPayload);
            setResult(response.data);
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="input-container">
            <form className="receipt-input" onSubmit={async (e) => handleSubmitItems(e)}>
                {
                    inputs.map((input, index) => (
                        <ReceiptInputBox key={index} input={input} index={index} personsOptions={personsOptions} onChange={handleChangeItem} onDelete={handleDeleteItem} onChangePersons={handleChangePersons} />
                    ))

                }
                <button type="button" onClick={handleAddItem} className="add-item-btn">+ Add Item</button>

                <div className="all-fees">
                    <label htmlFor="tax" className="fee-label">Tax: </label>
                    <input type="number" className="tax" id="tax" name="tax" min="0" step="0.01" placeholder="0.00" value={allFees['tax']} onChange={(e) => handleChangeFees(e)}/>

                    <label htmlFor="tip" className="fee-label">Tip: </label>
                    <input type="number" className="tip" id="tip" name="tip" min="0" step="0.01" placeholder="0.00" value={allFees['tip']} onChange={(e) => handleChangeFees(e)}/>

                    <label htmlFor="fees" className="fee-label">Fees: </label>
                    <input type="number" className="fees" id="fees" name="fees" min="0" step="0.01" placeholder="0.00" value={allFees['fees']} onChange={(e) => handleChangeFees(e)}/>
                </div>
                <button type="submit" className="calculate-btn">Calculate Price Split</button>
            </form>
            <div className="price-calculation-results">
                {loading ? <div className="loading-spinner"></div> : (result && DisplayResult(result))}
            </div>
        </div>
    )
}



/* May use later */
// function getPersonsListInputBox(persons: Array<string>, setPersons: Dispatch<SetStateAction<string[]>>) {

//     const textareaVal = persons.join('\n');

//     function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
//         const personsText: string = e.target.value;
//         const personsArr: Array<string> = personsText.split('\n');
//         setPersons(personsArr);
//     }
    
//     return (
//         <form className="persons-list">
//             <label htmlFor="persons-list">Write down persons (Return after each name): </label>
//             <textarea name="persons_list" id="persons-list" value={textareaVal} onChange={(e) => handleChange(e)}></textarea>
//         </form>
//     )
// }