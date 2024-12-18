
import {eventAliasMap} from "../config/eventAliasMap.js";

export default class EventService {

    constructor(options = {}) {
        this._options = options;
        this._selector = options.selector || '#dyjsform';
        this._debugMode = options.debugMode || false;
        this._eventAliasMap = eventAliasMap; // Table des alias pour les événements
    }
    /**
     * Déclenche un événement avec des données.
     * @param eventName
     * @param detail
     */
    dispatchEvent(eventName, detail) {
        // Vérifie si l'événement doit être dispatché, même si il n'est pas dans eventAliasMap
        if (this._eventAliasMap[eventName]) {
            const event = this._resolveAlias(eventName)
            // Créer un événement personnalisé avec les données passées
            const customEvent = new CustomEvent(event, {
                detail: detail, // Les données associées à l'événement
                bubbles: true, // Permet à l'événement de remonter dans la hiérarchie DOM
                cancelable: true // L'événement peut être annulé
            });
            // Déclencher l'événement sur le document
            document.dispatchEvent(customEvent);
            this._debugMode && console.log('event triggered: ' + this._resolveAlias(eventName))
        }
    }

    /**
     * Résout un alias en son nom d'événement original.
     * @param {string} event - Le nom de l'événement.
     * @returns {string} - L'alias ou le nom d'événement original.
     */
    _resolveAlias(event) {
        return `${this._selector}.${this._eventAliasMap[event] || event}`;
    }
}