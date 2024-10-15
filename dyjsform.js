class Dyjsform {

    /**
     *
     * @param entity
     * Exemple:  [{'html_element':'input','type': 'text', 'name': 'name'}]
     * @param json
     */
    constructor(entity = [{'html_element':'input','type': 'text', 'name': 'name_1', 'value':''},
        {'html_element':'input','type': 'text', 'name': 'name_2', 'value':''},
        {'html_element':'input','type': 'text', 'name': 'name_3', 'value':''}
    ], json = {}) {
        this.entity = entity;
        this.json = json;
        this.onFieldkeyup();
    }

    getEntity(){
        return this.entity;
    }

    setEntity(array){
        this.entity = array;
        this.onFieldkeyup();
        return this;
    }

    getJson(){
        return this.json;
    }

    setJson(object){
        this.json = object;
        return this;
    }

    getFieldTemplate(field) {
        const element =
            `<div class="form-group col-md-3">
            <div class="col-md-12">${field.name}</div>
            <div class="col-md-12">
                <${field.html_element} class="form-control ${field.name}" type="${field.type}" value="${field.value}">
            </div>
        </div>`;
        return element;
    }

    onFieldkeyup () {
        console.log('onFieldkeyup');
        console.log(this.entity);
        for (const entity of this.entity){
            console.log(document.querySelector('.' + entity.name));
            if (document.querySelector('.' + entity.name)){
                document.querySelector('.' + entity.name).addEventListener('keyup', function() {
                    this.generateJson();  // Générer le JSON sur keyup
                });
            }
        }
    }

    handleEvent
// Fonction pour générer le JSON
    generateJson() {
        console.log('generateJson');
        var data = [];
        document.querySelectorAll('#dysform .dysform_entity').forEach(function(dysformEntity) {
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
        let deleteButton = `<div class="form-group col-md-3">
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
            HtmlForm = HtmlForm + this.getFieldTemplate(entity);
        }
        HtmlForm = HtmlForm + deleteButton;
        HtmlForm = HtmlForm + end;
        document.querySelector('#dysform').insertAdjacentHTML('beforeend', HtmlForm);
    }

// Charger le JSON à l'affichage de la page et générer les entitys
    loadJson() {
        var jsonString = document.querySelector('#dysform_options').value;
        if (jsonString) {
            try {
                var jsonData = JSON.parse(jsonString);
                jsonData.forEach(function(item) {
                    this.createEntity(item.type_adhesion, item.code_adhesion, item.value);
                });
            } catch (error) {
                console.error("Erreur lors de l'analyse du JSON : ", error);
            }
        }
    }



}


