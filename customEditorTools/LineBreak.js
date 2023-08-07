export default class LineBreak {
    static get toolbox() {
        return {
            title: "Break",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g><path style="stroke: none;" d="M4,20c0,1.1,0.89,2,1.99,2H18c1.1,0,2-0.9,2-2v-3H4L4,20z"/><path style="stroke: none;" d="M19.41,7.41l-4.83-4.83C14.21,2.21,13.7,2,13.17,2H6C4.9,2,4.01,2.89,4.01,3.99l0,7.01H20V8.83 C20,8.3,19.79,7.79,19.41,7.41z M13,8V3.5L18.5,9H14C13.45,9,13,8.55,13,8z"/><path style="stroke: none;" d="M15,14L15,14c0-0.55-0.45-1-1-1h-4c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h4C14.55,15,15,14.55,15,14z"/><path style="stroke: none;" d="M17,14L17,14c0,0.55,0.45,1,1,1h4c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-4C17.45,13,17,13.45,17,14z"/><path style="stroke: none;" d="M6,13H2c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h4c0.55,0,1-0.45,1-1v0C7,13.45,6.55,13,6,13z"/></g></g></svg>',
        };
    }

    constructor({ config, }) {
        this.wrapper = undefined;
        this.config = config || {};
    }

    render() {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("simple-image");
        this._createImage()

        return this.wrapper;
    }

    static get isReadOnlySupported() {
        return true;
    }


    _createImage() {
        const iframe = document.createElement('div');
        iframe.style.width = '100%';
        iframe.style.border = '1px dashed var(--big_button_border)';
        iframe.style.margin = '20px 0'
        this.wrapper.appendChild(iframe)
    }

    save() {
        return
    }



}