import DyJsForm from '../DyJsForm.js';

// MODULE ADHESION
document.addEventListener('DOMContentLoaded', function() {
    let dyjsform = new DyJsForm('#dyjsform',{
        debugMode : false,
        rawOutput : false
    });
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
                {'name':'newsletter', 'value' : 'newsletter','maxCount': 2},
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
            'className': '',
            'maxCount': 1
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
            'htmlElement': 'textarea',
            'type': 'text',
            'name': 'label',
            'label': 'libellé',
            'className' : 'mod_topweb_rgpd_form_label',
            'attr': 'style="height:150px"'
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
    // const json = `
    // [{"type_adhesion":"bac","name_text":"test","name_number":"1","label":"label","name_password":"pass"},
    //         {"type_adhesion":"newsletter","name_text":"","name_number":"","label":"","name_password":""},
    //         {"type_adhesion":"conditions_generales","name_text":"z","name_number":"3","label":"label3","name_password":"pass3"}]
    //     `
    // dyjsform.init(json);
    dyjsform.init();
// MODULE ADHESION FIN

    // Définir un alias
    // debugService.setEventAlias('DyJsForm.refreshForm', 'refresh');

// Ajouter un écouteur pour l'alias
    document.addEventListener('DyJsForm.refreshForm', (data) => {
        console.log('Event Triggered:', data);
    });
});