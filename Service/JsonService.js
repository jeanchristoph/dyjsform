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
                this._json.map(row =>

                    row.filter(field => !field.name.startsWith('dyjsform_action_'))
                )
            )
        );
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

    populateJson(json) {
        // Vérifiez si json a plus de lignes que this._json
        while (this._json.length < json.length) {
            // Ajoutez une copie de la dernière ligne de this._json avec les valeurs vides
            const templateRow = this._json[this._json.length - 1].map(field => ({
                ...field,
                value: ''
            }));
            this._json.push(templateRow);
        }

        // Mettez à jour les valeurs à partir de json
        this._json = this._json.map((row, rowIndex) => {
            if (json[rowIndex]) {
                return row.map(field => {
                    const correspondingField = json[rowIndex].find(f => f.name === field.name);
                    return correspondingField
                        ? { ...field, value: correspondingField.value }
                        : field;
                });
            }
            return row;
        });
    }




// Charger le JSON à l'affichage de la page et générer les entitys
    loadJson() {
        let entitiesArray = [];
        let entityArray = [];
        if (document.querySelector('#dyjsform_options') ){
            const jsonString = document.querySelector('#dyjsform_options').value;
            if (jsonString) {
                try {
                    const jsonString = document.querySelector('#dyjsform_options').value;

                    // if (jsonString) {
                    //     try {
                    //         const jsonData = JSON.parse(jsonString);
                    //         var entityClone = null;
                    //         jsonData.forEach((jsonValues) =>  {
                    //             entityClone = JSON.parse(JSON.stringify(this._entity));
                    //             entityClone.forEach(entity => {
                    //                 for (let jsonName in jsonValues) {
                    //                     if (entity.name === jsonName) {
                    //                         entity.value = jsonValues[jsonName];
                    //                     }
                    //                 }
                    //
                    //             });
                    //             entityArray.push(entityClone)
                    //         });
                    //     } catch (error) {
                    //         console.error("Erreur lors de l'analyse du JSON : ", error);
                    //     }
                    // }
                } catch (error) {
                    console.error("Erreur lors de l'analyse du JSON : ", error);
                }
            }
        }
        return entityArray;

    }


    updateJsonByField(rowNumber,fieldName, value) {
        let json = this.json;
        let result = {'success': true, 'errors': null}
        console.log(json);

        json[rowNumber].forEach((element, index)=> {
            if (element.name === fieldName){
                element.value = value;
                const validationResult = ValidatorService.validateMaxCount(json);
                if (validationResult.valid) {
                    console.log("Validation réussie : Aucun conflit détecté.");
                } else {
                    element.value = '';
                    console.log(validationResult);
                    this.displayError(validationResult);
                    //TODO ne fonctione pas car le json pris dans displayError est celui d'avant la modif : element.value = '';
                    result.success = false;
                    result.errors = validationResult.errors;
                }
            }
        })
        if (result.success){
            this.json = json
            this.errorClean();
        }
        console.log(this.json);
        return result;
    }

    displayError (validationResult) {
        this.errorClean();
        let json = this.json;
        validationResult.errors.map(
            errorGroup => errorGroup.occurrences.map(
                error => {
                    json[error.rowIndex].find(entity => entity.name === error.name).error = errorGroup.message;
                    console.log(error.rowIndex + ',' + error.name)
                }
            )
        )
        this.json = json
    }


    errorClean() {
        let json = this.json;
        json.map(row => row.map(entity => entity.error = ''));
        this.json = json
    }

}
