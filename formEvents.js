let resizeTimeOut = 0;
const animationSpeed = 1000;

// Fonction pour masquer/afficher un élément en fonction de l'input
export function inputHide(input, idToHide) {
    const inputType = input.getAttribute('type');
    const inputValue = input.value;

    if (((inputType === 'checkbox' || inputType === 'radio') && input.checked) ||
        (inputType === 'number' && inputValue > 0) ||
        (inputType === 'text' && inputValue !== '')) {
        idToHide.style.display = 'block';
        resizeAccordeonContents();
    } else {
        idToHide.style.display = 'none';
        resizeAccordeonContents();
    }
}

// Fonction pour vérifier si la checkbox est cochée avec valeur vide
export function CheckboxEmptyValueCheck(checkbox, input, event, errorMessage) {
    const inputValue = input.value;
    const inputType = input.getAttribute('type');
    let isEmpty = false;

    if ((inputType === 'number' && inputValue > 0) || (inputType === 'text' && inputValue !== '')) {
        checkbox.classList.add('error');
        checkbox.setAttribute("data-original-title", errorMessage);
        event.preventDefault();
    } else {
        checkbox.classList.remove('error');
        checkbox.setAttribute("data-original-title", '');
        isEmpty = true;
    }
    return isEmpty;
}

// Fonction pour faire défiler jusqu'au dernier élément
export function scrollToLast(selector, timer = 1000) {
    setTimeout(() => {
        const lastElement = document.querySelector(selector + ":last-child");
        if (lastElement) {
            window.scrollTo({
                top: lastElement.offsetTop - 90,
                behavior: 'smooth'
            });
        }
    }, timer);
}

// Fonction pour rendre une checkbox en lecture seule
export function checkboxReadonly(checkbox, input, checked = true) {
    const inputType = input.getAttribute('type');
    const inputElementName = input.nodeName;
    let readonly = 'readonly';

    if (inputType === 'checkbox' || inputElementName === 'SELECT') {
        readonly = 'disabled';
    }
    if ((checked && checkbox.checked) || (!checked && !checkbox.checked)) {
        input.setAttribute(readonly, true);
    } else {
        input.removeAttribute(readonly);
    }
}

// Fonction pour créer et afficher un modal
export function createModal(selector) {
    let modal = new bootstrap.Modal(document.querySelector(selector), {
        keyboard: false
    });
    modal.toggle();
}

// Fonction pour basculer l'affichage d'un modal
export function toggleModal(selector) {
    let modal = bootstrap.Modal.getInstance(document.querySelector(selector));
    modal.toggle();
}

// Fonction pour redimensionner un accordéon
export function resizeAccordeonContents() {
    if (resizeTimeOut) {
        clearTimeout(resizeTimeOut);
    }
    resizeTimeOut = setTimeout(() => {
        let panels = document.querySelectorAll(".accordion.active ~ .panel");
        panels.forEach(panel => {
            if (panel) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }, 500);
}

// Fonction pour ajuster automatiquement la hauteur d'un champ de texte
export function autoGrow(oField) {
    if (oField.scrollHeight > oField.clientHeight) {
        oField.style.height = oField.scrollHeight + "px";
    }
    resizeAccordeonContents();
}
