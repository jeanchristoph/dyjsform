
import {eventAliasMap} from "../config/eventAliasMap.js";

export default class ProxyService {
    constructor(instance, options = {}) {
        this._instance = instance;
        this._listeners = {}; // Gestion des événements
        // this._options = options;
        this._debugMode = options.debugMode || false; //
        this._selector = options.selector || '#dyjsform'; //
        this._eventAliasMap = eventAliasMap; // Table des alias pour les événements
        this._dispatchAllEvents = options.dispatchAllEvents || false; // Nouvelle option pour activer le dispatch de tous les événements

        const proxy = new Proxy(instance, {
            get: (target, propKey) => {
                const originalMethod = target[propKey];
                const now = new Date();
                const formattedTime = `${now.toLocaleTimeString('fr-FR')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

                if (typeof originalMethod === 'function') {
                    return (...args) => {
                        const constructorName =
                            target.constructor && target.constructor.name ? target.constructor.name :
                                (Object.getPrototypeOf(target) ?
                                    Object.getPrototypeOf(target).constructor.name : 'unknown');


                        const result = originalMethod.apply(target, args);

                        if ( !['symbol'].includes(propKey) && !['Array', 'Date'].includes(constructorName)) {
                            // Déclenche un événement après l'exécution de la méthode
                            const eventName = `${constructorName}.${propKey}`;
                            if (this._debugMode){
                                console.group(`[${formattedTime}] ${this._selector}.${constructorName}.${propKey}`);
                            }
                            // Vérifie si l'événement doit être dispatché, même si il n'est pas dans eventAliasMap
                            if (this._dispatchAllEvents || this._eventAliasMap[eventName]) {
                                this.dispatchEvent(this._resolveAlias(eventName), { args, result });
                                console.log('event triggered: ' + this._resolveAlias(eventName))
                            }
                            if (this._debugMode){
                                console.groupEnd();
                            }

                        }

                        return result;
                    };
                }

                // Si c'est un objet (par ex. un autre service), on applique DebugService
                if (originalMethod && typeof originalMethod === 'object') {
                    return new ProxyService(originalMethod, this._options);
                }

                return originalMethod;
            },
        });

        // Lier toutes les méthodes au Proxy : ex. this.method
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(instance) || {})) {
            if (typeof instance[key] === 'function' && key !== 'constructor') {
                instance[key] = instance[key].bind(proxy);
            }
        }

        return proxy;
    }

    // Gestion des événements

    /**
     * Ajoute un écouteur pour un événement spécifique.
     * @param {string} event - Le nom de l'événement.
     * @param {function} callback - La fonction à exécuter.
     */
    addEventListener(event, callback) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    }

    /**
     * Supprime un écouteur pour un événement spécifique.
     * @param {string} event - Le nom de l'événement.
     * @param {function} callback - La fonction à supprimer.
     */
    removeEventListener(event, callback) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter((listener) => listener !== callback);
    }

    /**
     * Déclenche un événement avec des données.
     * @param {string} event - Le nom de l'événement.
     * @param {object} data - Les données à passer aux écouteurs.
     */
    dispatchEvent(event, data) {
        // Créer un événement personnalisé avec les données passées
        const customEvent = new CustomEvent(event, {
            detail: data, // Les données associées à l'événement
            bubbles: true, // Permet à l'événement de remonter dans la hiérarchie DOM
            cancelable: true // L'événement peut être annulé
        });

        // Déclencher l'événement sur le document
        document.dispatchEvent(customEvent);

        // Appeler les écouteurs locaux
        if (this._listeners[event]) {
            this._listeners[event].forEach((callback) => callback(data));
        }
    }


    /**
     * Définit un alias pour un événement.
     * @param {string} event - Le nom original de l'événement.
     * @param {string} alias - L'alias pour l'événement.
     */
    setEventAlias(event, alias) {
        this._eventAliasMap[event] = alias;
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
