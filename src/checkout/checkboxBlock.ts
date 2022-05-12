import Control from '../control';
import { IFormGifts, IGiftOutput } from '../utils/interfaces';
import { InputCheckbox } from './inputCheckbox';

export class CheckboxBlock extends Control {
    btns: Array<InputCheckbox> = [];
    private giftData: Array<IGiftOutput>;
    private inputData: Array<IFormGifts>;
    public onChange: (giftData: Array<IGiftOutput>) => void = () => {};
    public requestGiftData: () => void = () => {};

    constructor(parentNode: HTMLElement, data: Array<IFormGifts>) {
        super(parentNode, 'div', 'input_container');
        this.inputData = data;
        const titleBlock = new Control(this.node, 'div', 'input_wrapper mb-10');
        const title = new Control(titleBlock.node, 'div', 'label', 'Gifts:');
        const openGifts = new Control(titleBlock.node, 'div', 'checkbox_open');
        const openCheckbox = new Control<HTMLInputElement>(openGifts.node, 'input', 'mr-10');
        openCheckbox.node.type = 'checkbox';
        openCheckbox.node.id = 'openCheckbox';
        openCheckbox.node.onchange = (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            if (checked) {
                this.createGiftChoices();
            } else {
                this.destrotGiftChoices();
            }
        };
        const openLabel = new Control<HTMLLabelElement>(
            openGifts.node,
            'label',
            '',
            'Choose 2 gifts: (optional)',
        );
        openLabel.node.htmlFor = 'openCheckbox';
    }

    setGiftData(giftData: Array<IGiftOutput>) {
        this.giftData = giftData;
    }

    changeState(name: string) {
        this.giftData.forEach((item) => {
            if (item.name === name) {
                item.choice = !item.choice;
            }
        });

        this.onChange(this.giftData);
    }

    createGiftChoices() {
        this.requestGiftData();
        this.btns = this.inputData.map((check) => {
            const block = new InputCheckbox(this.node, check);
            block.onChange = (name: string) => {
                this.changeState(name);
            };
            return block;
        });
    }

    destrotGiftChoices() {
        this.btns.forEach((btn) => btn.destroy());
        this.btns = [];
    }
}
