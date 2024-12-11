import OptionDTO from './OptionDTO.js';
export default class EntityDTO {
    constructor({htmlElement, type, name, label, value, content, className, options}) {
        this.htmlElement = htmlElement || ''; // Type de l'élément HTML (e.g., 'select')
        this.type = type || ''; // Type additionnel (si applicable)
        this.name = name || ''; // Nom de l'élément
        this.label = label || ''; // Libellé de l'élément
        this.value = value || ''; // Valeur sélectionnée
        this.content = content || ''; // Contenu éventuel de l'élément
        this.className = className || ''; // Classe CSS
        this.options = Array.isArray(options) ? options.map(opt => new OptionDTO(opt)) : []; // Liste d'options
    }

    toJSON() {
        return {
            htmlElement: this.htmlElement,
            type: this.type,
            name: this.name,
            label: this.label,
            value: this.value,
            content: this.content,
            className: this.className
        };
    }
}