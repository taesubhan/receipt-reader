function getSubtotal(receipt) {
    let receiptSubtotal = 0;
    const items = receipt?.items;
    items.forEach((item) => receiptSubtotal += Number(item.price));
    return receiptSubtotal;
}
function calculateIndividualSubtotal(receipt, priceSplit) {
    const items = receipt?.items;
    if (!items || items.length == 0) {
        throw new Error('No menu items to split');
    }
    // Calculate subtotal for each person by going through each menu item in receipt
    for (const item of items) {
        const pricePerPerson = item.price / item.person.length;
        // Calculate the cost for one menu item for each person
        for (const person of item.person) {
            if (person in priceSplit) {
                const totals = priceSplit[person];
                if (!totals)
                    continue;
                totals.subtotal += pricePerPerson;
            }
            else {
                priceSplit[person] = {
                    subtotal: pricePerPerson,
                    tax: 0,
                    tip: 0,
                    fees: 0,
                };
            }
        }
    }
}
function calculateIndividualFees(receipt, priceSplit) {
    const receiptTax = receipt?.tax || 0;
    const receiptTip = receipt?.tip || 0;
    const receiptFees = receipt?.fees || 0;
    const receiptSubtotal = getSubtotal(receipt);
    if (Object.keys(priceSplit).length === 0) {
        throw new Error('Missing receipt items');
    }
    // Calculate tax, tip, fees - loop through each person
    for (const person in priceSplit) {
        const totals = priceSplit[`${person}`];
        if (!totals)
            continue;
        const priceProportion = totals.subtotal / receiptSubtotal;
        totals.tax = priceProportion * receiptTax;
        totals.tip = priceProportion * receiptTip;
        totals.fees = priceProportion * receiptFees;
    }
}
export default function getPriceSplit(req, res) {
    const receipt = req.body;
    if (!receipt) {
        throw new Error('No receipt data');
    }
    const priceSplit = {};
    calculateIndividualSubtotal(receipt, priceSplit);
    calculateIndividualFees(receipt, priceSplit);
    res.send(priceSplit);
}
//# sourceMappingURL=priceCalculator.js.map