// MODULE ADHESION

// Ajouter une nouvelle ligne
document.getElementById('addEntity').addEventListener('click', function(event) {
    event.preventDefault();
    createLine();
    resizeAccordeonContents();
});

// Supprimer une ligne
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('remove_entity')) {
        event.preventDefault();
        console.log('remove');
        event.target.closest('.dysform_entity').remove();
        generateJson();  // Régénérer le JSON après la suppression
    }
});

// Déclencher la génération du JSON sur chaque keyup
document.querySelectorAll('.mod_topweb_adhesion_type_adhesion, .mod_topweb_adhesion_code_adhesion, .mod_topweb_adhesion_value').forEach(function(input) {
    input.addEventListener('keyup', function() {
        generateJson();  // Générer le JSON sur keyup
    });
});

// Initialiser le JSON à l'ouverture de la page
loadJson();  // Charger les données JSON au démarrage de la page
generateJson();  // Générer le JSON initial

// MODULE ADHESION FIN
inputHide(document.getElementById('mod_topweb_montant_aff_btn_montant'), document.querySelector('.montant_btn_params'));

document.getElementById('mod_topweb_montant_aff_btn_montant').addEventListener('change', function() {
    inputHide(document.getElementById('mod_topweb_montant_aff_btn_montant'), document.querySelector('.montant_btn_params'));
});