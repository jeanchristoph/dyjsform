export default class ValidatorService {
    /**
     * Vérifie que les valeurs des options ayant une propriété maxCount ne dépassent pas leur limite.
     * @param {Array} json - Données JSON à valider, contenant des rows d'entités.
     * @returns {Object} - Résultat de la validation.
     *                    - { valid: boolean, errors: Array }.
     */
    static validateMaxCount(json) {
        const valueOccurrences = {};

        // Méthode utilitaire pour enregistrer les occurrences
        const addOccurrence = (entityName, label, value, maxCount, rowIndex) => {
            const key = `${entityName}:${value}`;

            if (!valueOccurrences[key]) {
                valueOccurrences[key] = {
                    entityName,
                    label,
                    value,
                    maxCount,
                    occurrences: [],
                };
            }

            valueOccurrences[key].occurrences.push({
                rowIndex,
                name: entityName,
            });
        };

        // Parcourir chaque row d'entités
        json.forEach((row, rowIndex) => {
            row.forEach((entity) => {
                if (entity.htmlElement === "select" && Array.isArray(entity.options)) {
                    const selectedOption = entity.options.find(opt => opt.value === entity.value);
                    if (selectedOption && selectedOption.maxCount !== null) {
                        addOccurrence(
                            entity.name,
                            selectedOption.name,
                            selectedOption.value,
                            selectedOption.maxCount,
                            rowIndex
                        );
                    }
                } else if (entity.htmlElement === "input" && entity.maxCount !== null) {
                    addOccurrence(
                        entity.name,
                        entity.label || entity.name,
                        entity.value,
                        entity.maxCount,
                        rowIndex
                    );
                }
            });
        });

        // Vérifier les conflits par rapport à maxCount
        const errors = Object.values(valueOccurrences).reduce((acc, data) => {
            const { maxCount, occurrences, entityName, label, value } = data;

            if (occurrences.length > maxCount) {
                acc.push({
                    entityName,
                    label,
                    value,
                    maxCount,
                    occurrences,
                    message: `"${label}" ne peut pas être renseignée plus de ${maxCount} fois.`,
                });
            }

            return acc;
        }, []);

        // Retourner le résultat
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
