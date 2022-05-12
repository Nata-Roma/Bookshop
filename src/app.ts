import { IBookData, IBookOrder } from './utils/interfaces';
import { Checkout } from './checkout/checkout';
import { Header } from './header';
import { Order } from './basket/order';
import { Catalog } from './catalog/catalog';
import './styles.css';
import bgImage from './assets/backgroundImage.jpg'
import Control from './control';
import { errors, Form, formFields, formGifts, formPayment } from './utils/form';

class App extends Control {
    private catalog: Catalog;
    private order: Order;
    private entryData: Array<IBookData> = [];
    private header: Header;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'main_page');
        this.node.style.backgroundImage = `url(${bgImage})`;

        this.header = new Header(this.node);
        this.header.showOrder = () => {
            this.showOrder();
        };
        this.header.addToBasket = (id: number) => {
            this.addToBasket(id);
        };

        const divider = new Control(this.node, 'hr');

        this.getCatalog();
    }

    async getCatalog() {
        const res = await fetch('./public/catalog.json');
        const data = (await res.json()) as Array<IBookData>;
        this.entryData = data;

        this.catalog = new Catalog(this.node, data);
        this.catalog.chooseBook = (id: number) => {
            this.addToBasket(id);
        };

        this.order = new Order(this.node);
        this.order.onChangeBook = (num: number) => {
            this.header.changeQuantity(num);
        };
        this.order.onConfirm = (order: Array<IBookOrder>) => {
            const checkout = new Checkout(
                this.node,
                order,
                data,
                new Form(formFields, errors, formPayment, formGifts),
            );
            this.order.node.ontransitionend = () => {
                checkout.show();
            };
            checkout.onFinish = () => {
                this.order.clearData();
                this.header.changeQuantity(0);
                checkout.destroyNode();
            };
        };
    }

    showOrder() {
        this.order.show();
    }

    addToBasket(id: number) {
        const found = this.entryData.find((book) => book.id === id);
        if (found) {
            this.order.addBook(found);
        }
    }
}

new App(document.body);
