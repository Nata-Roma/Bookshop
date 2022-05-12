import Control from '../control';
import { IFormField } from '../utils/interfaces';

export class InputBlock extends Control {
    private error: Control<HTMLElement>;
    public onChange: (value: string) => void = () => {};

    constructor(parentNode: HTMLElement, data: IFormField) {
        super(parentNode, 'div', 'input_container');

        const wrapperInput = new Control(this.node, 'div', 'input_wrapper');
        const label = new Control(wrapperInput.node, 'label', 'label', `${data.name}:`);
        const field = new Control<HTMLInputElement>(wrapperInput.node, 'input', 'input');
        field.node.setAttribute('type', data.type);
        field.node.setAttribute('value', '');
        field.node.oninput = (e) => {
            this.onChange((e.target as HTMLInputElement).value)
        };
        const wrapperError = new Control(this.node, 'div', 'input_wrapper');
        const noLabel = new Control(wrapperError.node, 'div', 'label');
        this.error = new Control(wrapperError.node, 'div', 'input_error');
    }

    setError(err: string) {
        this.error.node.textContent = err;
    }
}
