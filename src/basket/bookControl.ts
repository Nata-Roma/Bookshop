import Control from '../control';

export class BookControl extends Control {
    public onDecrease: () => void = () => {};
    public onIncrease: () => void = () => {};
    public onRemove: () => void = () => {};
    private quantityNode: Control<HTMLElement>;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'text_wrapper');

        const BtnKey = new Control(this.node, 'span', 'book_key');
        BtnKey.node.textContent = 'qty:'
        
        const controls = new Control(this.node, 'div', 'book_control');
        
        const qtyBtns = new Control(controls.node, 'div', 'order_control_qty');
        const decBtn = new Control(qtyBtns.node, 'button', 'btn_quantity', '-');
        decBtn.node.onclick = () => {
            this.onDecrease();
        };
        this.quantityNode = new Control(qtyBtns.node, 'span', 'control_order_quantity', '0');
        const incBtn = new Control(qtyBtns.node, 'button', 'btn_quantity mr-20', '+');
        incBtn.node.onclick = () => {
            this.onIncrease();
        };

        const removeBtn = new Control(controls.node, 'button', 'book_control_item', 'Remove');
        removeBtn.node.onclick = () => {
            this.onRemove();
        };
    }

    setQuantity(num: number) {
        this.quantityNode.node.textContent = `${num}`;
    }
}
