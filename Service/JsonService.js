import { CACHE_VERSION } from '../config/version.js';
const ValidatorService = (await import(`./ValidatorService.js?v=${CACHE_VERSION}`)).default;

export default class JsonService {
    constructor(rawOutput = true) {
        this._json = [];
        this._rawOutput = rawOutput;
        this._keyValueJson = [];
    }

    get json() {
        //clonage profond pour éviter le passage par référence dans le json créé ensuite et les pbs d'updates
        return JSON.parse(JSON.stringify(this._json));
    }

    set json(json) {
        switch (typeof json) {
            case 'string':
                this._json = this.strToJson(json);
                break
            default:
                this._json = json;
                break;
        }
        this.keyValueJson = this.getJsonData();
    }

    get keyValueJson() {
        return this._keyValueJson;
    }

    set keyValueJson(json) {
        this._keyValueJson = this.reduceByNameValue(json);
    }

    removeAction(json) {
        json.map(row =>
            row.filter(field => !field.name.startsWith('dyjsform_action_'))
        )
        return json;
    }

    getJsonData(){
        //clonage profond pour éviter le passage par référence dans le json créé ensuite et les pbs d'updates
        return JSON.parse(
            JSON.stringify(
                // Créer un tableau filtré : pour enlever les boutons actions à l'interieur du tableau parent
                this.removeAction(this.json)
            )
        );
    }

    addRow (entity) {
        const updatedJson = this.json;
        updatedJson.push(entity);
        this.json = updatedJson;
        return this;
    }
    removeRow(rowNumber) {
        const updatedJson = this.json;
        // updatedJson.pop();
        updatedJson.splice(rowNumber, 1);
        this.json = updatedJson;
        return this;
    }

    strToJson(str) {
        try {
            return JSON.parse(str);
        } catch (error) {
            console.error("Erreur lors du parsing JSON :", error);
            return null; // Ou une valeur par défaut comme {}
        }
    }

    reduceByNameValue(json) {
        const filteredData = this._filterAndTransform(json); // Étape 1
        return this._reduceToFlatObjects(filteredData);      // Étape 2
    }

    _filterAndTransform(json) {
        return json.map(row =>
            row
                .filter(field => !field['name'].startsWith('dyjsform_action_'))
                .map(field => ({ [field['name']]: field['value'] }))
        );
    }

    _reduceToFlatObjects(filteredData) {
        return filteredData.map(row =>
            row.reduce((acc, obj) => Object.assign(acc, obj), {})
        );
    }


    loadOutputJson(outputJson) {
        let json = this.json;

        if (this._rawOutput){
            this.json = outputJson;
        } else {
            this.json = this.convertKeyValueJson(outputJson, json);
        }
        return this;
    }

    convertKeyValueJson(flatKeyValueJson, jsonPattern) {
        // Étape 1 : Ajout de lignes dynamiques si nécessaire
        while (flatKeyValueJson.length > jsonPattern.length) {
            const lastRow = jsonPattern[jsonPattern.length - 1];
            const newRow = lastRow.map(field => ({
                ...field,
                value: '' // Réinitialiser les valeurs
            }));
            jsonPattern.push(newRow);
        }

        // Étape 2 : Mise à jour des champs avec les valeurs de flatKeyValueJson
        return flatKeyValueJson.map((flatRow, rowIndex) => {
            // Si le modèle contient moins de champs que nécessaire, on le complète dynamiquement
            const patternRow = jsonPattern[rowIndex] || [];
            return patternRow.map(field => {
                // Copier chaque champ pour éviter de modifier directement l'objet original
                const newField = { ...field };

                // Assigner la valeur correspondante à partir du JSON plat
                if (!newField.name.startsWith('dyjsform_action_')) {
                    newField.value = flatRow[newField.name] || '';
                }

                return newField; // Retourne le champ mis à jour
            });
        });
    }



    updateJsonByField(rowIndex,fieldName, value) {
        let json = this.json;

        // Met à jour la valeur de l'entité spécifiée
        json[rowIndex].forEach(element => {
            if (element.name === fieldName){
                element.value = value;
            }
        });

        // Valide le JSON après modification
        const result = this.validate(json, rowIndex);

        if (result.success) {
            json = this.errorClean(json); // Nettoie les erreurs éventuelles
        } else {
            json = this.displayError(result, json, rowIndex); // Affiche les erreurs si validation échoue
        }
        this.json = json; // Met à jour l'état si tout est valide
        return result;
    }

    validate(json) {
        const validationResult = ValidatorService.maxCount(json);
        if (validationResult.valid) {
            // console.log("Validation réussie : Aucun conflit détecté.");
            return { success: true, errors: null };
        } else {
            console.log("Validation échouée :", validationResult.errors);
            return { success: false, errors: validationResult.errors };
        }
    }

    displayError (validationResult, json, rowIndex = null) {

        // Ajoute les erreurs au bon endroit dans le JSON
        if (rowIndex !== null) {
            validationResult.errors.forEach(errorGroup => {
                const error = errorGroup.occurrences.find(err => err.rowIndex === rowIndex);

                if (error) {
                    const entity = json[rowIndex].find(entity => entity.name === error.name);
                    if (entity) {
                        entity.error = errorGroup.message; // Ajoute le message d'erreur
                        entity.value = ''; // Ajoute le message d'erreur
                    }
                }
            });

        } else {
            validationResult.errors.forEach(errorGroup => {
                errorGroup.occurrences.forEach(error => {
                    const entity = json[error.rowIndex].find(ent => ent.name === error.name);
                    if (entity) {
                        entity.error = errorGroup.message;
                    }
                });
            });
        }
        return json;
    }


    errorClean(json) {
        //     json.map(row => row.map(entity => entity.error = ''));
        //     return json;
        json = json.map(row =>
            row.map(entity => ({ ...entity, error: '' })) // Réinitialise les erreurs sans modifier les références
        );
        return json;
    }

    // Fonction pour générer le JSON
    writeOutputJson(selector) {
        let output = this.keyValueJson;
        if (this._rawOutput){
            output = this.json;
        }
        document.querySelector(selector + ' .output').value = JSON.stringify(output, null);
        return this;
    }

}
