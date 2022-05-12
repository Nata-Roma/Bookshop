import Control from '../control';
import { IFormGifts } from './../utils/interfaces';

export class InputCheckbox extends Control {
    private inputData: IFormGifts;
    private input: Control<HTMLInputElement>;
    public onChange: (name: string) => void = () => {};
    private state: boolean = false;

    constructor(parentNode: HTMLElement, data: IFormGifts) {
        super(parentNode, 'div', 'checkbox_open mb-10');
        this.inputData = data;
        
        this.input = new Control<HTMLInputElement>(this.node, 'input', 'mr-10');
        const label = new Control<HTMLLabelElement>(this.node, 'label', '', data.name);
        label.node.htmlFor = data.name;
        this.input.node.id = data.name;
        this.input.node.type = data.type;
        this.input.node.onchange = (e) => {
            const current = (e.target as HTMLInputElement).checked;
            this.onChange(this.inputData.name);
        };
    }

    changeChecked(state: boolean) {
        this.input.node.checked = state;
        this.state = state;
    }

    getInput() {
        return {
            btnName: this.inputData.name,
            state: this.state,
        };
    }
}
