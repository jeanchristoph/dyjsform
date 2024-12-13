import ValidatorService from "./ValidatorService.js";

export default class JsonService {
    constructor() {
        this._json = [];
        this._outputJson = [];
        // this._validatorService = new ValidatorService();
    }


    get json() {
        //clonage profond pour éviter le passage par référence dans le json créé ensuite et les pbs d'updates
        return JSON.parse(JSON.stringify(this._json));
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

    removeAction(json) {
        json.map(row =>
            row.filter(field => !field.name.startsWith('dyjsform_action_'))
        )
        return json;
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
        this.outputJson = this.getJsonData();
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

    get outputJson() {
        return this._outputJson;
    }

    set outputJson(json) {
        this._outputJson = this.reduceByNameValue(json);
    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            console.error(e)
            return false;
        }
        return true;
    }

    jsonToStr(jsonObject){
        return JSON.stringify(jsonObject, null, 2)
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
        var ReducedJson =[];
        for (const row of json){
            let rowJson = [];
            for (let field of row) {
                rowJson.push( { [field['name']] : field['value'] });
            }
            ReducedJson.push(rowJson);
        }
        return ReducedJson;
    }

    loadReducedJson(outputJson) {
        let json = this.json;
        // Vérifiez si json a plus de lignes que this._json
        while (json.length < outputJson.length) {
            // Ajoutez une copie de la dernière ligne de this._json avec les valeurs vides
            const templateRow = json[json.length - 1].map(field => ({
                ...field,
                value: ''
            }));
            json.push(templateRow);
        }

        //Mettez à jour les valeurs à partir de json
        const updatedJson = json.map((row, rowIndex) => {
            return row.map((field, fieldIndex) => {
                // Créez une copie de l'objet field avant de le modifier
                const newField = { ...field };

                if (!newField.name.startsWith('dyjsform_action_')) {
                    // Obtenez la première clé de l'objet (par exemple, "name_number")
                    const fieldKey = Object.keys(outputJson[rowIndex][fieldIndex]);
                    const outputJsonValue =
                        Object.keys(outputJson[rowIndex][fieldIndex]).find(key => key === newField.name) ?
                            outputJson[rowIndex][fieldIndex][newField.name] :
                            '';

                    // Assignez la valeur sans modifier l'objet original
                    newField.value = outputJsonValue;
                }

                // Retourne la copie modifiée, sans toucher à l'original
                return newField;
            });
        });

        this.json = updatedJson;
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
        const validationResult = ValidatorService.validateMaxCount(json);
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
        json = json.map(row =>
            row.map(entity => ({ ...entity, error: '' })) // Réinitialise les erreurs sans modifier les références
        );
        return json;
    }


    // errorClean(json) {
    //     json.map(row => row.map(entity => entity.error = ''));
    //     return json;
    // }


}
