export default class ResizeObserverService {
    constructor(selector) {
        this.targetElement = document.querySelector(selector);
        if (!this.targetElement) {
            throw new Error(`Element with selector ${selector} not found.`);
        }
        this._inputResizedTimeout = 0;

        this.observerForNewElements = new MutationObserver(() => {

            this.targetElement.querySelectorAll('.dyjsform_input').forEach((targetInput) => {
                // Vérifier si l'élément n'a pas déjà un observateur
                if (!targetInput.__mutationObserver) {
                    const observer = new MutationObserver(() => {
                        clearTimeout(this._inputResizedTimeout);
                        this._inputResizedTimeout = setTimeout(()=>{
                            this.inputResized(selector, targetInput);
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
    inputResized(selector, targetInput) {
        // Créer un événement personnalisé
        const eventName = `${selector}.ResizeObserverService.inputResized`;
        // const eventName = `${targetElementSelector}.ResizeObserverService.inputResized.${targetInput.name}`;
        const event = new CustomEvent(eventName, {
            detail: {
                element: targetInput,
                message: 'Element resized'
            }
        });

        // Déclencher l'événement
        targetInput.dispatchEvent(event);

        // Afficher le log dans la console
        console.log(`Event triggered: ${eventName}`);
    }

    // Méthode pour déconnecter l'observateur si nécessaire
    disconnect() {
        this.observerForNewElements.disconnect();
    }
}
