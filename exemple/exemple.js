import Dyjsform from '../dyjsform.js';

// MODULE ADHESION
document.addEventListener('DOMContentLoaded', function() {
    let dyjsform = new Dyjsform();
    dyjsform.setTemplate('classic');
    const dyjsformEntities = [
        {'html_element':'input','type': 'date', 'name': 'name_1', 'label': 'date','value':'', 'content' : '', 'class' : ''},
        {'html_element':'input','type': 'text', 'name': 'name_2', 'label': 'text','value':'', 'content' : '', 'class' : ''},
        {'html_element':'input','type': 'number', 'name': 'name_3', 'label': 'nombre','value':'', 'content' : ''},
        {'html_element':'input','type': 'email', 'name': 'name_4', 'label': 'email','value':'', 'content' : '', 'class' : ''},
        {'html_element':'input','type': 'password', 'name': 'name_5', 'label': 'password', 'value':'', 'content' : '', 'class' : ''},
        {'html_element':'button','type': 'button', 'name': 'djf_action_remove', 'label': '', 'value':'', 'content' : 'Supprimer', 'class' : 'btn btn-danger'},
    ];
    dyjsform.setEntity(dyjsformEntities);
    dyjsform.init();
// MODULE ADHESION FIN
    // TODO laisser aussi la possibilité plus tard de faire juste un formaulaire banal sans ajout ni suppression avec un bouton valider.
});