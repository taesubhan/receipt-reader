export type ReceiptInput = {
    item: string, 
    price: number | string, 
    person: string
}

export type Fees = {
    tax: number | string,
    tip: number | string,
    fees: number | string
}