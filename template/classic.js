export class Classic {

    getForm(json = '') {
        return `
            <div id="dyjsform_container"></div>
            <div  id="dyjsform_footer" class=" row form-group align-items-center">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <button type="button" id="add_entity" class="form-control btn btn-primary">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>
                </div>
            </div>
                <input name="dyjsform[dyjsform_options]"
                       id="dyjsform_options"
                       value='${json.entity ? json.entity : '[]'}'>
            `;
    }

    getField(field, BSColumnWidth ) {
        return `<div class="form-group col-md-${BSColumnWidth}">
            <div class="col-md-12">${field.label}</div>
            <div class="col-md-12">
                <${field.html_element} class="form-control ${field.name}" type="${field.type}" value="${field.value}">
            </div>
        </div>`;
    }

    getDeleteButton (BSColumnWidth) {
        return `<div class="form-group col-md-${BSColumnWidth}">
        <div class="col-md-12">&nbsp;</div>
        <div class="col-md-12">
            <button type="button" class="remove_entity btn btn-danger form-control">Supprimer</button>
        </div>
    </div>`;
    }





}
