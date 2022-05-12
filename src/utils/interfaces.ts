export interface IBookData {
    id: number;
    author: string;
    imageLink: string;
    title: string;
    price: number;
    description: string;
}

export interface IBookOrder {
    id: number;
    qty: number;
}
export interface IFormField {
    name: string;
    type: string;
}

export interface IFormPayment {
    name: string;
    type: string;
    checked: boolean;
}

export interface IErrorStr {
    name: string;
    length: number;
    inputType: string;
    regex: RegExp;
}

export interface IErrorFunc {
    name: string;
    length: number;
    inputType: string;
    regex: RegExp;
    check?: () => number;
}

export interface IOutput {
    [key: string]: string;
    name: string;
    surname: string;
    delivery: string;
    street: string;
    house: string;
    flat: string;
    payment: string
}

export interface IFinalPurchase {
    id: number;
    author: string;
    title: string;
    price: number;
    qty: number;
    payment: string
}
export interface IFinalOrder {
    purchase: Array<IFinalPurchase>;
    gifts: Array<string>
    output: IOutput
}


export interface IFormGifts {
    name: string;
    type: string;
    id: string;
}

export interface IGiftOutput {
    name: string;
    choice: boolean;
}