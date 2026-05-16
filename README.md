# DyJsForm

Formulaire dynamique JavaScript orienté objet.  
Permet de générer, afficher et sérialiser des formulaires tabulaires dynamiques (ajout/suppression de lignes) à partir d'une définition d'entité JSON.

---

## Architecture

```
DyJsForm.js              — Classe principale (point d'entrée)
contract/
  dto/
    EntityDTO.js         — Modèle d'un champ (colonne)
    OptionDTO.js         — Modèle d'une option de select / checkbox
  interface/
    ITemplate.js         — Interface de base des templates (contrat + _escapeHtml)
service/
  JsonService.js         — Sérialisation / désérialisation JSON
  TemplateService.js     — Rendu HTML (layout + lignes + injection CSS)
  ProxyService.js        — Proxy ES6 pour interception des setters
  ValidatorService.js    — Validation des contraintes (maxCount…)
  ResizeObserverService.js — Adaptation responsive
  EventService.js        — Gestion des événements custom
  DebugService.js        — Logs de débogage
Template/
  classic/
    Classic.js           — Template classique (blocs flex)
    Classic.css          — CSS du template Classic
  bs5/
    Bs5.js               — Template Bootstrap 5 (colonnes col-md-*)
    Bs5.css              — CSS du template Bs5
  table/
    Table.js             — Template tableau HTML (défaut)
    Table.css            — CSS du template Table
event/
  formEvents.js          — Utilitaires d'événements DOM (hide, scroll, modal, autoGrow…)
config/
  eventAliasMap.js       — Alias d'événements internes
  version.js             — Timestamp partagé pour le cache-busting (unique par page)
```

---

## Utilisation de base

```html
<textarea id="monFormulaire"></textarea>
```

```js
const { default: DyJsForm } = await import('/media/com_topweb/js/plugins/dyjsform/DyJsForm.js');

let form = new DyJsForm('#monFormulaire');
form.template = 'table';
form.entity = [
    { htmlElement: 'input', type: 'text', name: 'nom',    label: 'Nom',    flex: '2' },
    { htmlElement: 'input', type: 'text', name: 'valeur', label: 'Valeur', flex: '1' },
    {
        htmlElement: 'button', type: 'button',
        name: 'dyjsform_action_remove',
        content: '<i class="fas fa-trash"></i>',
        className: 'btn btn-danger btn-sm',
        label: 'Suppr.', flex: '0.5'
    },
];
await form.init();
```

La valeur sérialisée (JSON) est écrite automatiquement dans le `<textarea>` à chaque modification.

---

## Définition d'un champ (`EntityDTO`)

| Propriété      | Type     | Description |
|----------------|----------|-------------|
| `htmlElement`  | string   | `input`, `select`, `textarea`, `button` |
| `type`         | string   | Attribut `type` HTML (`text`, `number`, `checkbox`…) |
| `name`         | string   | Identifiant unique du champ (clé JSON) |
| `label`        | string   | Libellé affiché en en-tête de colonne |
| `value`        | string   | Valeur sélectionnée / cochée par défaut |
| `options`      | array    | `[{ name, value }]` — pour les `select` et les `checkbox` |
| `placeholder`  | string   | Texte de l'option vide d'un `select` (valeur `""`) |
| `flex`         | number   | Largeur relative de la colonne (défaut `1`) |
| `className`    | string   | Classes CSS additionnelles sur l'input |
| `attr`         | string   | Attributs HTML bruts (ex: `style="height:80px"`) |
| `maxCount`     | number   | Nombre maximum d'occurrences identiques autorisées |
| `stackWith`    | string   | Nom du champ parent — empile ce champ dans la même cellule |
| `content`      | string   | Contenu HTML interne (pour les `button`) |
| `error`        | string   | Message d'erreur (géré par `ValidatorService`) |

### Champ action interne

Un champ dont le `name` commence par `dyjsform_action_` est un bouton d'action interne (ex: `dyjsform_action_remove`). Il n'est pas sérialisé dans le JSON de sortie.

---

## Champs `select`

```js
{
    htmlElement: 'select', name: 'statut', label: 'Statut',
    placeholder: 'Choisir…',
    options: [
        { value: 'actif',   name: 'Actif' },
        { value: 'inactif', name: 'Inactif' },
    ]
}
```

`placeholder` est affiché comme première option non sélectionnable (valeur `""`).

---

## Champs `checkbox`

Les checkboxes utilisent le même système `options` que les selects.  
`value` doit correspondre à la valeur d'une option pour la pré-cocher.

```js
{
    htmlElement: 'input', type: 'checkbox', name: 'actif', label: 'Actif',
    options: [{ value: '1' }],
    value: ''       // décoché par défaut
}
```

```js
{
    htmlElement: 'input', type: 'checkbox', name: 'actif', label: 'Actif',
    options: [{ value: '1', name: 'Oui' }],
    value: '1'      // pré-coché
}
```

