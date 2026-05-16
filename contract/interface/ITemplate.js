export class ITemplate {

    getBegin()                          { throw new Error('getBegin() must be implemented'); }
    getEnd()                            { throw new Error('getEnd() must be implemented'); }
    getForm(selector)                   { throw new Error('getForm() must be implemented'); }
    getField(field, rowIndex, subField) { throw new Error('getField() must be implemented'); }

    _escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

}
