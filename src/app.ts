import { IBookData, IBookOrder } from './utils/interfaces';
import { Checkout } from './checkout/checkout';
import { Header } from './header';
import { Order } from './basket/order';
import { Catalog } from './catalog/catalog';
import './styles.css';
import bgImage from './assets/backgroundImage.jpg';
import Control from './control';
import { errors, Form, formFields, formGifts, formPayment } from './utils/form';

class App extends Control {
    private catalog: Catalog;
    private order: Order;
    private entryData: Array<IBookData> = [];
    private header: Header;
    private parentNode: HTMLElement;
    private headerHeight: number;
    private checkout: Checkout = null;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'main_page');
        this.parentNode = parentNode;

        this.node.style.backgroundImage = `url(${bgImage})`;

        this.header = new Header(this.node);
        this.headerHeight = this.header.node.clientHeight;
        this.node.style.paddingTop = `${this.headerHeight}px`;

        this.header.showOrder = () => {
            this.node.style.paddingTop = '0';
            this.header.setLowZIndex();
            this.addNoScroll();
            this.showOrder();
        };
        this.header.addToBasket = (id: number) => {
            this.addToBasket(id);
        };

        const divider = new Control(this.node, 'hr');

        this.getCatalog();

        window.addEventListener('resize', () => this.changeContainerSize(this.node));
    }
    changeContainerSize(node: HTMLElement) {
        const box = node.getBoundingClientRect();
        this.order.changeContainerSize(box.width, window.innerHeight);
        this.checkout?.changeContainerSize(box.width, window.innerHeight);
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
            this.checkout = new Checkout(
                this.node,
                order,
                data,
                new Form(formFields, errors, formPayment, formGifts),
            );
            this.order.node.ontransitionend = () => {
                this.checkout?.show();
            };
            this.checkout.onHide = () => {
                this.checkout = null;
                this.restoreView();
            };
            this.checkout.onFinish = () => {
                this.order.clearData();
                this.header.changeQuantity(0);
                this.checkout.destroyNode();
                this.restoreView();
                this.checkout = null;
            };
        };
        this.order.onHide = () => {
            this.restoreView();
            this.order.hide();
        };
    }

    restoreView() {
        this.header.removeLowZIndex();
        this.node.style.paddingTop = `${this.headerHeight}px`;
        this.removeNoScroll();
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

    addNoScroll() {
        this.parentNode.classList.add('no_scroll');
    }

    removeNoScroll() {
        this.parentNode.classList.remove('no_scroll');
        this.changeContainerSize(this.parentNode);
    }
}

new App(document.body);
