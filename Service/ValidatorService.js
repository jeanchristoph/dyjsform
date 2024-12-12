export default class ValidatorService {
    /**
     * Vérifie que les valeurs des options ayant une propriété maxCount ne dépassent pas leur limite.
     * @param {Array} json - Données JSON à valider, contenant des row d'entités.
     * @returns {Object} - Résultat de la validation.
     *                    - { valid: boolean, errors: Array }.
     */
    static validateMaxCount(json) {
        // Stocker les occurrences des valeurs maxCount par entity.name et value
        const valueOccurrences = {};

        // Parcourir chaque row d'entités
        json.forEach((row, rowIndex) => {
            row.forEach((entity) => {
                // Ne traiter que les entités de type 'select' avec des options
                if (entity.htmlElement === "select" && Array.isArray(entity.options)) {
                    // Trouver l'option sélectionnée dans ce select
                    const selectedOption = entity.options.find(opt => opt.value === entity.value);

                    if (selectedOption && selectedOption.maxCount !== null) {
                        const { value, maxCount } = selectedOption;

                        // Identifier clé unique par entity.name et value
                        const key = `${entity.name}:${value}`;

                        // Enregistrer les occurrences par clé
                        if (!valueOccurrences[key]) {
                            valueOccurrences[key] = {
                                entityName: entity.name,
                                value,
                                maxCount,
                                occurrences: []
                            };
                        }

                        valueOccurrences[key].occurrences.push({
                            rowIndex,
                            name: entity.name
                        });
                    }
                }
            });
        });

        // Vérifier les conflits par rapport à maxCount
        const errors = [];
        for (const [key, data] of Object.entries(valueOccurrences)) {
            const { maxCount, occurrences, entityName, value } = data;

            if (occurrences.length > maxCount) {
                errors.push({
                    entityName,
                    value,
                    maxCount,
                    occurrences,
                    message: `Pour "${entityName}", la valeur "${value}" ayant maxCount = ${maxCount} est utilisée ${occurrences.length} fois, ce qui dépasse la limite.`
                });
            }
        }

        // Retourner le résultat
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
