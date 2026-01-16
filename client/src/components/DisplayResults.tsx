type Value = {
    subtotal: number, 
    tax: number, 
    tip: number, 
    fees: number
}

type Results = {
    [key: string]: Value
}

function convertToDollar(num: number) {
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return USDollar.format(num);
}

function displayUsers(results: Results) {
    const persons = [];
    for (const p in results) {
        const {subtotal, tax, tip, fees} = results[p];
        const total = subtotal + tax + tip + fees;
        persons.push(
        <li className={`${p}-detail`} key={p}>
            <div className="name">{p}</div>
            <div className="subtotal">
                <div className="detail-label">subtotal: </div>
                <div className="subtotal-value">{convertToDollar(subtotal)}</div>
            </div>
            <div className="tax">
                <div className="detail-label">tax: </div>
                <div className="tax-value">{convertToDollar(tax)}</div>
            </div>
            <div className="tip">
                <div className="detail-label">tip: </div>
                <div className="tip-value">{convertToDollar(tip)}</div>
            </div>
            <div className="fees">
                <div className="detail-label">fees: </div>
                <div className="fees-value">{convertToDollar(fees)}</div>
            </div>
            <div className="total">
                <div className="detail-label">total: </div>
                <div className="total-value">{convertToDollar(total)}</div>
            </div>
        </li>
        )
    }

    return persons;
}

export default function DisplayResult(result: Results) {

    return (
        <div className="result-display">
            <ul className="list-of-results">{displayUsers(result)}</ul>
        </div>
    )
}