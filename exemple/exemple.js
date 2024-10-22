import Dyjsform from '../dyjsform.js';

// MODULE ADHESION
document.addEventListener('DOMContentLoaded', function() {
    let dyjsform = new Dyjsform();
    dyjsform.setTemplate('classic');
    const dyjsformEntities = [
        {'html_element':'input','type': 'date', 'name': 'name_1', 'label': 'date','value':''},
        {'html_element':'input','type': 'text', 'name': 'name_2', 'label': 'text','value':''},
        {'html_element':'input','type': 'number', 'name': 'name_3', 'label': 'nombre','value':''},
        {'html_element':'input','type': 'email', 'name': 'name_4', 'label': 'email','value':''},
        {'html_element':'input','type': 'password', 'name': 'name_5', 'label': 'password', 'value':''},
    ];
    dyjsform.setEntity(dyjsformEntities);
// MODULE ADHESION FIN
});