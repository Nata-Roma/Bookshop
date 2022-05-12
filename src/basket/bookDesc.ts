import Control from '../control';
import { IBookData } from '../utils/interfaces';

export class BookDesc extends Control {
    constructor(parentNode: HTMLElement, data: IBookData) {
        super(parentNode, 'div', 'book_desc_wrapper');

        const authorBlock = new Control(this.node, 'div', 'text_wrapper');
        const authorKey = new Control(authorBlock.node, 'span', 'book_key');
        authorKey.node.textContent = 'author:';
        const authorName = new Control(authorBlock.node, 'span');
        authorName.node.textContent = data.author;

        const titleBlock = new Control(this.node, 'div', 'text_wrapper');
        const titleKey = new Control(titleBlock.node, 'span', 'book_key');
        titleKey.node.textContent = 'title:';
        const titleName = new Control(titleBlock.node, 'span', 'book_otder_title');
        titleName.node.textContent = data.title;

        const priceBlock = new Control(this.node, 'div', 'text_wrapper');
        const priceKey = new Control(priceBlock.node, 'span', 'book_key');
        priceKey.node.textContent = 'price:';
        const priceName = new Control(priceBlock.node, 'span');
        priceName.node.textContent = `${data.price}`;
    }
}
