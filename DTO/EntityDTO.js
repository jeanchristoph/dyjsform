import OptionDTO from './OptionDTO.js';
export default class EntityDTO {
    /**
     * Représente une entité pour un formulaire HTML.
     * @param {Object} param - Les paramètres d'initialisation de l'entité.
     * @param {string} param.htmlElement - Type de l'élément HTML (e.g., 'select').
     * @param {string} param.type - Type additionnel (si applicable).
     * @param {string} param.name - Nom de l'élément.
     * @param {string} param.label - Libellé de l'élément.
     * @param {string} param.value - Valeur sélectionnée de l'élément.
     * @param {string} param.content - Contenu de l'élément (si applicable).
     * @param {string} param.className - Classe CSS de l'élément.
     * @param {Array} param.options - Liste des options de l'élément (si applicable).
     */
    constructor({htmlElement, type, name, label, value, content, className, options}) {
        this.htmlElement = htmlElement || ''; // Type de l'élément HTML (e.g., 'select')
        this.type = type || ''; // Type additionnel (si applicable)
        this.name = name || ''; // Nom de l'élément
        this.label = label || ''; // Libellé de l'élément
        this.value = value || ''; // Valeur sélectionnée
        this.content = content || ''; // Contenu éventuel de l'élément
        this.className = className || ''; // Classe CSS
        this.options = Array.isArray(options) ? options.map(opt => new OptionDTO(opt)) : []; // Liste d'options, chaque option est une instance de OptionDTO
    }

    /**
     * Convertit l'objet EntityDTO en un objet simple.
     * @returns {Object} - Représentation JSON de l'entité avec ses propriétés.
     */
    toJSON() {
        return {
            htmlElement: this.htmlElement,
            type: this.type,
            name: this.name,
            label: this.label,
            value: this.value,
            content: this.content,
            className: this.className,
            options: this.options // Inclut les options sous forme d'un tableau d'objets OptionDTO
        };
    }
}