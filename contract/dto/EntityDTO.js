import { CACHE_VERSION } from '../../config/version.js';
const OptionDTO = (await import(`./OptionDTO.js?v=${CACHE_VERSION}`)).default;

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
     * @param {string} param.attr - attr de l'élément.
     * @param {string} param.maxCount - maxCount de l'élément.
     * @param {Array} param.options - Liste des options de l'élément (si applicable).
     */
    constructor({htmlElement, type, name, label, value, content, className, attr, maxCount, options, error, flex, stackWith, placeholder}) {
        this.htmlElement = htmlElement || ''; // Type de l'élément HTML (e.g., 'select')
        this.type        = type        || ''; // Type additionnel (si applicable)
        this.name        = name        || ''; // Nom de l'élément
        this.label       = label       || ''; // Libellé de l'élément
        this.value       = value       || ''; // Valeur sélectionnée
        this.content     = content     || ''; // Contenu éventuel de l'élément
        this.className   = className   || ''; // Classe CSS
        this.attr        = attr        || ''; // Attribut html complémentaire
        this.maxCount    = maxCount    || ''; // maxCount
        this.options     = Array.isArray(options) ? options.map(opt => new OptionDTO(opt)) : []; // Liste d'options, chaque option est une instance de OptionDTO
        this.error       = error       || ''; // L'erreur remontée par ValidatorService
        this.flex        = parseFloat(flex) || 1; // Valeur par défaut à 1 si non spécifié
        this.stackWith   = stackWith   || ''; // Nom du champ parent dans lequel s'empiler visuellement
        this.placeholder = placeholder || ''; // Texte placeholder pour les select
    }

    toJSON() {
        return {
            htmlElement: this.htmlElement,
            type:        this.type,
            name:        this.name,
            label:       this.label,
            value:       this.value,
            content:     this.content,
            className:   this.className,
            attr:        this.attr,
            maxCount:    this.maxCount,
            options:     this.options,
            error:       this.error,
            flex:        this.flex,
            stackWith:   this.stackWith,
            placeholder: this.placeholder
        };
    }
}
