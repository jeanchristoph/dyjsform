export default class DebugService {
    constructor(instance, options = []) {
        const proxy = new Proxy(instance, {

            get(target, propKey) {
                const originalMethod = target[propKey];
                const now = new Date();
                const formattedTime = `${now.toLocaleTimeString('fr-FR')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

                if (typeof originalMethod === 'function') {
                    return function (...args) {
                        const constructorName =
                            target.constructor && target.constructor.name ? target.constructor.name :
                            (Object.getPrototypeOf(target) ?
                                Object.getPrototypeOf(target).constructor.name : 'unknown');

                        if (['symbol'].includes(propKey) ) {
                            // Ne pas loguer les symbol
                            // console.log(`[${formattedTime}] ${target.constructor.name} -> ${String(propKey)}() `);
                        } else if  (['Array','Date'].includes(constructorName) ) {
                            // Ne pas loguer les Date & Array
                        }
                        else {
                            console.log(`[${formattedTime}] ${constructorName } -> ${propKey}()`);
                        }

                        return originalMethod.apply(target, args); // Utilise le proxy pour capturer les appels internes
                    };
                }

                // Si c'est un objet (par ex. un autre service), on applique DebugService
                if (originalMethod && typeof originalMethod === 'object' ) {
                    return new DebugService(originalMethod);
                }

                return originalMethod;
            }
        });

        // Lier toutes les méthodes au Proxy
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(instance) || {})) {
            if (typeof instance[key] === 'function' && key !== 'constructor') {
                instance[key] = instance[key].bind(proxy);
            }
        }

        return proxy;
    }
}
