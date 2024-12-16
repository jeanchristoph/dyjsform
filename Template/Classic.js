export class Classic {

    getBegin(){
        return `<div class="row form-group align-items-center dyjsform_entity">`;
    }
    getEnd(){
        return `<div>`;
    }
    getForm(selector) {
        return `
            <div class="dyjsform_container"></div>
            <div  class="dyjsform_footer" class=" row form-group align-items-center">
                <div class="col-md-3"></div>
                <div class="col-md-12">
                    <button type="button" class="form-control btn btn-primary dyjsform_action_add">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>
                </div>
            </div>
<!--                <textarea rows="30" cols="150" name="${selector}[output]"-->
                <textarea hidden name="${selector}[output]"
                       class="output"></textarea>
            `;
    }

    getField(field,rowIndex, BSColumnWidth) {
        const type = field.type ? `type="${field.type}"` : '';
        const value = field.value ? `value="${field.value}"` : '';
        let content = '';
        const className = field.className ? `${field.className}` : '';
        const attr = field.attr ? `${field.attr}` : '';
        const name = !field.name.startsWith('dyjsform_action_') ? `name="dyjsform[${field.name}_${rowIndex}]"` :  '';

        if (field.htmlElement === 'select' && field.options){
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
                <${field.htmlElement} ${name} class="form-control dyjsform_input ${field.name} ${className}" ${attr} ${type} ${value} 
                data-row="${rowIndex}" data-name="${field.name}">${content}</${field.htmlElement}>
                <span class="text-danger djf_error">${field.error}</span>
            </div>
        </div>`;
    }

    getCss() {
        return ``;

    }


}
