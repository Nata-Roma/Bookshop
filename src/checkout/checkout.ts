import { CheckoutFinish } from './checkoutFinish';
import { CheckboxBlock } from './checkboxBlock';
import { RadioBlock } from './radioBlock';
import { InputBlock } from './inputBlock';
import { Form } from '../utils/form';
import Control from '../control';
import { IBookData, IBookOrder, IFormGifts, IGiftOutput } from '../utils/interfaces';

export class Checkout extends Control {
    private form: Form;
    private fields: Array<Control> = [];
    private confirmBtn: Control<HTMLElement>;
    private radioBlock: RadioBlock;
    private checkBoxBlock: CheckboxBlock;
    private finish: CheckoutFinish = null;
    public onFinish: () => void = () => {};
    public onHide: () => void = () => {};
    private width: number;
    private height: number;
    private parentNode: HTMLElement;

    constructor(
        parentNode: HTMLElement,
        order: Array<IBookOrder>,
        data: Array<IBookData>,
        form: Form,
    ) {
        super(parentNode, 'div', 'checkout_layout');
        this.form = form;
        this.parentNode = parentNode;
        this.width = parentNode.scrollWidth;

        this.height = window.innerHeight;
        this.node.style.width = `${this.width}px`;
        this.node.style.height = `${this.height}px`;
        this.node.style.left = `${-this.width}px`;
        this.node.style.top = `${window.scrollY}px`;

        const wrapper = new Control(this.node, 'div', 'checkout_wrapper');
        const title = new Control(wrapper.node, 'div', 'order_title');
        title.node.textContent = 'Checkout';

        const formContainer = new Control(wrapper.node, 'div', 'order_contaner');
        this.form.formFields.forEach((field) => {
            const newField = new InputBlock(formContainer.node, field);
            newField.onChange = (value: string) => {
                form.changeOutput(field.name, value);
                newField.setError(this.form.validate(field.name, value));
                this.setDisabled();
            };
            this.fields.push(newField);
        });

        this.radioBlock = new RadioBlock(formContainer.node, form.formPayment);
        this.radioBlock.onChange = (state: boolean, name: string) => {
            form.changeOutput('payment', name);
        };

        this.checkBoxBlock = new CheckboxBlock(formContainer.node, form.formGifts);
        this.checkBoxBlock.onChange = (giftData: Array<IGiftOutput>) => {
            form.changeGiftOutput(giftData);
            this.setDisabled();
        };
        this.checkBoxBlock.requestGiftData = () => {
            this.getNewGiftOutput();
        };

        const iconX = new Control(wrapper.node, 'div', 'order_x', 'X');
        iconX.node.onclick = () => {
            this.destroyNode();
        };
        this.node.onclick = (e) => {
            if (e.target === this.node) {
                this.finish ? this.onFinish() : this.destroyNode();
            }
        };

        const controls = new Control(wrapper.node, 'div', 'checkout_controls');

        this.confirmBtn = new Control(
            controls.node,
            'button',
            'checkout_control_item disabled',
            'Confirm',
        );
        this.confirmBtn.node.setAttribute('disabled', 'true');
        this.confirmBtn.node.onclick = () => {
            this.finish = new CheckoutFinish(wrapper.node, form.getFinalOutput(order, data));
            this.finish.onClose = () => {
                this.onFinish();
            };
        };

        const cancelBtn = new Control<HTMLButtonElement>(
            controls.node,
            'button',
            'checkout_control_item',
            'Cancel',
        );
        cancelBtn.node.onclick = () => {
            this.destroyNode();
        };
    }

    show() {
        this.node.style.top = `${window.scrollY}px)`;
        this.node.style.transform = `translateX(${this.width}px)`;
        this.changeContainerSize(this.parentNode.getBoundingClientRect().width);
    }

    hide() {
        this.changeContainerSize(this.parentNode.getBoundingClientRect().width);
        this.node.style.transform = '';
    }

    destroyNode() {
        this.hide();
        this.onHide();
        this.node.ontransitionend = () => {
            if (this.finish) {
                this.finish.destroy();
                this.finish = null;
            }
            this.destroy();
        };
    }

    setDisabled() {
        const state = this.form.getErrorState();
        if (!state) {
            this.confirmBtn.node.removeAttribute('disabled');
            this.confirmBtn.node.classList.remove('disabled');
        } else {
            this.confirmBtn.node.setAttribute('disabled', 'true');
            this.confirmBtn.node.classList.add('disabled');
        }
    }

    getNewGiftOutput() {
        this.checkBoxBlock.setGiftData(this.form.clearGiftOutput());
    }

    changeContainerSize(width: number) {
        this.width = width;
        this.node.style.width = `${this.width}px`;
        this.node.style.left = `${-width}px`;
        this.node.style.transform = `translateX(${width}px)`;
    }
}
