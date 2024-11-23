import Dyjsform from '../dyjsform.js';

// MODULE ADHESION
document.addEventListener('DOMContentLoaded', function() {
    let dyjsform = new Dyjsform();
    dyjsform.template = 'classic';
    dyjsform.entity = [
        {
            'html_element': 'input',
            'type': 'date',
            'name': 'name_date',
            'label': 'date',
            'value': '',
            'content': '',
            'class': ''
        },
        {
            'html_element': 'input',
            'type': 'text',
            'name': 'name_text',
            'label': 'text',
            'value': '',
            'content': '',
            'class': ''
        },
        {
            'html_element': 'input',
            'type': 'number',
            'name': 'name_number',
            'label': 'nombre',
            'value': '',
            'content': ''
        },
        {
            'html_element': 'input',
            'type': 'email',
            'name': 'name_email',
            'label': 'email',
            'value': '',
            'content': '',
            'class': ''
        },
        {
            'html_element': 'input',
            'type': 'password',
            'name': 'name_password',
            'label': 'password',
            'value': '',
            'content': '',
            'class': ''
        },
        {
            'html_element': 'button',
            'type': 'button',
            'name': 'djf_action_remove',
            'label': '',
            'value': '',
            'content': 'Supprimer',
            'class': 'btn btn-danger'
        },
    ];
    dyjsform.init();
// MODULE ADHESION FIN
    // TODO laisser aussi la possibilité plus tard de faire juste un formaulaire banal sans ajout ni suppression avec un bouton valider.
});