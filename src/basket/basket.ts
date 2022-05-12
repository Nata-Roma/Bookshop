import Control from '../control';
import image from '../assets/shopping-trolley.svg';

export class Basket extends Control {
    public onClick: () => void;
    private quantityNode: Control<HTMLElement>;
    private quantity: number = 0;
    public addByDrag: (id: number) => void;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'backet_wrapper');
        const img = new Control(this.node, 'img', 'backet_img');
        img.node.setAttribute('src', image);

        this.quantityNode = new Control(this.node, 'div', 'basket_quantity', '0');
        
        this.node.onclick = () => {
            this.onClick();
        };
        this.node.ondragover = (e: DragEvent) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            this.node.classList.add('backet_enter');
        };

        this.node.ondrop = (e: DragEvent) => {
            e.preventDefault();
            const id = JSON.parse(e.dataTransfer.getData('id'));
            this.node.classList.remove('backet_enter');
            this.addByDrag(id);
            //this.increaseQuantity();
        };
        this.node.ondragleave = (e) => {
            this.node.classList.remove('backet_enter');
        };
    }

    changeQuantity(num: number) {
        this.quantity = num;
        this.quantityNode.node.textContent = `${this.quantity}`;
    }
}
