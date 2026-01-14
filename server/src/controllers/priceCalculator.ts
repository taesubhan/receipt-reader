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

function getSubtotal(receipt: any): number {
    let receiptSubtotal: number = 0;
    const items = receipt?.items;
    items.forEach((item: any) => receiptSubtotal += Number(item.price));

    return receiptSubtotal;
}

function calculateIndividualSubtotal(receipt: any, priceSplit: PriceSplit): void {
    const items = receipt?.items;
    if (!items || items.length == 0) {
        throw new Error('No menu items to split');
    }

    // Calculate subtotal for each person by going through each menu item in receipt
    for (const item of items) {
        const pricePerPerson: number = item.price / item.person.length;

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
}

function calculateIndividualFees(receipt: any, priceSplit: PriceSplit): void {
    const receiptTax: number = receipt?.tax || 0;
    const receiptTip: number = receipt?.tip || 0;
    const receiptFees: number = receipt?.fees || 0;
    const receiptSubtotal = getSubtotal(receipt);

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

}

export default function getPriceSplit(req: Request, res: Response): void {
    const receipt = req.body;
    if (!receipt) {
        throw new Error('No receipt data');
    }

    const priceSplit: PriceSplit = {};
    
    calculateIndividualSubtotal(receipt, priceSplit);
    calculateIndividualFees(receipt, priceSplit);
    
    res.send(priceSplit);
}