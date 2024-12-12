export default class OptionDTO {
    /**
     * Représente une option individuelle pour une entité.
     * @param {string} name - Le nom affiché de l'option.
     * @param {string} value - La valeur associée à l'option.
     * @param {number|null} maxCount - Le nombre maximal (facultatif) d'utilisation de cette option.
     */
    constructor({name, value, maxCount = null}) {
        this.name = name;
        this.value = value;
        this.maxCount = maxCount; // Nombre maximal (si applicable)
    }

    /**
     * Convertit l'objet OptionDTO en un objet simple.
     * @returns {Object} - Représentation JSON de l'option.
     */
    toJSON() {
        return {
            name: this.name,
            value: this.value,
            maxCount: this.maxCount
        };
    }
}
