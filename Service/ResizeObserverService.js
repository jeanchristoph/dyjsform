import EventService from "./EventService.js";

export default class ResizeObserverService {
    constructor(options) {
        this._selector = options.selector || '#dyjsform';
        this.targetElement = document.querySelector(this._selector);
        if (!this.targetElement) {
            throw new Error(`Element with selector ${this._selector} not found.`);
        }
        this._eventService = new EventService(options);
        this._inputResizedTimeout = 0;
        this.observerForNewElements = new MutationObserver(() => {

            this.targetElement.querySelectorAll('.dyjsform_input').forEach((targetInput) => {
                // Vérifier si l'élément n'a pas déjà un observateur
                if (!targetInput.__mutationObserver) {
                    const observer = new MutationObserver(() => {
                        clearTimeout(this._inputResizedTimeout);
                        this._inputResizedTimeout = setTimeout(()=>{
                            this.inputResized(targetInput);
                        },100)
                    });

                    observer.observe(targetInput, {
                        attributes: true,
                        attributeFilter: ['style'],
                    });

                    // Marquer l'élément comme observé
                    targetInput.__mutationObserver = observer;
                }
            });
        });

        // Observer l'ajout de nouveaux éléments dans l'élément cible
        this.observerForNewElements.observe(this.targetElement, {
            childList: true,
            subtree: true,
        });
    }

    // Méthode pour émettre un événement personnalisé et afficher un log
    inputResized(targetInput) {
        // Créer un événement personnalisé
        const eventName = `ResizeObserverService.inputResized`;

        this._eventService.dispatchEvent(eventName, {
            element: targetInput,
            message: 'Element resized'
        });

    }

    // Méthode pour déconnecter l'observateur si nécessaire
    disconnect() {
        this.observerForNewElements.disconnect();
    }
}
