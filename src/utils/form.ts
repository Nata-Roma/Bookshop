import {
    IBookData,
    IBookOrder,
    IErrorFunc,
    IErrorStr,
    IFinalOrder,
    IFinalPurchase,
    IFormField,
    IFormGifts,
    IFormPayment,
    IGiftOutput,
    IOutput,
} from './interfaces';

export class Form {
    public formFields: Array<IFormField>;
    private errors: Array<IErrorStr | IErrorFunc>;
    private output: IOutput;
    public formPayment: Array<IFormPayment>;
    public formGifts: Array<IFormGifts>;
    private giftOutput: Array<IGiftOutput> = [];

    constructor(
        formFields: Array<IFormField>,
        errors: Array<IErrorStr | IErrorFunc>,
        formPayment: Array<IFormPayment>,
        formGifts: Array<IFormGifts>,
    ) {
        this.formFields = formFields;
        this.errors = errors;
        this.formPayment = formPayment;
        this.formGifts = formGifts;
        this.output = {
            name: '',
            surname: '',
            delivery: '',
            street: '',
            house: '',
            flat: '',
            payment: formPayment[0].name,
        };
    }

    clearGiftOutput() {
        this.giftOutput = this.createGiftOutput(this.formGifts);
        return this.giftOutput;
    }

    createGiftOutput(fields: Array<IFormGifts>) {
        const giftOutput = fields.map((field) => {
            const item = {
                name: field.name,
                choice: false,
            };

            return item;
        });

        return giftOutput;
    }

    getFormFields() {
        return this.formFields;
    }

    validate(name: string, value: string) {
        const found = this.errors.find((err) => err.name.toLowerCase() === name.toLowerCase());
        if (found) {
            if (found.name.toLowerCase() !== 'delivery') {
                const matched = value.match((found as IErrorStr).regex);
                return !matched ? 'The field is invalid' : '';
            }

            const check = (found as IErrorFunc).check();
            const date = new Date(value).getDate();

            return Number.isNaN(date)
                ? 'The field is invalid'
                : date < check
                ? 'The field is invalid'
                : '';
        }
    }

    validateGift() {
        const count = this.giftOutput.filter((gift) => gift.choice === true);
        return count.length > 2 ? 'The field is invalid' : '';
    }

    changeOutput(key: string, value: string) {
        this.output = {
            ...this.output,
            [key.toLowerCase()]: value,
        };
    }

    changeGiftOutput(inwards: Array<IGiftOutput>) {
        this.giftOutput = inwards.map((item) => ({ ...item }));
    }

    getErrorState() {
        let err = false;
        const keys = Object.keys(this.output);
        for (let i = 0; i < keys.length; i++) {
            const check = this.validate(keys[i], this.output[keys[i]]) === '' ? false : true;
            if (check) {
                err = check;
                break;
            }
        }

        const gift = this.validateGift() === '' ? false : true;

        return !err && !gift ? false : true;
    }

    getFinalOutput(order: Array<IBookOrder>, data: Array<IBookData>) {
        const finalPurchase = order.reduce((acc, item) => {
            const found = data.find((d) => d.id === item.id);
            const newItem = {
                id: found.id,
                author: found.author,
                title: found.title,
                price: found.price,
                qty: item.qty,
                payment: this.output.payment,
            };
            acc.push(newItem);
            return acc;
        }, [] as Array<IFinalPurchase>);

        const gifts = this.giftOutput.reduce((acc, item) => {
            if (item.choice) {
                acc.push(item.name);
            }
            return acc;
        }, [] as Array<string>);

        const finalOrder: IFinalOrder = {
            purchase: [...finalPurchase],
            gifts,
            output: { ...this.output },
        };

        return finalOrder;
    }
}

export const formFields = [
    {
        name: 'Name',
        type: 'text',
    },
    {
        name: 'Surname',
        type: 'text',
    },
    {
        name: 'Delivery',
        type: 'date',
    },
    {
        name: 'Street',
        type: 'text',
    },
    {
        name: 'House',
        type: 'text',
    },
    {
        name: 'Flat',
        type: 'text',
    },
];

export const formPayment = [
    {
        name: 'Cash',
        type: 'radio',
        checked: true,
    },
    {
        name: 'Card',
        type: 'radio',
        checked: false,
    },
];

export const formGifts = [
    {
        name: 'Pack as a gift',
        type: 'checkbox',
        id: 'pack',
    },
    {
        name: 'Add postcard',
        type: 'checkbox',
        id: 'postcard',
    },
    {
        name: 'Provide 2% discount to the next time',
        type: 'checkbox',
        id: 'discount',
    },
    {
        name: 'Branded pen or pencil',
        type: 'checkbox',
        id: 'pen',
    },
];

export const errors = [
    {
        name: 'Name',
        length: 4,
        inputType: 'string',
        regex: /^[A-Za-z]{4,30}$/g,
    },
    {
        name: 'Surname',
        length: 5,
        inputType: 'string',
        regex: /^[A-Za-z]{5,30}$/g,
    },
    {
        name: 'Delivery',
        length: 1,
        inputType: 'string',
        regex: /\d/,
        check: () => new Date().getDate() + 1,
    },
    {
        name: 'Street',
        length: 5,
        inputType: 'string',
        regex: /^[A-Za-z0-9]{5,30}$/g,
    },
    {
        name: 'House',
        length: null,
        inputType: 'number',
        regex: /^\d+$/g,
    },
    {
        name: 'Flat',
        length: 1,
        inputType: 'string',
        regex: /^[0-9-\-]{1,}$/g,
    },
    {
        name: 'Payment',
        length: null,
        inputType: 'string',
        regex: /^([Cash]+|[Card]+)$/,
    },
];
