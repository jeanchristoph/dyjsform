import JsonService from './Service/JsonService.js';
import TemplateService from './Service/TemplateService.js';
//TODO Gérer les numéro de ligne pour les updates :
//TODO ajout de numéro de ligne en data dans les inputs
//TODO Ingnorer les boutons action dans le json
//TODO faire l'update du JSon lors de la modif grace à numéro de ligne
//TODO faire fonctionner la suppression grace a numéro de ligne
export default class DyJsForm {

    /**
     *
     * Exemple:  [{'html_element':'input','type': 'number', 'name': 'name_1','label': 'name_1', 'value':''},]
     */
    constructor() {
        this._entity = [{'html_element': 'input', 'type': 'number', 'name': 'name_1', 'label': 'name_1', 'value': '', 'content' : '', 'class' : ''},
            {'html_element': 'input', 'type': 'text', 'label': 'name_1', 'name': 'name_2', 'value': '', 'content' : '', 'class' : ''},
            {'html_element': 'input', 'type': 'password', 'label': 'name_1', 'name': 'name_3', 'value': '', 'content' : '', 'class' : ''},
        ]; // exemple
        this.jsonService = new JsonService();
        this.templateService = new TemplateService();
    }

    get entity(){
        return this._entity;
    }

    set entity(array){
        this._entity = array;
        return this;
    }

    get template(){
        return this.templateService.templateName;
    }

    set template(templateName){
        // premiere lettre en maj pour correspondre à la classe
        this.templateService.templateName = templateName.charAt(0).toUpperCase()
            + templateName.slice(1);
        return this;
    }

    init () {
        console.log('initializing Dyjsform');
        this.templateService.loadTemplate().then(
            () => {
                const form = this.templateService.formRender(this.jsonService.json);
                document.querySelector('#dyjsform').innerHTML = form;// Utiliser la méthode getForm()
                this.initHandlers();
            }
        );
        return this;
    }

    refreshForm (){
        console.log('refreshing Dyjsform');
        const form = this.templateService.formRender(this.jsonService.json);
        document.querySelector('#dyjsform').innerHTML = form;// Utiliser la méthode getForm()

        const row = this.templateService.rowRender(this._entity, this.jsonService.json);
        document.querySelector('#dyjsform_container').innerHTML = row; // Utiliser += pour ajouter le contenu

        this.writeOutputJson()
        this.initHandlers();
        return this;
    }

    initHandlers (){
        this.initEventListeners();
        this.handleInputKeyup();
    }
    initEventListeners () {
        // Ajouter une nouvelle ligne
        if (document.getElementById('djf_action_add')) {
            document.getElementById('djf_action_add').addEventListener('click', (event) => {
                console.log('djf_action_add');
                event.preventDefault();
                this.jsonService.addRow(this._entity);
                this.refreshForm();

            });
        }

        // Supprimer une ligne
        // document.addEventListener('click', (event) => {
        if (document.getElementById('djf_action_remove')){
            console.log('document.getElementById(djf_action_remove)');
            document.getElementById('djf_action_remove').addEventListener('click', (event) => {
                console.log('djf_action_remove');
                event.preventDefault();
                this.jsonService.removeRow();
                this.refreshForm();
            });
        }

        return this;
    }


    async handleInputKeyup () {
        // ecoute des inputs
        for (const entity of this._entity){
            const elements = document.querySelectorAll('.' + entity.name);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    element.addEventListener('keyup', async () => {
                        await this.refreshForm();
                    });
                    element.addEventListener('change', async () => {
                        await this.refreshForm();
                    });
                });
            }
        }
        return this;
    }

    // Fonction pour générer le JSON
    writeOutputJson() {
        console.log('writeOutputJson')
        console.log(JSON.stringify(this.jsonService.outputJson, null))
        document.querySelector('#dyjsform_options').value = JSON.stringify(this.jsonService.outputJson, null);
        return this;
    }

}


