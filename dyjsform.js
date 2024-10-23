
export default class Dyjsform {

    /**
     *
     * Exemple:  [{'html_element':'input','type': 'number', 'name': 'name_1','label': 'name_1', 'value':''},]
     * @param templateName
     */
    constructor(templateName = 'classic') {
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
                this.initForm(this.loadJson());
                this.initEventListeners();
                this.handleInputKeyup();
                // Initialiser le JSON à l'ouverture de la page
                this.generateJson(); // Générer le JSON initial

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

    async refreshForm (json = null){
        console.log('refreshing Dyjsform');
        this.initForm();
        let entities = json;
        console.log(entities);
        if (entities){
            console.log('entities');
            for (const entity of entities){
                await this.createEntity(entity);
            }
        } else {
            console.log('else');
            await this.createEntity();
        }

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
        const json = this.generateJson()
        console.log(json);
        document.querySelector('#dyjsform').innerHTML = template.getForm(json);// Utiliser la méthode getForm()
    }

    async initEventListeners () {
        // Ajouter une nouvelle ligne
        document.getElementById('add_entity').addEventListener('click', (event) => {
            console.log('add_entity');
            event.preventDefault();
            this.refreshForm();
        });

        // Supprimer une ligne
        document.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('remove_entity')) {
                event.preventDefault();
                event.target.closest('.dyjsform_entity').remove();
                let json = this.generateJson();
                this.refreshForm(json);
            }
        });

    }


    async handleInputKeyup () {
        // ecoute des inputs
        for (const entity of this.entity){
            const elements = document.querySelectorAll('.' + entity.name);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    element.addEventListener('keyup', async () => {
                        await this.refreshForm();
                        this.generateJson();  // Générer le JSON sur keyup
                    });
                    element.addEventListener('change', async () => {
                        await this.refreshForm();
                        this.generateJson();  // Générer le JSON sur keyup
                    });
                });
            }
        }
    }

    // Fonction pour générer le JSON
    generateJson() {
        console.log('generateJson');
        let result = '';
        let data = [];
        if (document.querySelectorAll('#dyjsform_container .dyjsform_entity')){
            document.querySelectorAll('#dyjsform_container .dyjsform_entity').forEach((dyjsformEntity) =>  {
                let entityData = {};
                for (let entity of this.entity) {
                    entityData[entity.name] = dyjsformEntity.querySelector('.' + entity.name).value;
                }
                data.push(entityData);
            });
            if (data.length){
                result = JSON.stringify(data, null);
                document.querySelector('#dyjsform_options').value = result;
                console.log('result');
                console.log(result);
            }
        }
        return result;
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    async createEntity(entity = this.entity) {
        const template = this.template;
        let begin = `<div class="row form-group align-items-center dyjsform_entity">`;
        let end = `</div>`;

        const actnBttnNmber = 1;
        const fieldNumber = this.getEntity().length + actnBttnNmber;
        const BSColumnWidth = (12 / fieldNumber).toFixed(0);
        const deleteButton = template.getDeleteButton(BSColumnWidth);

        let HtmlForm = begin;
        HtmlForm += await this.generateFields(entity, actnBttnNmber);
        HtmlForm += deleteButton;
        HtmlForm += end;

        this.addEntityToHtml(HtmlForm);
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    async generateFields(entity, actnBttnNmber = 1) {
        const fieldNumber = this.getEntity().length + actnBttnNmber;
        const BSColumnWidth = (12 / fieldNumber).toFixed(0);
        const template = this.template;
        let Html = '';

        for (let field of entity) {
            Html += template.getField(field, BSColumnWidth);
        }

        return Html;
    }

    addEntityToHtml (HtmlForm) {
        document.querySelector('#dyjsform_container').innerHTML += HtmlForm; // Utiliser += pour ajouter le contenu
        this.handleInputKeyup();
    }

// Charger le JSON à l'affichage de la page et générer les entitys
    loadJson() {
        let entitiesArray = [];
        let entityArray = [];
        if (document.querySelector('#dyjsform_options') ){


            const jsonString = document.querySelector('#dyjsform_options').value;
            if (jsonString) {
                try {
                    const jsonString = document.querySelector('#dyjsform_options').value;
                    console.log(jsonString);
                    if (jsonString) {
                        try {
                            const jsonData = JSON.parse(jsonString);
                            let entityArray = [];
                            var entityClone = null;
                            jsonData.forEach((jsonValues) =>  {
                                entityClone = JSON.parse(JSON.stringify(this.entity));
                                entityClone.forEach(entity => {
                                    for (let jsonName in jsonValues) {
                                        if (entity.name === jsonName) {
                                            entity.value = jsonValues[jsonName];
                                        }
                                    }

                                });
                                entityArray.push(entityClone)
                            });
                            return JSON.stringify(entityArray, null);
                        } catch (error) {
                            console.error("Erreur lors de l'analyse du JSON : ", error);
                        }
                    }
                } catch (error) {
                    console.error("Erreur lors de l'analyse du JSON : ", error);
                }
            }
        }
        return JSON.stringify(entityArray, null);

    }

}


