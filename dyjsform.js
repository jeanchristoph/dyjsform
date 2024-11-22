
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
        this.json = [];
        this.templateName = templateName;
        this.template = null;

    }

    async init () {
        console.log('initializing Dyjsform');
        this.loadTemplate().then(
            () => {
                this.initForm();
            }
        );
        return this;
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

    setJson(json){
        switch (typeof json) {
            case 'string':
                this.json = this.strToJson(json);
                break
            default:
                this.json = json;
                break;
        }
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

    jsonToStr(jsonObject){
        return JSON.stringify(jsonObject, null, 2)
    }
    strToJson(str) {
        try {
            return JSON.parse(str);
        } catch (error) {
            console.error("Erreur lors du parsing JSON :", error);
            return null; // Ou une valeur par défaut comme {}
        }
    }



    async loadTemplate(){
        const templateIndex = await import('./template'); // Assurez-vous d'importer la classe par défaut
        // Assurez-vous d'importer la classe par défaut
        this.template = new templateIndex[this.templateName]();
    }

    async refreshForm (json = null){
        console.log('refreshing Dyjsform');
        this.initForm();
        await this.rowsUpdate();
        this.generateJson();
        return this;
    }

    getTemplate(){
        return this.template;
    }

    async setTemplate(templateName){
        this.templateName = templateName.charAt(0).toUpperCase()
            + templateName.slice(1); // premiere lettre en maj pour correspondre à la classe
        return this;
    }

    initForm () {
        let json = this.json;
        const template = this.template;
        document.querySelector('#dyjsform').innerHTML = template.getForm(json);// Utiliser la méthode getForm()
        this.initEventListeners();
        this.handleInputKeyup();
        return this;
    }

    async initEventListeners () {
        // Ajouter une nouvelle ligne
        document.getElementById('add_entity').addEventListener('click', (event) => {
            console.log('add_entity');
            event.preventDefault();
            let json = this.getJson();
            console.log(typeof(json));
            console.log(json);
            json.push(this.entity);
            this.setJson(json);
            this.generateJson();
            //TODO refreshForm ne doit servir qu'a raffraichir le formulaire qu'une fois que le json est ok
            //TODO Et non ajouter ou supprimer une ligne
            this.refreshForm();

        });

        // Supprimer une ligne
        document.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('remove_entity')) {
                event.preventDefault();
                event.target.closest('.dyjsform_entity').remove();
//TODO Il faut travailler avec le json et non avec le DOM
                //TODO refreshForm ne doit servir qu'a raffraichir le formulaire qu'une fois que le json est ok

                // let json = this.generateJson();
                // console.log('un json');
                // console.log(json);
                // return false;
                this.refreshForm();
            }
        });
        return this;
    }


    async handleInputKeyup () {
        // ecoute des inputs
        for (const entity of this.entity){
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
    generateJson() {
        console.log('generateJson');
        let result = '';
        let data = [];
        if (document.querySelectorAll('#dyjsform_container .dyjsform_entity').length){
            console.log('if')
            console.log('document.querySelectorAll(\'#dyjsform_container .dyjsform_entity\')')
            console.log(document.querySelectorAll('#dyjsform_container .dyjsform_entity'))
            document.querySelectorAll('#dyjsform_container .dyjsform_entity').forEach((dyjsformEntity) =>  {
                console.log('foreach')
                let entityData = {};
                for (let entity of this.entity) {
                    console.log('entity')
                    console.log(entity)
                    entityData[entity.name] = dyjsformEntity.querySelector('.' + entity.name).value;
                }
                console.log('entityData')
                console.log(entityData)
                data.push(entityData);
            });

        }

        // result = JSON.stringify(data, null);
        // document.querySelector('#dyjsform_options').value = result;
        // console.log('result');
        // console.log(result);

        return result;
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    async rowsUpdate() {
        const template = this.template;
        let begin = `<div class="row form-group align-items-center dyjsform_entity">`;
        let end = `</div>`;
        let rows = this.getJson();

        const actnBttnNmber = 1;
        const fieldNumber = this.getEntity().length + actnBttnNmber;
        const BSColumnWidth = (12 / fieldNumber).toFixed(0);
        const deleteButton = template.getDeleteButton(BSColumnWidth);

        let HtmlForm = begin;
        for (let row of rows )
        {
            HtmlForm += await this.generateFields(row, actnBttnNmber);
        }

        HtmlForm += deleteButton;
        HtmlForm += end;

        this.addEntityToHtml(HtmlForm);
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    async generateFields(json, actnBttnNmber = 1) {
        const fieldNumber = this.getEntity().length + actnBttnNmber;
        const BSColumnWidth = (12 / fieldNumber).toFixed(0);
        const template = this.template;
        let Html = '';
        console.log(typeof(json));
        console.log(typeof([]))
        console.log(json)
        for (let field of json) {
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
                    // if (jsonString) {
                    //     try {
                    //         const jsonData = JSON.parse(jsonString);
                    //         var entityClone = null;
                    //         jsonData.forEach((jsonValues) =>  {
                    //             entityClone = JSON.parse(JSON.stringify(this.entity));
                    //             entityClone.forEach(entity => {
                    //                 for (let jsonName in jsonValues) {
                    //                     if (entity.name === jsonName) {
                    //                         entity.value = jsonValues[jsonName];
                    //                     }
                    //                 }
                    //
                    //             });
                    //             entityArray.push(entityClone)
                    //         });
                    //     } catch (error) {
                    //         console.error("Erreur lors de l'analyse du JSON : ", error);
                    //     }
                    // }
                } catch (error) {
                    console.error("Erreur lors de l'analyse du JSON : ", error);
                }
            }
        }
        this.setJson(JSON.stringify(entityArray, null));
        return this;

    }

}


