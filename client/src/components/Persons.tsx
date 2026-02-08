import type { ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import type {Persons} from '../types/receipt.ts';
import { useState } from 'react';

type PersonsInput = {
    personsOptions: Persons,
    setPersonsOptions: Dispatch<SetStateAction<Persons>>
}

type PersonsBox = {
    personsOptions: Persons,
    deletePerson: (index: number) => void
}

function PersonsBox({personsOptions, deletePerson}: PersonsBox) {
    const personsList = personsOptions.map((person, index: number) => {
        return (
            <div className="eligible-person-for-split" key={index}>
                <p className="person-name">{person}</p>
                <button className="delete-person-btn" onClick={() => deletePerson(index)}>X</button>
            </div>
        )
    })
    return (
        <div className="persons-list">
            {personsList}
        </div>
    )
}

export default function PersonsInput({personsOptions, setPersonsOptions}: PersonsInput) {
    const [personTyped, setPersonTyped] = useState<string>('');

    function handleChangeInput(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setPersonTyped(e.target.value);
    }

    function handleSubmitPerson(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (personTyped.length === 0) return 0;
        setPersonsOptions([...personsOptions, personTyped]);
        setPersonTyped('');
    }

    function handleDeletePerson(i: number) {
        const newPersonsOptions = [...personsOptions];
        newPersonsOptions.splice(i, 1);
        setPersonsOptions(newPersonsOptions);
    }

    return (
        <div className="persons-container">
            <form action="" className="persons-submit" onSubmit={handleSubmitPerson}>
                <label htmlFor="person-name">Input names: </label>
                <input type="text" value={personTyped} onChange={handleChangeInput}/>
                <input type="submit" />
            </form>
            <PersonsBox personsOptions={personsOptions} deletePerson={handleDeletePerson}/>
        </div>
    )
}