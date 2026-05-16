import { CACHE_VERSION } from '../../config/version.js';
const { ITemplate } = await import(`../../contract/interface/ITemplate.js?v=${CACHE_VERSION}`);

export class Classic extends ITemplate {

    getBegin(){
        return `<div class="dyjsform_entity">`;
    }

    getEnd(){
        return `</div>`;
    }

    getForm(selector) {
        const outputName = selector.replace('#', '');
        return `
            <div class="dyjsform_container"></div>
            <div class="dyjsform_footer">
                <button type="button" class="dyjsform_btn dyjsform_action_add">
                    <i class="fas fa-plus"></i> Ajouter
                </button>
            </div>
            <textarea hidden name="${outputName}[output]" class="output"></textarea>
        `;
    }

    getField(field, rowIndex) {
        const type       = field.type ? `type="${field.type}"` : '';
        const isCheckbox = field.type === 'checkbox';
        const className  = field.className ? `${field.className}` : '';
        const attr       = field.attr ? `${field.attr}` : '';
        const name       = !field.name.startsWith('dyjsform_action_') ? `name="dyjsform[${field.name}_${rowIndex}]"` : '';
        const flex       = field.flex || 1;
        const fieldClass = field.name.startsWith('dyjsform_') ? field.name : 'dyjsform_field_' + field.name;

        if (isCheckbox && field.options && field.options.length > 0) {
            const checkboxes = field.options.map(option => {
                const checked = field.value === option.value ? 'checked' : '';
                const label   = option.name ? ` <span class="dyjsform_checkbox_label_text">${option.name}</span>` : '';
                return `<label class="dyjsform_checkbox_wrap">
                    <input type="checkbox" ${name} class="dyjsform_checkbox dyjsform_input ${fieldClass} ${className}" ${attr} value="${option.value}" ${checked} data-row="${rowIndex}" data-name="${field.name}">${label}
                </label>`;
            }).join('');
            return `<div class="dyjsform_field_wrap" style="flex: ${flex}">
                <div class="dyjsform_label">${field.label === '' ? '&nbsp;' : field.label}</div>
                <div class="dyjsform_input_container dyjsform_checkbox_group">
                    ${checkboxes}
                    <span class="djf_error">${field.error}</span>
                </div>
            </div>`;
        }

        const value      = isCheckbox
            ? (field.value ? 'checked' : '')
            : field.htmlElement !== 'textarea' && field.value
                ? `value="${this._escapeHtml(field.value)}"`
                : '';
        let content      = '';
        const inputClass = isCheckbox ? 'dyjsform_checkbox' : 'dyjsform_field_input';

        if (field.htmlElement === 'select' && field.options) {
            content += field.placeholder
                ? `<option value="">${field.placeholder}</option>`
                : `<option></option>`;
            field.options.forEach(option => {
                const selected = field.value === option.value ? 'selected' : '';
                content += `<option ${selected} value="${option.value}">${option.name}</option>`;
            });
        } else if (field.htmlElement === 'textarea') {
            content = field.value ? `${this._escapeHtml(field.value)}` : '';
        } else {
            content = field.content ? `${field.content}` : '';
        }

        return `<div class="dyjsform_field_wrap" style="flex: ${flex}">
            <div class="dyjsform_label">${field.label === '' ? '&nbsp;' : field.label}</div>
            <div class="dyjsform_input_container">
                <${field.htmlElement} ${name} class="${inputClass} dyjsform_input ${fieldClass} ${className}"
                    ${attr} ${type} ${value} data-row="${rowIndex}" data-name="${field.name}">${content}</${field.htmlElement}>
                <span class="djf_error">${field.error}</span>
            </div>
        </div>`;
    }

}
