//TODO: Initialisé avec des données en js
// TODO: ajouter un system de tooltips pour faire apparaitre les erreurs
//TODO: Faire remonté un Json depuis le dom si appel depuis le php
//TODO: Rendre le formaulaire en mode simple sans bouton ajouter
//TODO: ajouter un bouton submit
// TODO laisser aussi la possibilité plus tard de faire juste un formaulaire banal sans ajout ni suppression avec un bouton valider.
//TODO: ajouter une action post AJAX ou PHP
//TODO: ajouter une action post classique ?

//TODO: Eviter Bootstrap et passer en flex ?
//TODO: Customiser les message erreurs

//TO DO: ajouter des verifications -> Sort du périmetre
//TO DO: ajouter les bulles -> Sort du périmetre


import JsonService from './Service/JsonService.js';
import TemplateService from './Service/TemplateService.js';
import DebugService from './Service/DebugService.js';
import EntityDTO from './DTO/EntityDTO.js';
import OptionDTO from './DTO/OptionDTO.js';

export default class DyJsForm {

    /**
     * Initialisation du formulaire dynamique.
     * @param {string} selector - Le sélecteur CSS où insérer le formulaire.
     * @param {Object} options - Options de configuration.
     * @param {boolean} options.debug - Active le mode débogage.
     */
    constructor(selector = '', {debug = false}) {


        this._entity = []; // exemple
        this._jsonService = new JsonService();
        this._templateService = new TemplateService();
        this._onDataEditTimeOut = null;
        this._selector = selector;
        this._errors = [];

        if (debug) {
            return new DebugService(this); // Retourne une instance proxy pour le débogage
        }
        return this;
    }

    /**
     * Accesseur des entités.
     * Retourne une copie profonde pour éviter les modifications directes.
     */
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

    // set entity(array){
    //     this._entity = array;
    //     return this;
    // }

    set entity(array) {
        this._entity = array.map(data => {
            // Traiter les options s'il y en a, sinon définir un tableau vide
            const options = (data.options || []).map(opt => new OptionDTO(
                {
                    name : opt.name || "",
                    value : opt.value || "",
                    maxCount : opt.maxCount || null
                }

            ));

            // Retourner un nouvel EntityDTO
            return new EntityDTO(
                {
                    htmlElement: data.htmlElement || "",
                    type: data.type || "",
                    name: data.name || "",
                    label: data.label || "",
                    value: data.value || "",
                    content: data.content || "",
                    className: data.className || "",
                    options: options,
                    error: data.error || "",

                }
            );
        });
        return this;
    }



    get selector() {
        return this._selector;
    }

    set selector(value) {
        this._selector = value;
    }

    init () {
        const dataJson = JSON.parse(document.querySelector(this._selector).getAttribute('data-json'));
        this._templateService.loadTemplate().then(
            () => {
                const form = this._templateService.formRender();
                document.querySelector(this._selector).innerHTML = form;// Utiliser la méthode getForm()
                this.initHandlers();

                if ( dataJson !== '') {
                    this._jsonService.addRow(this.entity); // besoin d'une premiere raw pour initialisé le json
                    this._jsonService.loadReducedJson(dataJson)
                    this.refreshForm();
                }

            }
        )


        return this;
    }

    /**
     * Rafraîchit le formulaire en rendant les données actuelles.
     */
    refreshForm (){
        const form = this._templateService.formRender();
        document.querySelector('#dyjsform').innerHTML = form;// Utiliser la méthode getForm()
        const row = this._templateService.rowRender(this.entity, this._jsonService.json);
        document.querySelector('#dyjsform_container').innerHTML = row; // Utiliser += pour ajouter le contenu
        this.writeOutputJson();
        this.initHandlers();
        return this;
    }

    /**
     * Initialise les gestionnaires d'événements.
     */
    initHandlers (){

        this.initEventListeners();
        this.handleInputKeyup();
    }

    /**
     * Initialise les gestionnaires d'événements pour ajouter et supprimer des lignes.
     */
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
        let rowNumber = parseInt(element.getAttribute('data-row'));
        let fieldName = element.getAttribute('data-name');
        let value = element.value;

        let jsonUpdated = this._jsonService.updateJsonByField(rowNumber,fieldName, value);

        if (!jsonUpdated.success) {
            this._errors = jsonUpdated.errors;
            this.refreshForm();
        } else if (this._errors.length > 0){
            this._errors =  [];
            this.refreshForm();
        }
        this.writeOutputJson()
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


