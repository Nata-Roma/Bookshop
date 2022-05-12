import { Basket } from './basket/basket';
import Control from './control';

export class Header extends Control {
    private basket: Basket;
    public showOrder: () => void = () => {};
    public addToBasket: (id: number) => void = () => {};

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'header_wrapper');
        const logo = new Control(this.node, 'div', 'header_logo');
        logo.node.textContent = 'BS';

        const title = new Control(this.node, 'div', 'header_title');
        title.node.textContent = 'Book Shop';

        this.basket = new Basket(this.node);
        this.basket.onClick = () => {
            this.showOrder();
        };
        this.basket.addByDrag = (id: number) => {
            this.addToBasket(id);
        };

    }

    changeQuantity(num: number) {
        this.basket.changeQuantity(num);
    }

    setLowZIndex() {
        this.node.classList.add('z-1')
    }

    removeLowZIndex() {
        this.node.classList.remove('z-1')
    }
}
