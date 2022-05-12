import { OrderBook } from './orderBook';
import Control from '../control';
import { IBookData, IBookOrder } from '../utils/interfaces';

export class Order extends Control {
    private orderBooks: Array<OrderBook> = [];
    private orderContainer: Control<HTMLElement>;
    public onChangeBook: (num: number) => void = () => {};
    private total: Control<HTMLElement>;
    private empty: Control<HTMLElement>;
    public onConfirm: (order: Array<IBookOrder>) => void = () => {};
    private confirm: Control<HTMLButtonElement>;
    public onHide: () => void = () => {};
    private wrapper: Control<HTMLElement>;
    private width: number;
    private height: number;
    private parentNode: HTMLElement;
    private open: boolean = false;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'order_layout');
        this.parentNode = parentNode;
        this.width = parentNode.scrollWidth;

        this.height = window.innerHeight;
        this.node.style.width = `${this.width}px`;
        this.node.style.height = `${this.height}px`;
        this.node.style.top = `${-this.height}px`;

        this.wrapper = new Control(this.node, 'div', 'order_wrapper');
        const wrapperBox = this.wrapper.node.getBoundingClientRect();
        if (wrapperBox.height > this.height) {
            this.node.style.alignItems = 'flex-start';
        }

        const title = new Control(this.wrapper.node, 'div', 'order_title');
        title.node.textContent = 'My Order';

        this.orderContainer = new Control(this.wrapper.node, 'div', 'order_contaner');

        const iconX = new Control(this.wrapper.node, 'div', 'order_x', 'X');
        iconX.node.onclick = () => {
            this.onHide();
        };
        this.node.onclick = (e) => {
            if (e.target === this.node) {
                this.onHide();
            }
        };

        const totalContainer = new Control(this.wrapper.node, 'div', 'order_total_wrapper');
        this.total = new Control(totalContainer.node, 'div', 'order_total', 'Total: $0');

        this.confirm = new Control<HTMLButtonElement>(
            totalContainer.node,
            'button',
            'book_control_item',
            'Confirm',
        );

        this.confirm.node.onclick = () => {
            this.hide();
            const payload = this.orderBooks.reduce((acc, book) => {
                const item = {
                    id: book.getId(),
                    qty: book.getQuantity(),
                };
                acc.push(item);
                return acc;
            }, [] as Array<IBookOrder>);
            this.onConfirm(payload);
        };

        this.addEmpty('Empty Basket');
    }

    show() {
        this.open = true;
        this.node.style.transform = `translateY(${window.scrollY + this.height}px)`;
    }

    hide() {
        this.open = false;
        this.node.style.transform = '';
    }

    setTotal() {
        const price = this.orderBooks.reduce((acc, book) => {
            acc += book.getQuantity() * book.getPrice();
            return acc;
        }, 0);

        this.total.node.textContent = `Total: $${price}`;
    }

    addBook(bookData: IBookData) {
        this.removeEmpty();
        const found = this.orderBooks.find((book) => book.getId() === bookData.id);
        if (found) {
            found.increaseBook();
            return;
        }
        const orderBook = new OrderBook(this.orderContainer.node, bookData);
        orderBook.onChangeBook = () => {
            this.onChangeBook(this.getBookQuantity());
            this.setTotal();
        };
        orderBook.onRemove = (id: number) => {
            this.removeBook(id);
            this.setTotal();

            this.onChangeBook(this.getBookQuantity());
        };
        this.orderBooks.push(orderBook);
        this.setTotal();
        this.onChangeBook(this.getBookQuantity());
    }

    addEmpty(str: string) {
        this.empty = new Control(this.orderContainer.node, 'div', 'order_empty');
        this.empty.node.textContent = str;
        this.total.node.textContent = 'Total: $0';
        this.confirm.node.classList.add('disabled');
        this.confirm.node.disabled = true;
    }

    removeEmpty() {
        this.empty?.destroy();
        this.empty = null;
        this.confirm.node.classList.remove('disabled');
        this.confirm.node.disabled = false;
    }

    removeBook(id: number) {
        let orderBook = this.orderBooks.find((book) => book.getId() === id);

        if (orderBook) {
            orderBook.destroy();
            orderBook = null;
        }

        this.orderBooks = this.orderBooks.filter((book) => book.getId() !== id);
        if (!this.orderBooks.length) {
            this.addEmpty('Empty Basket');
        }
    }

    getBookQuantity() {
        const q = this.orderBooks.reduce((acc, book) => {
            acc += book.getQuantity();
            return acc;
        }, 0);

        return q;
    }

    clearData() {
        this.orderBooks.forEach((book) => {
            book.destroy();
            book = null;
        });

        this.orderBooks = [];
        this.total.node.textContent = '';
        this.addEmpty('Empty Basket');
    }

    setLowZIndex() {
        this.wrapper.node.classList.add('order_fix');
    }

    removeLowZIndex() {
        this.wrapper.node.classList.remove('order_fix');
    }

    changeContainerSize(width: number, height: number) {
        this.width = width;
        this.node.style.width = `${this.width}px`;

        this.height = height;
        this.node.style.top = `${-height}px`;
        this.open && (this.node.style.transform = `translateY(${height}px)`);
        this.node.style.height = `${this.height}px`;
        const wrapperBox = this.wrapper.node.getBoundingClientRect();
        if (wrapperBox.height > this.height) {
            this.node.style.alignItems = 'flex-start';
        } else {
            this.node.style.alignItems = 'center';
        }
    }
}
