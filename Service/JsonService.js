import ValidatorService from "./ValidatorService.js";

export default class JsonService {
    constructor(isOutputKeyValue = true) {
        this._json = [];
        this._isOutputKeyValue = isOutputKeyValue;
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

    reduceByNameValue (json){
        var reducedJson =[];
        for (const row of json){
            let rowJson = [];
            for (let field of row) {
                rowJson.push( { [field['name']] : field['value'] });
            }
            reducedJson.push(rowJson);
        }
        return reducedJson;
    }

    loadOutputJson(outputJson) {
        let json = this.json;

        if (!this._isOutputKeyValue){
            this.json = outputJson;
        } else {
            this.json = this.convertKeyValueJson(outputJson, json);
        }
        return this;
    }

    convertKeyValueJson (KeyValueJson, jsonPattern) {
        // Vérifiez si json a plus de lignes que this._json
        while (jsonPattern.length < KeyValueJson.length) {
            // Ajoutez une copie de la dernière ligne de this._json avec les valeurs vides
            const templateRow = jsonPattern[jsonPattern.length - 1].map(field => ({
                ...field,
                value: ''
            }));
            jsonPattern.push(templateRow);
        }

        //Mettez à jour les valeurs à partir de json
        const updatedJson = jsonPattern.map((row, rowIndex) => {
            return row.map((field, fieldIndex) => {
                // Créez une copie de l'objet field avant de le modifier
                const newField = { ...field };

                if (!newField.name.startsWith('dyjsform_action_')) {
                    // Obtenez la première clé de l'objet (par exemple, "name_number")
                    const fieldKey = Object.keys(KeyValueJson[rowIndex][fieldIndex]);
                    const outputJsonValue =
                        Object.keys(KeyValueJson[rowIndex][fieldIndex]).find(key => key === newField.name) ?
                            KeyValueJson[rowIndex][fieldIndex][newField.name] :
                            '';

                    // Assignez la valeur sans modifier l'objet original
                    newField.value = outputJsonValue;
                }

                // Retourne la copie modifiée, sans toucher à l'original
                return newField;
            });
        });

        return updatedJson;
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
            console.log("Validation réussie : Aucun conflit détecté.");
            return { success: true, errors: null };
        } else {
            console.log("Validation échouée :", validationResult);
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
        if (!this._isOutputKeyValue){
            output = this.json;
        }
        document.querySelector(selector + ' .output').value = JSON.stringify(output, null);
        return this;
    }

}
