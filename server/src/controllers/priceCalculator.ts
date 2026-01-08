import type { Request, Response } from 'express';

type Totals = {
    subtotal: number,
    tax: number,
    tip: number,
    fees: number,
}

type PriceSplit = {
    [person: string]: Totals
}

export default function splitPrice(req: Request, res: Response) {
    console.log('testing price calc');
    const receipt = req.body;
    if (!receipt) {
        throw new Error('No receipt data');
    }

    const priceSplit: PriceSplit = {};
    const menuItems = receipt?.menuItems;
    if (!menuItems || menuItems.length == 0) {
        throw new Error('No menu items to split');
    }

    let receiptSubtotal: number = 0;
    const receiptTax: number = receipt?.tax || 0;
    const receiptTip: number = receipt?.tip || 0;
    const receiptFees: number = receipt?.fees || 0;

    // Calculate subtotal for each person by going through each menu item in receipt
    for (const item of menuItems) {
        const pricePerPerson: number = item.price / item.person.length;
        receiptSubtotal += item.price;

        // Calculate the cost for one menu item for each person
        for (const person of item.person) {
            if (person in priceSplit) {
                const totals = priceSplit[person];
                if (!totals) continue;
                totals.subtotal += pricePerPerson;
            } else {
                priceSplit[person] = {
                    subtotal: pricePerPerson,
                    tax: 0,
                    tip: 0,
                    fees: 0,
                }
            }
        }
    }

    if (Object.keys(priceSplit).length === 0) {
        throw new Error('Missing receipt items');
    }

    // Calculate tax, tip, fees - loop through each person
    for (const person in priceSplit) {
        const totals = priceSplit[`${person}`];
        if (!totals) continue;
        
        const priceProportion: number = totals.subtotal / receiptSubtotal;

        totals.tax = priceProportion * receiptTax;
        totals.tip = priceProportion * receiptTip;
        totals.fees = priceProportion * receiptFees;
    }

    res.send(priceSplit);
}