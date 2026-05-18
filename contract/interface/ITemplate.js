export class ITemplate {

    // Abstract — must be implemented by each template
    getLayout(selector)         { throw new Error('getLayout() must be implemented'); }
    wrapRow(fieldsHtml)         { throw new Error('wrapRow() must be implemented'); }
    wrapCell(blockHtml, field)  { throw new Error('wrapCell() must be implemented'); }

    // Hooks — override in templates to provide framework-specific CSS classes
    _labelClass()    { return 'dyjsform_label'; }
    _inputClass()    { return ''; }
    _checkboxClass() { return 'dyjsform_checkbox'; }

    // Shared: renders label + widget block for a field
    _renderFieldBlock(field, rowIndex) {
        const labelText = (field.label != null && field.label !== '') ? field.label : '&nbsp;';
        return `<div class="${this._labelClass()}">${labelText}</div>${this._renderWidget(field, rowIndex)}`;
    }

    // Shared: renders the widget element(s) only (no label, no error)
    _renderWidget(field, rowIndex) {
        const type       = field.type ? `type="${field.type}"` : '';
        const isCheckbox = field.type === 'checkbox';
        const className  = field.className || '';
        const attr       = field.attr || '';
        const name       = !field.name.startsWith('dyjsform_action_') ? `name="dyjsform[${field.name}_${rowIndex}]"` : '';
        const fieldClass = field.name.startsWith('dyjsform_') ? field.name : `dyjsform_field_${field.name}`;

        if (isCheckbox && field.options && field.options.length > 0) {
            const checkboxes = field.options.map(option => {
                const checked = field.value === option.value ? 'checked' : '';
                const label   = option.name ? ` <span class="dyjsform_checkbox_label_text">${option.name}</span>` : '';
                return `<label class="dyjsform_checkbox_wrap"><input type="checkbox" ${name} class="${this._checkboxClass()} dyjsform_input ${fieldClass} ${className}" ${attr} value="${option.value}" ${checked} data-row="${rowIndex}" data-name="${field.name}">${label}</label>`;
            }).join('');
            return `<div class="dyjsform_checkbox_group">${checkboxes}</div>`;
        }

        const value = isCheckbox
            ? (field.value ? 'checked' : '')
            : field.htmlElement !== 'textarea' && field.value
                ? `value="${this._escapeHtml(field.value)}"`
                : '';

        let content = '';
        if (field.htmlElement === 'select' && field.options) {
            content += field.placeholder ? `<option value="">${field.placeholder}</option>` : `<option></option>`;
            field.options.forEach(option => {
                const selected = field.value === option.value ? 'selected' : '';
                content += `<option ${selected} value="${option.value}">${option.name}</option>`;
            });
        } else if (field.htmlElement === 'textarea') {
            content = field.value ? this._escapeHtml(field.value) : '';
        } else {
            content = field.content || '';
        }

        const baseClass = isCheckbox ? this._checkboxClass() : this._inputClass();
        return `<${field.htmlElement} ${name} class="${baseClass} dyjsform_input ${fieldClass} ${className}" ${attr} ${type} ${value} data-row="${rowIndex}" data-name="${field.name}">${content}</${field.htmlElement}>`;
    }

    _escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

}