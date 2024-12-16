import EventService from "./EventService.js";

export default class ProxyService {
    constructor(instance, options = {}) {
        this._instance = instance;
        this._options = options;
        this._debugMode = options.debugMode || false;
        this._selector = options.selector || '#dyjsform';
        this._eventService = new EventService(options);

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
                            this._debugMode && console.log(`[${formattedTime}] ${this._selector}.${constructorName}.${propKey}`);
                            this._eventService.dispatchEvent(eventName, { args, result });
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

}
