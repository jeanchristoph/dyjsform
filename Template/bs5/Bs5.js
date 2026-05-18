import { CACHE_VERSION } from '../../config/version.js';
const { ITemplate } = await import(`../../contract/interface/ITemplate.js?v=${CACHE_VERSION}`);

export class Bs5 extends ITemplate {

    _inputClass()    { return 'form-control'; }
    _checkboxClass() { return 'form-check-input dyjsform_checkbox'; }

    // Bs5 wraps label and widget each in a col-md-12 div
    _renderFieldBlock(field, rowIndex) {
        const labelText = (field.label != null && field.label !== '') ? field.label : '&nbsp;';
        return `<div class="col-md-12">${labelText}</div><div class="col-md-12">${this._renderWidget(field, rowIndex)}</div>`;
    }

    getLayout(selector) {
        const outputName = selector.replace('#', '');
        return `
            <div class="dyjsform_container"></div>
            <div class="dyjsform_footer row form-group align-items-center justify-content-start">
                <div class="col-2">
                    <button type="button" class="form-control btn btn-info dyjsform_action_add">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>
                </div>
            </div>
            <textarea hidden name="${outputName}[output]" class="output"></textarea>
        `;
    }

    wrapRow(fieldsHtml) {
        return `<div class="row form-group align-items-center dyjsform_entity">${fieldsHtml}</div>`;
    }

    wrapCell(blockHtml, field) {
        return `<div class="form-group col-md-${field.bsColSize}">
            ${blockHtml}
            <span class="text-danger djf_error">${field.error || ''}</span>
        </div>`;
    }
}
