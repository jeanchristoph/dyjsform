import { CACHE_VERSION } from '../config/version.js';

export default class TemplateService {
    constructor() {
        this._templateName = 'Classic';
        this._template = null;
    }

    get templateName() {
        return this._templateName;
    }

    set templateName(value) {
        value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        this._templateName = value;
    }

    get template() {
        return this._template;
    }

    set template(value) {
        this._template = value;
    }

    async loadTemplate() {
        const module = await import(`../template/${this._templateName.toLowerCase()}/${this._templateName}.js?v=${CACHE_VERSION}`);
        this._template = new module[this._templateName]();
        return this._template;
    }

    renderForm(selector) {
        const oldEl = document.querySelector(selector);
        const wrapper = document.createElement('div');
        wrapper.id = selector.replace('#', '');
        wrapper.innerHTML = this._template.getLayout(selector);
        oldEl.parentNode.replaceChild(wrapper, oldEl);
        return this;
    }

    renderRow(selector, entity, json) {
        const containerContent = document.querySelector(selector + ' .dyjsform_container').innerHTML;
        let HtmlForm = containerContent;

        json.forEach((row, rowIndex) => {
            HtmlForm += this._template.wrapRow(this.fieldRender(row, rowIndex));
        });

        document.querySelector(selector + ' .dyjsform_container').innerHTML = HtmlForm;
        return this;
    }

    assignBootstrapCols(fields) {
        const flexValues = fields.map(e => e.flex || 1);
        const totalFlex  = flexValues.reduce((sum, f) => sum + f, 0);
        const exactCols  = flexValues.map(f => (f / totalFlex) * 12);
        let cols         = exactCols.map(c => Math.floor(c));
        const decimals   = exactCols.map((exact, i) => ({ index: i, decimal: exact - cols[i] }));
        let remaining    = 12 - cols.reduce((sum, c) => sum + c, 0);

        decimals.sort((a, b) => b.decimal - a.decimal);
        for (let i = 0; i < remaining; i++) cols[decimals[i].index]++;

        fields.forEach((e, i) => {
            e.bsColSize   = cols[i];
            e.flexPercent = (flexValues[i] / totalFlex) * 100;
        });
        return fields;
    }

    fieldRender(row, rowIndex) {
        const template    = this._template;
        const mainFields  = row.filter(f => !f.stackWith);
        const stackFields = row.filter(f =>  f.stackWith);
        this.assignBootstrapCols(mainFields);
        let html = '';
        for (const field of mainFields) {
            const subField = stackFields.find(f => f.stackWith === field.name) || null;
            let blockHtml  = template._renderFieldBlock(field, rowIndex);
            if (subField) {
                blockHtml += `<div class="dyjsform_stack_divider"></div>${template._renderFieldBlock(subField, rowIndex)}`;
            }
            html += template.wrapCell(blockHtml, field);
        }
        return html;
    }

    injectCSS() {
        if (document.querySelector(`link[data-dyjsform-stylesheet="${this._templateName}"]`)) {
            return this;
        }
        const cssUrl = new URL(`../template/${this._templateName.toLowerCase()}/${this._templateName}.css?v=${CACHE_VERSION}`, import.meta.url).href;
        const link   = document.createElement('link');
        link.rel     = 'stylesheet';
        link.href    = cssUrl;
        link.setAttribute('data-dyjsform-stylesheet', this._templateName);
        document.head.appendChild(link);
        return this;
    }
}