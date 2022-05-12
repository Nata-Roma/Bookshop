import Control from '../control';
import { IFormPayment } from '../utils/interfaces';

export class InputRadio extends Control {
    private inputData: IFormPayment;
    private input: Control<HTMLInputElement>;
    public onChange: (state: boolean, name: string) => void = () => {};

    constructor(parentNode: HTMLElement, data: IFormPayment) {
        super(parentNode, 'div', 'input_radio');
        this.inputData = data;
        const label = new Control<HTMLLabelElement>(this.node, 'label', '', data.name);
        label.node.htmlFor = data.name;
        this.input = new Control<HTMLInputElement>(label.node, 'input', '');
        this.input.node.id = data.name;
        this.input.node.type = data.type;
        data.checked && (this.input.node.checked = data.checked);
        this.input.node.onchange = (e) => {
            const current = (e.target as HTMLInputElement).checked;
            this.onChange(current, this.inputData.name);
        };
    }

    changeChecked(state: boolean) {
        this.input.node.checked = state;
    }

    getInputName() {
        return this.inputData.name;
    }
}
