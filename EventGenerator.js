class EventGenerator {
    constructor(buttonSelector) {
        this.button = document.querySelector(buttonSelector);
        this.currentCallback = null; // Sauvegarde du callback actuel
        this.initClickEvent();  // Initialisation de l'événement
        this.autoUpdateEvent();  // Appel de la mise à jour automatique
    }

    initClickEvent() {
        // Initialisation de l'événement onclick
        this.button.addEventListener('click', (event) => {
            if (this.currentCallback) {
                this.currentCallback(event); // Exécuter la fonction callback actuelle
            }
        });
    }

    updateClickEvent(newCallback) {
        // Mise à jour du callback pour l'événement onclick
        this.currentCallback = newCallback;
    }

    autoUpdateEvent() {
        // Définir la première action onclick
        this.updateClickEvent((event) => {
            console.log('Premier clic');
        });

        // Changer l'action onclick automatiquement après un certain temps
        setTimeout(() => {
            this.updateClickEvent((event) => {
                console.log('Nouvelle action après mise à jour');
            });
        }, 3000); // Changement après 3 secondes
    }
}

// Exemple d'utilisation :
const myEventGenerator = new EventGenerator('#myButton');
