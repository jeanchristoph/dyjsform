import { CACHE_VERSION } from '../config/version.js';

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
        const module = await import(`../template/${this._templateName.toLowerCase()}/${this._templateName}.js?v=${CACHE_VERSION}`);
        this._template = new module[this._templateName]();
        return this._template;
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

        // for (let row of rows ) {
        rows.forEach((row, rowIndex) => {
            HtmlForm += template.getBegin();
            HtmlForm +=  this.fieldRender(entity, row, rowIndex);
            HtmlForm += template.getEnd();
        });

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

        entities.forEach((e, i) => {
            e.bsColSize = cols[i];
            e.flexPercent = (flexValues[i] / totalFlex) * 100;
        });
        return entities;
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    fieldRender(entity, row, rowIndex) {
        const template = this._template;
        const mainFields  = row.filter(f => !f.stackWith);
        const stackFields = row.filter(f =>  f.stackWith);
        this.assignBootstrapCols(mainFields);
        let Html = '';
        for (let field of mainFields) {
            const subField = stackFields.find(f => f.stackWith === field.name) || null;
            Html += template.getField(field, rowIndex, subField);
        }
        return Html;
    }

    injectCSS() {
        if (document.querySelector(`link[data-dyjsform-stylesheet="${this._templateName}"]`)) {
            return this;
        }
        const cssUrl = new URL(`../template/${this._templateName.toLowerCase()}/${this._templateName}.css?v=${CACHE_VERSION}`, import.meta.url).href;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        link.setAttribute('data-dyjsform-stylesheet', this._templateName);
        document.head.appendChild(link);
        return this;
    }



}