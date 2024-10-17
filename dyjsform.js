class Dyjsform {

    /**
     *
     * @param entity
     * Exemple:  [{'html_element':'input','type': 'number', 'name': 'name_1','label': 'name_1', 'value':''},]
     * @param json
     */
    constructor(entity = [{'html_element':'input','type': 'number', 'name': 'name_1','label': 'name_1', 'value':''},
        {'html_element':'input','type': 'text', 'label': 'name_1', 'name': 'name_2', 'value':''},
        {'html_element':'input','type': 'password', 'label': 'name_1', 'name': 'name_3', 'value':''},
    ], json = {}) {
        this.entity = entity;
        this.json = json;
        this.initEventListeners();
        this.handleInputKeyup();
        // Initialiser le JSON à l'ouverture de la page
        this.loadJson()// Charger les données JSON au démarrage de la page
        this.generateJson(); // Générer le JSON initial
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
        this.json = object;
        return this;
    }

    getFieldTemplate(field, BSColumnWidth ) {
        const element =
            `<div class="form-group col-md-${BSColumnWidth}">
            <div class="col-md-12">${field.label}</div>
            <div class="col-md-12">
                <${field.html_element} class="form-control ${field.name}" type="${field.type}" value="${field.value}">
            </div>
        </div>`;
        return element;
    }

    initEventListeners () {
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
                event.target.closest('.dysform_entity').remove();
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
            console.log(elements); // Vérifier les éléments trouvés
            if (elements.length > 0) {
                elements.forEach((element) => {
                    element.addEventListener('keyup', () => {
                        this.generateJson();  // Générer le JSON sur keyup
                        console.log("this.generateJson()");
                    });
                });
            }
        }
    }

    handleEvent
// Fonction pour générer le JSON
    generateJson() {
        console.log('generateJson');
        var data = [];
        document.querySelectorAll('#dysform .dysform_entity').forEach((dysformEntity) =>  {
            let entityData = {};
            for (let entity of this.entity) {
                entityData[entity.name] = dysformEntity.querySelector('.' + entity.name).value;
            }
            data.push(entityData);
        });

        document.querySelector('#dysform_options').value = JSON.stringify(data, null);
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    createEntity () {
        let begin =`<div class="row form-group align-items-center dysform_entity">`;
        let end = `</div>`;

        const actionButtons = 1;
        const fieldNumber = this.getEntity().length  + actionButtons;
        const BSColumnWidth = (12 / fieldNumber).toFixed(0);

        const deleteButton = `<div class="form-group col-md-${BSColumnWidth}">
        <div class="col-md-12">&nbsp;</div>
        <div class="col-md-12">
            <button type="button" class="remove_entity btn btn-danger form-control">Supprimer</button>
        </div>
    </div>`;

        let HtmlForm = '';

        HtmlForm = begin;
        for (let entity of this.entity) {
            console.log(this.entity);
            console.log(entity);
            HtmlForm = HtmlForm + this.getFieldTemplate(entity, BSColumnWidth);
        }
        HtmlForm = HtmlForm + deleteButton;
        HtmlForm = HtmlForm + end;
        document.querySelector('#dysform').insertAdjacentHTML('beforeend', HtmlForm);
        this.handleInputKeyup();
    }

// Charger le JSON à l'affichage de la page et générer les entitys
    loadJson() {
        var jsonString = document.querySelector('#dysform_options').value;
        if (jsonString) {
            try {
                var jsonData = JSON.parse(jsonString);
                jsonData.forEach((item) =>  {
                    this.createEntity(item.type_adhesion, item.code_adhesion, item.value);
                });
            } catch (error) {
                console.error("Erreur lors de l'analyse du JSON : ", error);
            }
        }
    }



}


