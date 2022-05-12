import { Description } from './description';
import Control from '../control';
import { IBookData } from '../utils/interfaces';

export class BookControl extends Control {
    chooseBook: (id: number) => void = () => {};
    private showDesc: Control<HTMLButtonElement>;

    constructor(parentNode: HTMLElement, data: IBookData) {
        super(parentNode, 'div', 'text_wrapper');

        const addBtnKey = new Control(this.node, 'span', 'book_key');
        const controls = new Control(this.node, 'div', 'book_control');
        this.showDesc = new Control<HTMLButtonElement>(controls.node, 'button', 'book_control_item', 'Description');
        this.showDesc.node.onclick = () => {
            this.createDesc(data.description);
        };

        const addBtn = new Control(controls.node, 'button', 'book_control_item', 'Add to basket');
        addBtn.node.onclick = () => {
            this.chooseBook(data.id);
        };
    }

    createDesc(text: string) {
        const desc = new Description(this.showDesc.node, text);
        desc.onClose = () => {
            desc.destroy();
        };
    }
}
