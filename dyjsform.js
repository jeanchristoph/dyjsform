// Fonction pour générer le JSON
function generateJson() {
    var data = [];
    document.querySelectorAll('#mod_topweb_adhesion_form .mod_topweb_adhesion_ligne').forEach(function(ligne) {
        var typeAdhesion = ligne.querySelector('.mod_topweb_adhesion_type_adhesion').value;
        var codeAdhesion = ligne.querySelector('.mod_topweb_adhesion_code_adhesion').value;
        var value = ligne.querySelector('.mod_topweb_adhesion_value').value;

        data.push({
            "type_adhesion": typeAdhesion,
            "code_adhesion": codeAdhesion,
            "value": value
        });
    });

    document.querySelector('#mod_topweb_adhesion_adhesion_choices').value = JSON.stringify(data, null);
}

// Fonction pour créer une ligne dans le formulaire
function createLine(typeAdhesion = '', codeAdhesion = '', value = '') {
    var newLigne = `
        <div class="row form-group align-items-center mod_topweb_adhesion_ligne">
            <div class="form-group col-md-3">
                <div class="col-md-12">Libellé</div>
                <div class="col-md-12">
                    <input class="form-control mod_topweb_adhesion_type_adhesion" type="text" value="${typeAdhesion}">
                </div>
            </div>
            <div class="form-group col-md-3">
                <div class="col-md-12">Code</div>
                <div class="col-md-12">
                    <input class="form-control mod_topweb_adhesion_code_adhesion" type="text" value="${codeAdhesion}">
                </div>
            </div>
            <div class="form-group col-md-3">
                <div class="col-md-12">Montant</div>
                <div class="col-md-12">
                    <input class="form-control mod_topweb_adhesion_value" type="text" value="${value}">
                </div>
            </div>
            <div class="form-group col-md-3">
                <div class="col-md-12">&nbsp;</div>
                <div class="col-md-12">
                    <button type="button" class="remove_ligne btn btn-danger form-control">Supprimer</button>
                </div>
            </div>
        </div>
    `;
    document.querySelector('#mod_topweb_adhesion_form').insertAdjacentHTML('beforeend', newLigne);
}

// Charger le JSON à l'affichage de la page et générer les lignes
function loadJson() {
    var jsonString = document.querySelector('#mod_topweb_adhesion_adhesion_choices').value;
    if (jsonString) {
        try {
            var jsonData = JSON.parse(jsonString);
            jsonData.forEach(function(item) {
                createLine(item.type_adhesion, item.code_adhesion, item.value);
            });
        } catch (error) {
            console.error("Erreur lors de l'analyse du JSON : ", error);
        }
    }
}
