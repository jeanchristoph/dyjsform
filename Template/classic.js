export class Classic {

    getForm() {
        return `
            <div id="dyjsform_container"></div>
            <div  id="dyjsform_footer" class=" row form-group align-items-center">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <button type="button" class="form-control btn btn-primary dyjsform_action_add">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>
                </div>
            </div>
                <textarea rows="30" cols="150" name="dyjsform[dyjsform_options]"
                       id="dyjsform_options"></textarea>
            `;
    }

    getField(field,rowIndex, BSColumnWidth) {
        let type = field.type ? `type="${field.type}"` : '';
        let value = field.type ? `value="${field.value}"` : '';
        let content = field.content ? `${field.content}` : '';
        let className = field.class ? `${field.class}` : '';
        let name = !field.name.startsWith('dyjsform_action_') ? `name="dyjsform[${field.name}_${rowIndex}]"` :  '';

        return `<div class="form-group col-md-${BSColumnWidth}">
            <div class="col-md-12">${field.label === '' ? '&nbsp;' : field.label}</div>
            <div class="col-md-12">
                <${field.html_element} ${name} class="form-control ${field.name} ${className}" ${type} ${value} 
                data-row="${rowIndex}" data-name="${field.name}">${content}</${field.html_element}>
            </div>
        </div>`;
    }


}
