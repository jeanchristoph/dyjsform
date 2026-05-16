import { CACHE_VERSION } from '../../config/version.js';
const { ITemplate } = await import(`../../contract/interface/ITemplate.js?v=${CACHE_VERSION}`);

export class Table extends ITemplate {

    getBegin() {
        return `<tr class="dyjsform_entity">`;
    }

    getEnd() {
        return `</tr>`;
    }

    getForm(selector) {
        const outputName = selector.replace('#', '');
        return `
            <table class="table table-bordered table-sm dyjsform_table">
                <tbody class="dyjsform_container"></tbody>
            </table>
            <div class="dyjsform_footer mt-1">
                <button type="button" class="btn btn-sm btn-info dyjsform_action_add">
                    <i class="fas fa-plus"></i> Ajouter
                </button>
            </div>
            <textarea hidden name="${outputName}[output]" class="output"></textarea>
        `;
    }

    getField(field, rowIndex, subField = null) {
        const width     = field.flexPercent != null ? `${field.flexPercent.toFixed(2)}%` : 'auto';
        const isAction  = field.htmlElement === 'button';
        const cellClass = isAction ? 'dyjsform_cell dyjsform_cell_action' : 'dyjsform_cell';

        if (field.name === 'num') {
            const labelText = (field.label != null && field.label !== '') ? field.label : '&nbsp;';
            return `<td style="width:${width}" class="dyjsform_cell" style="text-align:center">
                <div class="dyjsform_tbl_label">${labelText}</div>
                <span style="display:block;text-align:center;font-weight:700;padding:3px 0">${rowIndex + 1}</span>
            </td>`;
        }

        let innerHtml = this._renderFieldInner(field, rowIndex);

        if (subField) {
            innerHtml += `<div class="dyjsform_stack_divider"></div>` + this._renderFieldInner(subField, rowIndex);
        }

        return `<td style="width:${width}" class="${cellClass}">
            ${innerHtml}
            <span class="text-danger djf_error">${field.error || ''}</span>
        </td>`;
    }

    _renderFieldInner(field, rowIndex) {
        const labelText  = (field.label != null && field.label !== '') ? field.label : '&nbsp;';
        const type       = field.type ? `type="${field.type}"` : '';
        const isCheckbox = field.type === 'checkbox';
        const className  = field.className || '';
        const attr       = field.attr || '';
        const name       = !field.name.startsWith('dyjsform_action_') ? `name="dyjsform[${field.name}_${rowIndex}]"` : '';
        const fieldClass = field.name.startsWith('dyjsform_') ? field.name : 'dyjsform_field_' + field.name;

        if (isCheckbox && field.options && field.options.length > 0) {
            const checkboxes = field.options.map(option => {
                const checked = field.value === option.value ? 'checked' : '';
                const label   = option.name ? ` <span class="dyjsform_checkbox_label_text">${option.name}</span>` : '';
                return `<label class="dyjsform_checkbox_wrap">
                    <input type="checkbox" ${name} class="dyjsform_checkbox dyjsform_input ${fieldClass} ${className}" ${attr} value="${option.value}" ${checked} data-row="${rowIndex}" data-name="${field.name}">${label}
                </label>`;
            }).join('');
            return `
                <div class="dyjsform_tbl_label">${labelText}</div>
                <div class="dyjsform_checkbox_group">${checkboxes}</div>
            `;
        }

        const value = isCheckbox
            ? (field.value ? 'checked' : '')
            : field.htmlElement !== 'textarea' && field.value
                ? `value="${this._escapeHtml(field.value)}"`
                : '';
        let content = '';

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
            content = field.content || '';
        }

        const baseClass = isCheckbox ? 'dyjsform_checkbox' : 'form-control form-control-sm';
        return `
            <div class="dyjsform_tbl_label">${labelText}</div>
            <${field.htmlElement} ${name} class="${baseClass} dyjsform_input ${fieldClass} ${className}"
                ${attr} ${type} ${value} data-row="${rowIndex}" data-name="${field.name}">${content}</${field.htmlElement}>
        `;
    }

}
