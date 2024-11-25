//TODO Bug : le contenu d"un input est copié lors de la création d'une nouvelle ligne
//TODO Ingnorer les boutons action dans le json
//TODO faire l'update du JSon lors de la modif grace à numéro de ligne
//TODO faire fonctionner la suppression grace a numéro de ligne

import JsonService from './Service/JsonService.js';
import TemplateService from './Service/TemplateService.js';

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
        this._jsonService = new JsonService();
        this._templateService = new TemplateService();
        this._onDataEditTimeOut = null;
    }

    get entity(){
        return this._entity;
    }

    set entity(array){
        console.log('set entity');
        console.log(array);
        this._entity = array;
        return this;
    }

    get template(){
        return this._templateService.templateName;
    }

    set template(templateName){
        // premiere lettre en maj pour correspondre à la classe
        this._templateService.templateName = templateName.charAt(0).toUpperCase()
            + templateName.slice(1);
        return this;
    }

    init () {
        console.log('initializing Dyjsform');
        this._templateService.loadTemplate().then(
            () => {
                const form = this._templateService.formRender(this._jsonService.json);
                document.querySelector('#dyjsform').innerHTML = form;// Utiliser la méthode getForm()
                this.initHandlers();
            }
        );
        return this;
    }

    refreshForm (){
        console.log('refreshing Dyjsform');
        const form = this._templateService.formRender(this._jsonService.json);
        document.querySelector('#dyjsform').innerHTML = form;// Utiliser la méthode getForm()

        const row = this._templateService.rowRender(this._entity, this._jsonService.json);
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
        this.addHandler()
        // Supprimer une ligne
        // document.addEventListener('click', (event) => {
        console.log('djf_action_remove handler')
        this.deleteHandler()

        return this;
    }

    addHandler() {
        document.querySelectorAll('.djf_action_add').forEach((element) => {
            element.addEventListener('click', (event) => {
                console.log('djf_action_add');
                event.preventDefault();
                console.log('before addRow')
                console.log(this._entity)
                this._jsonService.addRow(this._entity);
                this.refreshForm();
            });
        });
    }

    deleteHandler(){
        console.log('delete handler')
        document.querySelectorAll('.djf_action_remove').forEach((element) => {
            element.addEventListener('click', (event) => {
                // Récupérer l'attribut data-row de l'élément cible
                const rowNumber = event.target.getAttribute('data-row');
                console.log('rowNumber:', rowNumber);

                console.log('djf_action_remove');
                event.preventDefault(); // Empêche le comportement par défaut du clic

                // Appel des méthodes de service
                this._jsonService.removeRow(rowNumber);
                this.refreshForm();
            });
        });

    }

    onDataEdit (element){
        console.log('onDataEdit')
        if (this._onDataEditTimeOut){
            clearTimeout(this._onDataEditTimeOut);
            console.log('clearTimeout')
        }
        this._onDataEditTimeOut = setTimeout(() => {
            let rowNumber = element.getAttribute('data-row');
            let fieldName = element.getAttribute('data-name');
            let value = element.value;
            this._jsonService.updateJsonByField(rowNumber,fieldName, value);
            this.writeOutputJson()
        },1000)
    }


    async handleInputKeyup () {
        // ecoute des inputs
        for (const entity of this._entity){
            const elements = document.querySelectorAll('.' + entity.name);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    element.addEventListener('keyup', async () => {
                        this.onDataEdit(element)
                    });
                    element.addEventListener('change', async () => {
                        this.onDataEdit(element);
                    });
                });
            }
        }
        return this;
    }

// Fonction pour générer le JSON
    writeOutputJson() {
        console.log('writeOutputJson')
        console.log(JSON.stringify(this._jsonService.outputJson, null))
        document.querySelector('#dyjsform_options').value = JSON.stringify(this._jsonService.outputJson, null);
        return this;
    }

}


