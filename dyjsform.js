class Dyjsform {
    constructor(entity = []) {
        this.entity = entity;
    }

    getEntity(){
        return this.entity;
    }

    setEntity(array){
        this.entity = array;
        return this;
    }


// Fonction pour générer le JSON
    generateJson() {
        var data = [];
        document.querySelectorAll('#dysform .dysform_entity').forEach(function(ligne) {
            var typeAdhesion = entity.querySelector('.dysform_type_adhesion').value;
            var codeAdhesion = entity.querySelector('.dysform_code_adhesion').value;
            var value = entity.querySelector('.dysform_value').value;

            data.push({
                "type_adhesion": typeAdhesion,
                "code_adhesion": codeAdhesion,
                "value": value
            });
        });

        document.querySelector('#dysform_options').value = JSON.stringify(data, null);
    }

    // Fonction pour créer une entity dans le formulaire Bootstrap 5
    createEntity (typeAdhesion = '', codeAdhesion = '', value = '') {
        var newLigne = `
        <div class="row form-group align-items-center dysform_entity">
            <div class="form-group col-md-3">
                <div class="col-md-12">Libellé</div>
                <div class="col-md-12">
                    <input class="form-control dysform_type_adhesion" type="text" value="${typeAdhesion}">
                </div>
            </div>
            <div class="form-group col-md-3">
                <div class="col-md-12">Code</div>
                <div class="col-md-12">
                    <input class="form-control dysform_code_adhesion" type="text" value="${codeAdhesion}">
                </div>
            </div>
            <div class="form-group col-md-3">
                <div class="col-md-12">Montant</div>
                <div class="col-md-12">
                    <input class="form-control dysform_value" type="text" value="${value}">
                </div>
            </div>
            <div class="form-group col-md-3">
                <div class="col-md-12">&nbsp;</div>
                <div class="col-md-12">
                    <button type="button" class="remove_entity btn btn-danger form-control">Supprimer</button>
                </div>
            </div>
        </div>
    `;
        document.querySelector('#dysform').insertAdjacentHTML('beforeend', newLigne);
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


