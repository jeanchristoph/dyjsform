
export default class Dyjsform {

    /**
     *
     * Exemple:  [{'html_element':'input','type': 'number', 'name': 'name_1','label': 'name_1', 'value':''},]
     * @param templateName
     */
    constructor(templateName = 'Classic') {
        this.entity = [{'html_element': 'input', 'type': 'number', 'name': 'name_1', 'label': 'name_1', 'value': ''},
            {'html_element': 'input', 'type': 'text', 'label': 'name_1', 'name': 'name_2', 'value': ''},
            {'html_element': 'input', 'type': 'password', 'label': 'name_1', 'name': 'name_3', 'value': ''},
        ];
        this.json = {};
        this.templateName = templateName;
        this.template = null;
        this.initDyJsForm();
    }

    async initDyJsForm () {
        console.log('initializing Dyjsform');
        this.loadTemplate().then(
            () => {
                this.initForm();
                this.initEventListeners();
                this.handleInputKeyup();
                // Initialiser le JSON à l'ouverture de la page
                // this.loadJson();// Charger les données JSON au démarrage de la page
                // this.generateJson(); // Générer le JSON initial

            }
        );

    }

    getEntity(){
        return this.entity;
    }

    setEntity(array){
        this.entity = array;
        this.handleInputKeyup();
        return this;
    }

    getJson(){
        return this.json;
    }

    setJson(object){
        this.isJsonString(object);
        this.json = object;
        return this;
    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            console.log(e)
            return false;
        }
        return true;
    }


    async loadTemplate(){
        const templateIndex = await import('./template'); // Assurez-vous d'importer la classe par défaut
         // Assurez-vous d'importer la classe par défaut
        this.template = new templateIndex[this.templateName]();
    }

    getTemplate(){
        return this.template;
    }

    async setTemplate(templateName){
        this.templateName = templateName.charAt(0).toUpperCase()
            + templateName.slice(1); // premiere lettre en maj pour correspondre à la classe
        await this.initDyJsForm();

    }

    initForm () {
        const template = this.template;
        document.querySelector('#dyjsform').innerHTML = template.getForm();// Utiliser la méthode getForm()
    }

    async initEventListeners () {
        // Ajouter une nouvelle ligne
        document.getElementById('add_entity').addEventListener('click', (event) => {
            event.preventDefault();
            this.createEntity();
        });

        // Supprimer une ligne
        document.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('remove_entity')) {
                event.preventDefault();
                console.log('remove');
                event.target.closest('.dyjsform_entity').remove();
                this.generateJson();  // Régénérer le JSON après la suppression
            }
        });

        // Déclencher la génération du JSON sur chaque keyup
        document.querySelectorAll('.mod_topweb_adhesion_type_adhesion, .mod_topweb_adhesion_code_adhesion, .mod_topweb_adhesion_value').forEach((input) => {
            input.addEventListener('keyup', () => {
                this.generateJson();  // Générer le JSON sur keyup
            });
        });

    }


    handleInputKeyup () {
        // ecoute des inputs
        for (const entity of this.entity){
            const elements = document.querySelectorAll('.' + entity.name);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    element.addEventListener('keyup', () => {
                        this.generateJson();  // Générer le JSON sur keyup
                        console.log("keyup");
                    });
                    element.addEventListener('change', () => {
                        this.generateJson();  // Générer le JSON sur keyup
                        console.log("change");
                    });
                });
            }
        }
    }

    // Fonction pour générer le JSON
    generateJson() {
        console.log('generateJson');
        let data = [];
        document.querySelectorAll('#dyjsform_container .dyjsform_entity').forEach((dyjsformEntity) =>  {
            let entityData = {};
            for (let entity of this.entity) {
                entityData[entity.name] = dyjsformEntity.querySelector('.' + entity.name).value;
            }
            data.push(entityData);
        });

        document.querySelector('#dyjsform_options').value = JSON.stringify(data, null);
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    async createEntity() {
        const template = this.template;
        let begin = `<div class="row form-group align-items-center dyjsform_entity">`;
        let end = `</div>`;

        const actionButtons = 1;
        const fieldNumber = this.getEntity().length + actionButtons;
        const BSColumnWidth = (12 / fieldNumber).toFixed(0);
        const deleteButton = template.getDeleteButton(BSColumnWidth);

        let HtmlForm = begin;
        for (let entity of this.entity) {
            console.log(this.entity);
            console.log(entity);
            HtmlForm += template.getField(entity, BSColumnWidth);
        }
        HtmlForm += deleteButton;
        HtmlForm += end;

        document.querySelector('#dyjsform_container').innerHTML += HtmlForm; // Utiliser += pour ajouter le contenu
        this.handleInputKeyup();
    }

// Charger le JSON à l'affichage de la page et générer les entitys
    loadJson() {
        const jsonString = document.querySelector('#dyjsform_options').value;
        if (jsonString) {
            try {
                const jsonData = JSON.parse(jsonString);
                jsonData.forEach((item) =>  {
                    this.createEntity(item.type_adhesion, item.code_adhesion, item.value);
                });
            } catch (error) {
                console.error("Erreur lors de l'analyse du JSON : ", error);
            }
        }
    }



}


