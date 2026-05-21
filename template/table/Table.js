import { CACHE_VERSION } from '../../config/version.js';
const { ITemplate } = await import(`../../contract/interface/ITemplate.js?v=${CACHE_VERSION}`);

export class Table extends ITemplate {

    _labelClass() { return 'dyjsform_tbl_label'; }
    _inputClass() { return 'form-control form-control-sm'; }

    // BUSINESS_RULE: le champ 'num' affiche le numéro de ligne — rowIndex est nécessaire ici
    _renderFieldBlock(field, rowIndex) {
        if (field.name === 'num') {
            const labelText = (field.label != null && field.label !== '') ? field.label : '&nbsp;';
            return `<div class="${this._labelClass()}">${labelText}</div><span style="display:block;text-align:center;font-weight:700;padding:3px 0">${rowIndex + 1}</span>`;
        }
        return super._renderFieldBlock(field, rowIndex);
    }

    getLayout(selector) {
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

    wrapRow(fieldsHtml) {
        return `<tr class="dyjsform_entity">${fieldsHtml}</tr>`;
    }

    wrapCell(blockHtml, field) {
        const width = field.flexPercent != null ? `${field.flexPercent.toFixed(2)}%` : 'auto';
        if (field.name === 'num') {
            return `<td style="width:${width}" class="dyjsform_cell" style="text-align:center">${blockHtml}</td>`;
        }
        const cellClass = field.htmlElement === 'button' ? 'dyjsform_cell dyjsform_cell_action' : 'dyjsform_cell';
        return `<td style="width:${width}" class="${cellClass}">
            ${blockHtml}
            <span class="text-danger djf_error">${field.error || ''}</span>
        </td>`;
    }
}
