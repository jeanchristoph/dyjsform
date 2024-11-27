
//TODO: supprimé pur et simplement le name pour les boutons action ne laisser que le data-name dyjsform_action_xxx
//TODO: Les name devrait être sous la forme dyjsform[{data-name}], si 1+ row : dyjsform[{data-name}_{numérod de row}]
//TODO: Initialisé avec des données en js
//TODO: Faire remonté un Json depuis le dom si appel depuis le php
//TODO: Rendre le formaulaire en mode simple sans bouton ajouter
//TODO: ajouter un bouton submit
//TODO: ajouter une action post AJAX ou PHP
//TODO: ajouter une action post classique ?
//TODO: Eviter Bootstrap et passer en flex ?

//TO DO: ajouter des verifications -> Sort du périmetre
//TO DO: ajouter les bulles -> Sort du périmetre


import JsonService from './Service/JsonService.js';
import TemplateService from './Service/TemplateService.js';
import DebugService from './Service/DebugService.js';

export default class DyJsForm {

    /**
     *
     * Exemple:  [{'html_element':'input','type': 'number', 'name': 'name_1','label': 'name_1', 'value':''},]
     */
    constructor({debug = 0}) {


        this._entity = [{'html_element': 'input', 'type': 'number', 'name': 'name_1', 'label': 'name_1', 'value': '', 'content' : '', 'class' : ''},
            {'html_element': 'input', 'type': 'text', 'label': 'name_1', 'name': 'name_2', 'value': '', 'content' : '', 'class' : ''},
            {'html_element': 'input', 'type': 'password', 'label': 'name_1', 'name': 'name_3', 'value': '', 'content' : '', 'class' : ''},
        ]; // exemple
        this._jsonService = new JsonService();
        this._templateService = new TemplateService();
        this._onDataEditTimeOut = null;

        if (debug === 1) {
            return new DebugService(this); // Retourner une instance proxy de débogage
        }
        return this;
    }

    get entity(){
        //clonage profond pour éviter le passage par référence dans le json créé ensuite et les pbs d'updates
        return JSON.parse(JSON.stringify(this._entity));
    }

    getEntityData(){
        //clonage profond pour éviter le passage par référence dans le json créé ensuite et les pbs d'updates
        return JSON.parse(
            JSON.stringify(
                // Créer un tableau filtré : pour enlever les boutons actions
                this._entity.filter(item => !item.name.startsWith('dyjsform_action_'))
            )
        );
    }

    set entity(array){
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
        this._templateService.loadTemplate().then(
            () => {
                const form = this._templateService.formRender();
                document.querySelector('#dyjsform').innerHTML = form;// Utiliser la méthode getForm()
                this.initHandlers();
            }
        );
        return this;
    }

    refreshForm (){
        const form = this._templateService.formRender();
        document.querySelector('#dyjsform').innerHTML = form;// Utiliser la méthode getForm()

        const row = this._templateService.rowRender(this.entity, this._jsonService.json);
        document.querySelector('#dyjsform_container').innerHTML = row; // Utiliser += pour ajouter le contenu
        this.writeOutputJson();
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
        this.deleteHandler()

        return this;
    }

    addHandler() {
        document.querySelectorAll('.dyjsform_action_add').forEach((element) => {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                this._jsonService.addRow(this.entity);
                this.refreshForm();
            });
        });
    }

    deleteHandler(){
        document.querySelectorAll('.dyjsform_action_remove').forEach((element) => {
            element.addEventListener('click', (event) => {
                // Récupérer l'attribut data-row de l'élément cible
                const rowNumber = event.target.getAttribute('data-row');
                event.preventDefault(); // Empêche le comportement par défaut du clic

                // Appel des méthodes de service
                this._jsonService.removeRow(rowNumber);
                this.refreshForm();
            });
        });

    }

    onDataEdit (element){
        if (this._onDataEditTimeOut){
            clearTimeout(this._onDataEditTimeOut);
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
        for (const entity of this.getEntityData()){
            const elements = document.querySelectorAll('.' + entity.name);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    element.addEventListener('keyup',  (event) => {
                        this.onDataEdit(event.target)
                    });
                    element.addEventListener('change',  (event) => {
                        this.onDataEdit(event.target);
                    });
                });
            }
        }
        return this;
    }

// Fonction pour générer le JSON
    writeOutputJson() {
        document.querySelector('#dyjsform_options').value = JSON.stringify(this._jsonService.outputJson, null);
        return this;
    }

}


