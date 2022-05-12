import { BookControl } from './bookControl';
import { BookDesc } from './bookDesc';
import Control from '../control';
import { IBookData } from '../utils/interfaces';

export class Book extends Control {
    private bookImage: Control<HTMLElement>;
    private bookData: IBookData;
    public chooseBook: (id: number) => void;
    bookDesc: BookDesc;

    constructor(parentNode: HTMLElement, data: IBookData) {
        super(parentNode, 'div', 'book_wrapper');
        this.bookData = data;

        this.bookImage = new Control(this.node, 'div', 'book_image', 'IMG');
        this.bookImage.node.draggable = true;

        const container = new Control(this.node, 'div', 'book_container');

        this.bookDesc = new BookDesc(container.node, data);
        const controls = new BookControl(container.node, data);
        controls.chooseBook = (id:number) => {
            this.chooseBook(id);
        }



        this.bookImage.node.ondragstart = (e: DragEvent) => {
            e.dataTransfer.setData('id', JSON.stringify(this.bookData.id));
            e.dataTransfer.effectAllowed = 'copy';
        };
        this.bookImage.node.ondragenter = (e) => {
            this.bookImage.node.classList.add('book_drag_enter');
        };

        this.bookImage.node.ondragleave = (e) => {
            this.bookImage.node.classList.remove('book_drag_enter');
        };
    }

    getId() {
        return this.bookData.id;
    }
}
