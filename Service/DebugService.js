export default class DebugService {
    constructor(instance) {
        const proxy = new Proxy(instance, {
            get(target, propKey) {
                const originalMethod = target[propKey];

                if (typeof originalMethod === 'function') {
                    return function (...args) {
                        console.log(`Function: ${propKey}`);
                        return originalMethod.apply(proxy, args); // Utilise le proxy pour capturer les appels internes
                    };
                }

                return originalMethod;
            }
        });

        // Lier toutes les méthodes au Proxy
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
            if (typeof instance[key] === 'function' && key !== 'constructor') {
                instance[key] = instance[key].bind(proxy);
            }
        }

        return proxy;
    }
}
