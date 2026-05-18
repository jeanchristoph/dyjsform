import { CACHE_VERSION } from '../../config/version.js';
const { ITemplate } = await import(`../../contract/interface/ITemplate.js?v=${CACHE_VERSION}`);

export class Classic extends ITemplate {

    _inputClass() { return 'dyjsform_field_input'; }

    getLayout(selector) {
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

    wrapRow(fieldsHtml) {
        return `<div class="dyjsform_entity">${fieldsHtml}</div>`;
    }

    wrapCell(blockHtml, field) {
        return `<div class="dyjsform_field_wrap" style="flex: ${field.flex}">
            ${blockHtml}
            <span class="djf_error">${field.error || ''}</span>
        </div>`;
    }
}
