export default class TemplateService {
    constructor() {
        this._templateName = 'classic';
        this._template = null;
    }

    get templateName() {
        return this._templateName;
    }

    set templateName(value) {
        this._templateName = value;
    }

    get template() {
        return this._template;
    }

    set template(value) {
        this._template = value;
    }

    async loadTemplate(){
        const templateIndex = await import('../Template'); // Assurez-vous d'importer la classe par défaut
        // Assurez-vous d'importer la classe par défaut
        let template = new templateIndex[this._templateName]();
        this._template = template
        return template;
    }

    formRender () {
        const template = this._template;
        return template.getForm();
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    rowRender(entity, json) {
        const template = this._template;
        const containerContent = document.querySelector('#dyjsform_container').innerHTML;
        let begin = `<div class="row form-group align-items-center dyjsform_entity">`;
        let end = `</div>`;
        let rows = json;
        let HtmlForm = containerContent;

        HtmlForm += begin;
        // for (let row of rows ) {
        rows.forEach((row, rowIndex) => {
            HtmlForm +=  this.fieldRender(entity, row, rowIndex);
        });
        HtmlForm += end;

        return HtmlForm;

    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    fieldRender(entity, row, rowIndex) {
        const fieldNumber = entity.length;
        const BSColumnWidth = (12 / fieldNumber).toFixed(0);
        const template = this._template;
        let Html = '';
        for (let field of row) {
            Html += template.getField(field,rowIndex, BSColumnWidth );
        }
        return Html;
    }



}