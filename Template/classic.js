export class Classic {

    getForm(json = '') {
        return `
            <div id="dyjsform_container"></div>
            <div  id="dyjsform_footer" class=" row form-group align-items-center">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <button type="button" class="form-control btn btn-primary djf_action_add">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>
                </div>
            </div>
                <textarea rows="30" cols="150" name="dyjsform[dyjsform_options]"
                       id="dyjsform_options"
                       >${json.entity ? json.entity : '[]'}</textarea>
            `;
    }

    getField(field,rowIndex, BSColumnWidth ) {
        return `<div class="form-group col-md-${BSColumnWidth}">
            <div class="col-md-12">${field.label === '' ? '&nbsp;' : field.label}</div>
            <div class="col-md-12">
                <${field.html_element} class="form-control ${field.name} ${field.class}" type="${field.type}" 
                value="${field.value}" data-row="${rowIndex}" data-name="${field.name}">${field.content}</${field.html_element}>
            </div>
        </div>`;
    }


}