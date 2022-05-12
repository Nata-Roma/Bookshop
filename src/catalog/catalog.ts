import { Book } from './book';
import Control from '../control';
import { IBookData } from '../utils/interfaces';

export class Catalog extends Control {
    private catalog: Array<Book>;
    public chooseBook: (id: number) => void;

    constructor(parentNode: HTMLElement, data: Array<IBookData>) {
        super(parentNode, 'div', 'catalog_wrapper');

        this.catalog = data.map((d) => {
            const book = new Book(this.node, d);
            book.chooseBook = (id: number) => {
                this.chooseBook(id);
            };
            return book;
        });
    }

    removeBook(id: number) {
        const found = this.catalog.find((book) => book.getId() === id);
        found.destroy();

        this.catalog = this.catalog.filter((book) => book.getId() !== id);
    }
}
