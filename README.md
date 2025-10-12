# DyJsForm

Un générateur de formulaires dynamiques en JavaScript vanilla, simple d'utilisation et moderne.

## Caractéristiques

- Création dynamique de formulaires
- Gestion des entrées multiples
- Validation des données
- Export au format JSON
- Sans dépendance de framework (sauf Bootstrap 5 pour le style)
- Support des événements personnalisés

## Installation

1. Ajoutez Bootstrap 5 à votre projet :
```
html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
```
2. Importez DyJsForm :
```
javascript
import DyJsForm from './DyJsForm.js';
```
## Guide rapide

### 1. Créez un conteneur HTML
```
html
<textarea id="dyjsform"></textarea>
```
### 2. Initialisez le formulaire
```
javascript
const dyjsform = new DyJsForm('#dyjsform', {
    debugMode: false,
    rawOutput: false
});
```
### 3. Configurez vos champs
```
javascript
dyjsform.entity = [
    {
        htmlElement: 'input',
        type: 'text',
        name: 'username',
        label: 'Nom d'utilisateur',
        className: 'form-control'
    },
    // Ajoutez d'autres champs selon vos besoins
];
```
### 4. Lancez l'initialisation
```
javascript
dyjsform.init();
```
## Types de champs disponibles

- `input`: text, number, password
- `select`
- `textarea`
- `button`

## Options de configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| debugMode | boolean | false | Active les logs de debug |
| rawOutput | boolean | false | Format brut pour la sortie JSON |
| selector | string | '#dyjsform' | Sélecteur du conteneur |

## Événements
```
javascript
document.addEventListener('DyJsForm.refreshForm', (data) => {
    console.log('Formulaire mis à jour:', data);
});
```
## Structure des données

### Format d'entrée
```
javascript
{
    htmlElement: string,    // Type d'élément HTML
    type: string,          // Type pour les inputs
    name: string,          // Nom du champ
    label: string,         // Label du champ
    value: string,         // Valeur par défaut
    className: string,     // Classes CSS
    options: array,        // Options pour les selects
    maxCount: number       // Nombre maximum d'occurrences
}
```
### Format de sortie
Les données sont exportées au format JSON avec la structure suivante :
```
json
[
    {
        "field1": "value1",
        "field2": "value2"
    },
    // ... autres entrées
]
```
## Fonctionnalités à venir

- Système de tooltips pour les erreurs
- Mode formulaire simple sans bouton d'ajout
- Bouton de soumission configurable
- Actions POST AJAX/PHP
- Version sans dépendance Bootstrap
- Système d'événements étendu (preEdit, postEdit)
- Validation personnalisable
- Manipulation avancée des lignes et colonnes

## Contribution

Les contributions sont les bienvenues. Veuillez suivre ces étapes :
1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## Auteur

Jean-Christophe Malaval

## Licence

[À définir]
```