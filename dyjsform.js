
// --> Module Adhesion

// Fonction pour générer le JSON
function generateJson() {
    var data = [];
    $('#mod_topweb_adhesion_form .mod_topweb_adhesion_ligne').each(function() {
        var typeAdhesion = $(this).find('.mod_topweb_adhesion_type_adhesion').val();
        var codeAdhesion = $(this).find('.mod_topweb_adhesion_code_adhesion').val();
        var value = $(this).find('.mod_topweb_adhesion_value').val();

        // Ajouter à l'objet JSON
        data.push({
            "type_adhesion": typeAdhesion,
            "code_adhesion": codeAdhesion,
            "value": value
        });
    });
    // Afficher le JSON dans la console et sur la page
    $('#mod_topweb_adhesion_adhesion_choices').val(JSON.stringify(data, null));
    // resizeAccordeonContents();
}
// --

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
    $('#mod_topweb_adhesion_form').append(newLigne);
}
// --

// Charger le JSON à l'affichage de la page et générer les lignes
function loadJson() {
    var jsonString = $('#mod_topweb_adhesion_adhesion_choices').val();
    if (jsonString) {
        try {
            var jsonData = JSON.parse(jsonString);

            // Parcourir chaque objet dans le JSON et créer une ligne pour chacun
            jsonData.forEach(function(item) {
                createLine(item.type_adhesion, item.code_adhesion, item.value);
            });

        } catch (error) {
            console.error("Erreur lors de l'analyse du JSON : ", error);
        }
    }
}
// --
// <--