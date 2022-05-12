import Control from '../control';
import { IFinalOrder } from '../utils/interfaces';

export class CheckoutFinish extends Control {
    public onClose: () => void = () => {};

    constructor(parentNode: HTMLElement, data: IFinalOrder) {
        super(parentNode, 'div', 'checkout_finish');

        const finalMessage = new Control(this.node, 'div', 'finish_message');
        let message = `<div>Dear ${data.output.name} ${data.output.surname}.</div>
        <div>The order has been created.</div>
        <div>The delivery address is ${data.output.house} ${data.output.street} street, flat ${data.output.flat}.</div>
        <div>You can find the order information below.</div>
        <div class='mb-10'></div>`;
        let order = '<div>Purchase:</div>';
        let totalPrice = 0;
        data.purchase.forEach((item, i) => {
            totalPrice += item.price * item.qty;

            order += `
            <div>${i + 1}. ${item.title} by ${item.author}.</div>
            <div>Quantity: ${item.qty}, price: ${item.price}, total price: ${
                item.price * item.qty
            }.</div>
            <div class='mb-10'></div>`;
        });
        order += `
            <div class='mb-10'></div>
            <div>Gifts:</div>
        `;

        data.gifts.forEach((gift, i) => {
            order += `
            <div>- ${gift}</div>`;
        });

        order += `
            <div class='mb-10'></div>
            <div>Total Price: ${totalPrice}</div>
        `;

        message += order;

        finalMessage.node.innerHTML = message;

        const controls = new Control(this.node, 'div', 'finish_controls');

        const confirmBtn = new Control(controls.node, 'button', 'book_control_item', 'Close');
        confirmBtn.node.onclick = () => {
            this.onClose();
        };
    }
}
