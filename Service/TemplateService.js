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

    assignBootstrapCols(entities) {
        const flexValues = entities.map(e => e.flex || 1);
        const totalFlex = flexValues.reduce((sum, f) => sum + f, 0);

        // Calculer les valeurs exactes (avec décimales)
        const exactCols = flexValues.map(f => (f / totalFlex) * 12);

        // Calculer les colonnes initiales avec Math.floor
        let cols = exactCols.map(c => Math.floor(c));

        // Calculer les décimales restantes pour chaque colonne
        const decimals = exactCols.map((exact, i) => ({
            index: i,
            decimal: exact - cols[i],
        }));

        // Calculer combien de colonnes restent à distribuer
        let remainingCols = 12 - cols.reduce((sum, c) => sum + c, 0);

        // Trier par décimales décroissantes
        decimals.sort((a, b) => b.decimal - a.decimal);

        // Distribuer les colonnes restantes aux éléments avec les plus grandes décimales
        for(let i = 0; i < remainingCols; i++) {
            cols[decimals[i].index]++;
        }

        entities.forEach((e, i) => e.bootstrapCol = cols[i]);
        return entities;
    }



    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    fieldRender(entity, row, rowIndex) {
        const totalFieldsCount = entity.length;
        const template = this._template;
        row = this.assignBootstrapCols(row)
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