import { BookDesc } from './bookDesc';
import Control from '../control';
import { BookControl } from './bookControl';
import { IBookData } from '../utils/interfaces';

export class OrderBook extends Control {
    private bookImage: Control<HTMLElement>;
    private bookData: IBookData;
    private quantity: number = 0;
    public onRemove: (id: number) => void = () => {};
    private bookDesc: BookDesc;
    public onChangeBook: () => void = () => {};
    private controls: BookControl;

    constructor(parentNode: HTMLElement, data: IBookData) {
        super(parentNode, 'div', 'book_wrapper');
        this.bookData = data;

        this.bookImage = new Control(this.node, 'div', 'book_order_image', 'IMG');
        this.bookImage.node.draggable = true;

        const container = new Control(this.node, 'div', 'book_container');
        this.bookDesc = new BookDesc(container.node, data);

        this.controls = new BookControl(container.node);
        this.increaseBook();
        this.controls.onDecrease = () => {
            this.decreaseBook();
        }
        this.controls.onIncrease = () => {
            this.increaseBook();
        }
        this.controls.onRemove = () => {
            this.onRemove(this.bookData.id);
        }
    }

    getId() {
        return this.bookData.id;
    }

    decreaseBook() {
        if (this.quantity > 1) {
            this.quantity -= 1;
            this.controls.setQuantity(this.quantity);
            this.onChangeBook();
        }
    }

    increaseBook() {
        this.quantity += 1;
        this.controls.setQuantity(this.quantity);
        this.onChangeBook();
    }

    getQuantity() {
        return this.quantity;
    }

    getPrice() {
        return this.bookData.price;
    }

    clearData() {
        
    }
}
