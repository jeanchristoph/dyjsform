import DyJsForm from '../DyJsForm.js';

// MODULE ADHESION
document.addEventListener('DOMContentLoaded', function() {
    let dyjsform = new DyJsForm('#dyjsform',{debug : false});
    dyjsform.template ='classic' ;
    dyjsform.entity = [
        {
            'htmlElement': 'select',
            'type': '',
            'name': 'type_adhesion',
            'label': 'Type adhésion',
            'value': '',
            'content': '',
            'className': '',
            'options': [
                {'name':'bac', 'value' : 'bac'},
                {'name':'newsletter', 'value' : 'newsletter','maxCount': 1},
                {'name':'condition generales', 'value' : 'conditions_generales','maxCount': 1},
            ]
        },
        {
            'htmlElement': 'input',
            'type': 'text',
            'name': 'name_text',
            'label': 'text',
            'value': '',
            'content': '',
            'className': ''
        },
        {
            'htmlElement': 'input',
            'type': 'number',
            'name': 'name_number',
            'label': 'nombre',
            'value': '',
            'content': ''
        },
        {
            'htmlElement': 'input',
            'type': 'email',
            'name': 'name_email',
            'label': 'email',
            'value': '',
            'content': '',
            'className': ''
        },
        {
            'htmlElement': 'input',
            'name': 'name_password',
            'label': 'password',
            'value': '',
            'content': '',
            'className': ''
        },
        {
            'htmlElement': 'button',
            'type': 'button',
            'name': 'dyjsform_action_remove',
            'label': '',
            'value': '',
            'content': 'Supprimer',
            'className': 'btn btn-warning'
        },
    ];
    dyjsform.init();
// MODULE ADHESION FIN

});