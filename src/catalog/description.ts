import Control from '../control';

export class Description extends Control {
    public onClose: () => void = () => {};

    constructor(parentNode: HTMLElement, desc: string) {
        super(parentNode, 'div', 'desc_wrapper');

        const text = new Control(this.node, 'div', 'desc_text mb-20', desc);
        const closeBtn = new Control(this.node, 'button', 'book_control_item ml-auto', 'Close');
        closeBtn.node.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onClose();
        };
    }
}
