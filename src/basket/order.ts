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

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'order_layout');
        const wrapper = new Control(this.node, 'div', 'order_wrapper');
        const title = new Control(wrapper.node, 'div', 'order_title');
        title.node.textContent = 'My Order';

        this.orderContainer = new Control(wrapper.node, 'div', 'order_contaner');
        

        const iconX = new Control(wrapper.node, 'div', 'order_x', 'X');
        iconX.node.onclick = () => {
            this.hide();
        };
        this.node.onclick = (e) => {
            if (e.target === this.node) {
                this.hide();
            }
        };

        const totalContainer = new Control(wrapper.node, 'div', 'order_total_wrapper');
        this.total = new Control(totalContainer.node, 'div', 'order_total', 'Total: $0');
        

        this.confirm = new Control<HTMLButtonElement>(totalContainer.node, 'button', 'book_control_item', 'Confirm');

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
        this.node.classList.add('order_show');
    }

    hide() {
        this.node.classList.remove('order_show');
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
        this.empty.destroy();
        this.confirm.node.classList.remove('disabled');
        this.confirm.node.disabled = false;
    }

    removeBook(id: number) {
        const orderBook = this.orderBooks.find((book) => book.getId() === id);

        if (orderBook) {
            orderBook.destroy();
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
        });

        this.orderBooks = [];
        this.total.node.textContent = '';
        this.addEmpty('Empty Basket');
    }
}
