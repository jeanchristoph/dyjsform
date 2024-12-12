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
        const type = field.type ? `type="${field.type}"` : '';
        const value = field.value ? `value="${field.value}"` : '';
        let content = '';
        const className = field.className ? `${field.className}` : '';
        const name = !field.name.startsWith('dyjsform_action_') ? `name="dyjsform[${field.name}_${rowIndex}]"` :  '';

        if (field.htmlElement === 'select' && field.options){
            console.log(field.options);
            content += `<option></option>`;
            field.options.forEach(option => {
                // pas besoin de mettre les max count en data car déjà dans le json
                // let maxCount= option.maxCount ? `data-maxCount=${option.maxCount}` : '';
                let selected= field.value === option.value ? 'selected' : '';
                // content += `<option ${selected} value="${option.value}" ${maxCount}>${option.name}</option>`;
                content += `<option ${selected} value="${option.value}">${option.name}</option>`;
            })
        } else {
            content = field.content ? `${field.content}` : '';
        }

        return `<div class="form-group col-md-${BSColumnWidth}">
            <div class="col-md-12">${field.label === '' ? '&nbsp;' : field.label}</div>
            <div class="col-md-12">
                <${field.htmlElement} ${name} class="form-control ${field.name} ${className}" ${type} ${value} 
                data-row="${rowIndex}" data-name="${field.name}">${content}</${field.htmlElement}>
            </div>
        </div>`;
    }


}