La valeur sérialisée est la `value` de l'option si cochée, `''` si décochée.

---

## Champs empilés (`stackWith`)

Permet d'afficher deux champs dans la même cellule, l'un sous l'autre.

```js
form.entity = [
    { htmlElement: 'select', name: 'action',  label: 'Action',   flex: '1', options: [...] },
    { htmlElement: 'input',  name: 'action2', label: 'Action 2', stackWith: 'action', flex: '0' },
];
```

- Le champ avec `stackWith` est rendu à l'intérieur de la cellule du champ parent.
- `flex: '0'` est obligatoire — le champ empilé ne prend pas de colonne propre.
- Les deux champs sont sérialisés indépendamment dans le JSON de sortie.
- Le template reçoit le sous-champ via `getField(field, rowIndex, subField)`.

---

## Format JSON de sortie

Tableau d'objets plats, une entrée par ligne :

```json
[
  { "nom": "Libellé Q1", "valeur": "42" },
  { "nom": "Libellé Q2", "valeur": "7"  }
]
```

---

## Nommage des champs réservés

| Préfixe / nom                | Usage |
|------------------------------|-------|
| `dyjsform_action_remove`     | Bouton suppression de ligne |
| `dyjsform_action_add`        | Bouton ajout de ligne (rendu par le template) |
| `num`                        | Numéro de ligne auto-incrémenté (rendu spécial) |

Les champs non internes reçoivent la classe CSS `dyjsform_field_{name}` dans le DOM.

---

## Templates disponibles

| Nom       | Description |
|-----------|-------------|
| `table`   | Rendu en tableau HTML — **recommandé** |
| `classic` | Rendu en blocs flex empilés |
| `bs5`     | Rendu Bootstrap 5 en colonnes `col-md-*` |

Sélection : `form.template = 'table';` (avant `init()`).

Le CSS de chaque template est injecté via une balise `<link>` externe au premier chargement.  
La déduplication est faite par template (`data-dyjsform-stylesheet="{templateName}"`).

### Ajouter un template

1. Créer `Template/montemplate/MonTemplate.js` qui étend `ITemplate` et implémente `getBegin()`, `getEnd()`, `getForm()`, `getField(field, rowIndex, subField)`.
2. Créer `Template/montemplate/MonTemplate.css` pour les styles associés.
3. Utiliser `form.template = 'montemplate';`.

L'interface `ITemplate` est dans `contract/interface/ITemplate.js`.

---

## Cache-busting

Tous les imports dynamiques internes utilisent un timestamp partagé issu de `config/version.js` :

```js
// config/version.js — exécuté une seule fois par page
export const CACHE_VERSION = Date.now();
```

Ce mécanisme garantit que :
- Chaque fichier est chargé avec une URL unique par session (`?v=<timestamp>`), évitant les fichiers périmés en cache navigateur.
- Un seul `Date.now()` est évalué par page, même si plusieurs instances de DyJsForm coexistent — pas de double chargement des modules.

**À l'appel**, utiliser un timestamp partagé entre toutes les instances :

```js
const DYJSFORM_VERSION = Date.now(); // défini une fois, hors des fonctions async

const { default: DyJsForm } = await import(`/media/com_topweb/js/plugins/dyjsform/DyJsForm.js?v=${DYJSFORM_VERSION}`);
```

---

## Événements

Deux événements sont émis sur le `document` par le formulaire `#selector` :

| Événement                    | Déclencheur |
|------------------------------|-------------|
| `#selector.refresh`          | Après chaque re-rendu (ajout/suppression de ligne) |
| `#selector.inputResized`     | Après un redimensionnement détecté par `ResizeObserver` |

```js
document.addEventListener('#monFormulaire.refresh', () => {
    // ex: recalculer des hauteurs d'accordéon
});
```

---

## Utilitaires DOM (`event/formEvents.js`)

Fonctions exportées utilisables indépendamment de DyJsForm :

| Fonction | Description |
|----------|-------------|
| `inputHide(input, el)` | Affiche/masque `el` selon l'état de `input` (checkbox, radio, number, text) |
| `CheckboxEmptyValueCheck(checkbox, input, event, msg)` | Bloque une checkbox si un input associé est vide |
| `scrollToLast(selector, timer)` | Défile jusqu'au dernier enfant du sélecteur |
| `checkboxReadonly(checkbox, input, checked)` | Rend un input readonly/disabled selon l'état d'une checkbox |
| `createModal(selector)` | Crée et affiche un modal Bootstrap |
| `toggleModal(selector)` | Bascule l'affichage d'un modal Bootstrap existant |
| `resizeAccordeonContents()` | Recalcule la hauteur des panneaux d'accordéon actifs |
| `autoGrow(oField)` | Agrandit automatiquement un textarea selon son contenu |