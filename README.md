## Convertisseur de salaire pour l'intérim ##

Ce site permet de réaliser des simulations de salaire dans le cadre de l'intérim.
Il est constitué uniquement d'un front end.

## Types de rémunérations ##

- Salaire de base
- IFM : Indemnités de Fin de Mission, correspond à 10% du salaire de base hors primes
- CP : Congés Payés, correspond à 10% du salaire de base hors primes et 10% des IFM

## Détails techniques ##

- La fonction convertFunction() permet de calculer les éléments de rémunération en
récupérant la valeur de chaque input
- Des eventListeners dans chaque input invoquent cette fonction à chaque changement
provenant de l'utilisateur
- Le point et la virgule sont interprétés comme séparateur de décimales
- Les valeurs nulles sont remplacées par 0
- Certains inputs apparaissent uniquement lorsque les options sont égales à "Oui"
