
export default class Dyjsform {

    /**
     *
     * Exemple:  [{'html_element':'input','type': 'number', 'name': 'name_1','label': 'name_1', 'value':''},]
     * @param templateName
     */
    constructor(templateName = 'classic') {
        this._entity = [{'html_element': 'input', 'type': 'number', 'name': 'name_1', 'label': 'name_1', 'value': '', 'content' : '', 'class' : ''},
            {'html_element': 'input', 'type': 'text', 'label': 'name_1', 'name': 'name_2', 'value': '', 'content' : '', 'class' : ''},
            {'html_element': 'input', 'type': 'password', 'label': 'name_1', 'name': 'name_3', 'value': '', 'content' : '', 'class' : ''},
        ];
        this._json = [];
        this._outputJson = [];
        this._templateName = templateName;
        this._template = null;

    }

    async init () {
        console.log('initializing Dyjsform');
        this.loadTemplate().then(
            () => {
                this.initForm();
                this.initHandlers();
            }
        );
        return this;
    }

    getEntity(){
        return this._entity;
    }

    setEntity(array){
        this._entity = array;
        return this;
    }

    getJson(){
        return this._json;
    }

    jsonRefresh(json){
        switch (typeof json) {
            case 'string':
                this._json = this.strToJson(json);
                break
            default:
                this._json = json;
                break;
        }
        this.updateOutputJson();
        this.writeOutputJson()
        return this;
    }


    get nameValuejson() {
        return this._outputJson;
    }

    set nameValuejson(value) {
        this._outputJson = value;
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
        this._template = new templateIndex[this._templateName]();
    }

    async refreshForm (json = null){
        console.log('refreshing Dyjsform');
        this.initForm();
        await this.rowsUpdate();
        this.initHandlers();
        this.writeOutputJson();
        console.log(this.getJson());
        return this;
    }

    getTemplate(){
        return this._template;
    }

    async setTemplate(templateName){
        this._templateName = templateName.charAt(0).toUpperCase()
            + templateName.slice(1); // premiere lettre en maj pour correspondre à la classe
        return this;
    }

    initForm () {
        let json = this._json;
        const template = this._template;
        document.querySelector('#dyjsform').innerHTML = template.getForm(json);// Utiliser la méthode getForm()
        return this;
    }

    initHandlers (){
        this.initEventListeners();
        this.handleInputKeyup();
    }
    async initEventListeners () {
        // Ajouter une nouvelle ligne
        if (document.getElementById('djf_action_add')) {
            document.getElementById('djf_action_add').addEventListener('click', (event) => {
                console.log('djf_action_add');
                event.preventDefault();
                let json = this.getJson();
                json.push(this._entity);
                this.jsonRefresh(json);
                this.writeOutputJson();
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
                let json = this.getJson();
                json.pop();
                this.jsonRefresh(json);
                this.writeOutputJson();
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

    updateOutputJson () {
        var nameValueJson =[];
        for (const row of this._json){
            let rowJson = [];
            for (let field of row) {
                rowJson.push( { [field['name']] : field['value'] });
            }
            nameValueJson.push(rowJson);
        }
        this.nameValuejson =  nameValueJson;
    }

    // Fonction pour générer le JSON
    writeOutputJson() {
        document.querySelector('#dyjsform_options').value = JSON.stringify(this.nameValuejson, null);
        return this;
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    async rowsUpdate() {
        const template = this._template;
        let begin = `<div class="row form-group align-items-center dyjsform_entity">`;
        let end = `</div>`;
        let rows = this.getJson();
        let HtmlForm = begin;
        for (let row of rows )
        {
            HtmlForm += await this.generateFields(row);
        }

        HtmlForm += end;

        this.addEntityToHtml(HtmlForm);
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    async generateFields(json) {
        const fieldNumber = this.getEntity().length;
        const BSColumnWidth = (12 / fieldNumber).toFixed(0);
        const template = this._template;
        let Html = '';
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
                    //             entityClone = JSON.parse(JSON.stringify(this._entity));
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
        this.jsonRefresh(JSON.stringify(entityArray, null));
        return this;

    }

}


