import { IFormPayment } from './../utils/interfaces';
import Control from '../control';
import { InputRadio } from './inputRadio';

export class RadioBlock extends Control {
    btns: Array<InputRadio>;
    public onChange: (state: boolean, name: string) => void = () => {};

    constructor(parentNode: HTMLElement, data: Array<IFormPayment>) {
        super(parentNode, 'div', 'input_wrapper mb-10');
        const title = new Control(this.node, 'div', 'label', 'Payment:');
        const blockBtn = new Control(this.node, 'div', 'checkbox_open');

        this.btns = data.map((radio) => {
            const block = new InputRadio(blockBtn.node, radio);
            block.onChange = (state: boolean, name: string) => {
                this.changeRadioState(state, name);
                this.onChange(state, name);
            };
            return block;
        });
    }

    changeRadioState(state: boolean, name: string) {
        this.btns.forEach((btn) => {
            const radio = btn.getInputName();
            if (radio !== name) {
                btn.changeChecked(false);
            } else {
                btn.changeChecked(state);
            }
        });
    }
}
