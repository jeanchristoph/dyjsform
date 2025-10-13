export class Classic {

    getBegin(){
        return `<div class="dyjsform_entity">`;
    }
    getEnd(){
        return `</div>`;
    }
    getForm(selector) {
        const outputName = selector.replace('#', '');
        return `
            <div class="dyjsform_container"></div>
            <div class="dyjsform_footer">
                <button type="button" class="btn btn-primary dyjsform_action_add">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>
                </div>
                <textarea hidden name="${outputName}[output]"
                       class="output"></textarea>
            `;
    }

    getField(field, rowIndex) {
        const type = field.type ? `type="${field.type}"` : '';
        const value = field.htmlElement !== 'textarea' && field.value ? `value="${this._escapeHtml(field.value)}"` : '';
        let content = '';
        const className = field.className ? `${field.className}` : '';
        const attr = field.attr ? `${field.attr}` : '';
        const name = !field.name.startsWith('dyjsform_action_') ? `name="dyjsform[${field.name}_${rowIndex}]"` :  '';

        // Calcul de la largeur basée sur flex-basis pour simuler les 12 colonnes
        const flex = field.flex || 1;

        if (field.htmlElement === 'select' && field.options){
            content += `<option></option>`;
            field.options.forEach(option => {
                // pas besoin de mettre les max count en data car déjà dans le json
                // let maxCount= option.maxCount ? `data-maxCount=${option.maxCount}` : '';
                let selected= field.value === option.value ? 'selected' : '';
                // content += `<option ${selected} value="${option.value}" ${maxCount}>${option.name}</option>`;
                content += `<option ${selected} value="${option.value}">${option.name}</option>`;
            });
        } else if (field.htmlElement === 'textarea'){
            content = field.value ? `${this._escapeHtml(field.value)}` : '';
        } else {
            content = field.content ? `${field.content}` : '';
        }

        return `<div class="form-group" style="flex: ${flex}">
                <div class="dyjsform_label">${field.label === '' ? '&nbsp;' : field.label}</div>
                <div class="dyjsform_input_container">
                    <${field.htmlElement} ${name} class="form-control dyjsform_input ${field.name} ${className}" 
                        ${attr} ${type} ${value} data-row="${rowIndex}" data-name="${field.name}">${content}</${field.htmlElement}>
                <span class="text-danger djf_error">${field.error}</span>
            </div>
        </div>`;
    }

    getCss() {
        return `
            .dyjsform_container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .dyjsform_entity {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                align-items: flex-start;
                width: 100%;
                padding: 1rem;
                border-bottom: 1px solid #dee2e6;
            }
            
            .dyjsform_field {
                min-width: 200px;
            }
            
            .dyjsform_label {
                margin-bottom: 0.5rem;
            }
            
            .dyjsform_input_container {
                width: 100%;
            }
            
            .dyjsform_input {
                width: 100%;
                margin-bottom: 0.5rem;
            }
            
            .dyjsform_footer {
                display: flex;
                justify-content: flex-end;
                margin-top: 1rem;
            }
            
            .djf_error {
                display: block;
                font-size: 0.875rem;
            }
        `;
    }

    _escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // _unescapeHtml(str) {
    //     return str
    //         .replace(/&lt;/g, '<')
    //         .replace(/&gt;/g, '>')
    //         .replace(/&quot;/g, '"')
    //         .replace(/&#039;/g, "'")
    //         .replace(/&amp;/g, '&');
    // }

}
