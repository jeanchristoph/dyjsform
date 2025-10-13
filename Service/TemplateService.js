export default class TemplateService {
    constructor() {
        this._templateName = 'Classic';
        this._template = null;
    }

    get templateName() {
        return this._templateName;
    }

    set templateName(value) {
        value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        this._templateName = value;
    }

    get template() {
        return this._template;
    }

    set template(value) {
        this._template = value;
    }

    async loadTemplate(){
        const timestamp = Date.now();
        const templateIndex = await import(`../Template/index.js?v=${timestamp}`);
        // Assurez-vous d'importer la classe par défaut

        let template = new templateIndex[this._templateName]();
        this._template = template

        return template;
    }


    renderForm (selector) {
        const oldEl = document.querySelector(selector);
        const wrapper = document.createElement('div');
        wrapper.id = selector.replace('#', '');
        wrapper.innerHTML = this._template.getForm(selector);
        oldEl.parentNode.replaceChild(wrapper, oldEl);
        return this;
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    renderRow(selector, entity, json) {
        const template = this._template;
        const containerContent = document.querySelector(selector + ' .dyjsform_container').innerHTML;
        let rows = json;
        let HtmlForm = containerContent;

        HtmlForm += template.getBegin();
        // for (let row of rows ) {
        rows.forEach((row, rowIndex) => {
            HtmlForm +=  this.fieldRender(entity, row, rowIndex);
        });
        HtmlForm += template.getEnd();
        document.querySelector(selector + ' .dyjsform_container').innerHTML = HtmlForm; // Utiliser += pour ajouter le contenu
        return this;

    }

    calcBootstrapCols(flexArray) {
        const totalFlex = flexArray.reduce((a, b) => a + b, 0);
        let cols = flexArray.map(f => Math.round((f / totalFlex) * 12));

        // Ajustement si la somme n'est pas exactement 12
        let diff = 12 - cols.reduce((a,b) => a + b, 0);
        if (diff !== 0) {
            // On ajoute ou retire la différence au dernier élément
            cols[cols.length - 1] += diff;
        }

        return cols;
    }


    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    fieldRender(entity, row, rowIndex) {
        const totalFieldsCount = entity.length;
        const template = this._template;
        let Html = '';
        for (let field of row) {
            Html += template.getField(field,rowIndex, totalFieldsCount );
        }
        return Html;
    }

    injectCSS() {
        var style = document.createElement('style');
        style.textContent = this._template.getCss();
        style.setAttribute('data-dyjsform-stylesheet', '');
        var head = document.head;
        var firstStyleOrLinkTag = document.querySelector('head>style,head>link');

        if (firstStyleOrLinkTag) {
            head.insertBefore(style, firstStyleOrLinkTag);
        } else {
            head.appendChild(style);
        }
        return this;
    }



}