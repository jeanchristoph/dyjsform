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
}