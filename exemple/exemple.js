// MODULE ADHESION
document.addEventListener('DOMContentLoaded', function() {
    let dyjsform = new Dyjsform();


// Ajouter une nouvelle ligne
    document.getElementById('add_entity').addEventListener('click', function(event) {
        event.preventDefault();
        dyjsform.createEntity();
        resizeAccordeonContents();
    });

// Supprimer une ligne
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('remove_entity')) {
            event.preventDefault();
            console.log('remove');
            event.target.closest('.dysform_entity').remove();
            dyjsform.generateJson();  // Régénérer le JSON après la suppression
        }
    });

// Déclencher la génération du JSON sur chaque keyup
    document.querySelectorAll('.mod_topweb_adhesion_type_adhesion, .mod_topweb_adhesion_code_adhesion, .mod_topweb_adhesion_value').forEach(function(input) {
        input.addEventListener('keyup', function() {
            dyjsform.generateJson();  // Générer le JSON sur keyup
        });
    });

// Initialiser le JSON à l'ouverture de la page
    dyjsform.loadJson()// Charger les données JSON au démarrage de la page
    dyjsform.generateJson(); // Générer le JSON initial

// MODULE ADHESION FIN
});