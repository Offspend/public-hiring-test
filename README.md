# Introduction
---
Ce document représente le "rapport" du [test technique greenly](https://github.com/Offspend/public-hiring-test), destiné à l'évaluateur technique du test.
# Rapport d'Implémentation
---
## Énoncé
When working on the following exercise, in addition to answering the product need, to give particular attention to the following points:
- Readability
- Maintainability
- Unit testing
- Handling of corner cases
- Error-handling

We want to compute the Agrybalise carbonfootprint of a foodproduct (e.g.: a hamCheesePizza) that we characterize by its ingredients as shown below

The calculation of the Agrybalise carbon footprint can be described as below:
- The Agrybalise carbon footprint of one ingredient is obtained by multiplying the quantity of the ingredient by the emission of a matching emission factor (same name and same unit).
- The carbon footprint of the food product is then obtained by summing the carbon footprint of all ingredients.
- If the carbon footprint of one ingredient cannot be calculated, then the carbon footprint of the whole product is set to null.

The tasks of this exercice are as follows:
1/ Implement the carbon footprint calculation of a product and persist the results in database.
2/ Implement a GET endpoint to retrieve the result.
3/ Implement a POST endpoint to trigger the calculation and the saving in the database.
## Réalisations
### 1. Calcul et Persistance de l'Empreinte Carbone
#### Structure de Données
- Ajout de 2 entités principales :
  - `CarbonEmissionRecipe` : Représentation des recettes
  - `RecipeIngredient` : Association entre recettes et facteurs d'émission
#### Logique de Calcul
- Implémentation dans `CarbonEmissionRecipeService`
- Gestion des conversions d'unités
- Validation des données avec retour null si conversion impossible
- Tests unitaires complets pour différents scénarios
### 2. API REST
#### Endpoints Implémentés
- `GET /carbon-emission-recipes` : Liste toutes les recettes
- `GET /carbon-emission-recipes/:id` : Récupère une recette spécifique
- `POST /carbon-emission-recipes/:id/calculate` : Déclenche le calcul et la sauvegarde
### 3. Validation et Gestion des Erreurs
- Validation des entités avec décorateurs TypeORM
- Gestion des cas d'erreur :
  - Unités inconnues
  - Recettes non trouvées
  - Données invalides
### 4. Tests
- Tests unitaires pour les entités
- Tests des services avec différents scénarios
- Tests de validation des données
## Améliorations Possibles
- Ajout d'un endpoint POST pour créer de nouvelles recettes
- Rendre le nom d'un ingrédient unique 
- Mettre à jour le package.json (problème avec la destination du fichier de migration)
- Ajout d'un logger personnalisé
- Nom des variables qui ne sont pas explicites (par exemple value à la place de quantity pour les recettes)
- Créer une énumération pour les unités
	- La conversion est uniquement entre g/kg. 
- Validation des données d'entrées pour la création d'une recette
- Ajouts de docstring


