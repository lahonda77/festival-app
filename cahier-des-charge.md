# Exemple de cahier des charges techniques

- [Exemple de cahier des charges techniques](#exemple-de-cahier-des-charges-techniques)
  - [Produit](#produit)
  - [Equipe](#equipe)
  - [Stack](#stack)
  - [Bonnes pratiques](#bonnes-pratiques)
    - [Tests](#tests)
    - [Variable d'environnements](#variable-denvironnements)
    - [CI/CD](#cicd)
    - [Linter](#linter)
    - [Git](#git)
    - [Design Pattern](#design-pattern)
    - [Microservices](#microservices)
  - [Choix techniques](#choix-techniques)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Schéma de l'application](#schéma-de-lapplication)
  - [Schéma de la base de données](#schéma-de-la-base-de-données)
  - [Documentation API](#documentation-api)
  - [Outils gestion de projet](#outils-gestion-de-projet)

## Produit

Notre produit est un outil pédagogique d'aide pour apprendre le code.

## Equipe

Notre équipe est composée de :

- 2 développeurs front-end
- 2 développeurs back-end
- 1 lead-developpeur / devops

## Stack

Notre Stack technique est composée de :

- Frontend : [React]
- Backend : [NodeJS] - [Express] + [PHP] - [Symfony] [Symfony]
- BDD : [PostgreSQL] ([Prisma]) + [MongoDB] ([Mongoose])
- Ops : [Docker] + GitHub Actions

## Bonnes pratiques

- Nous utilisons une approche clean code.

### Tests

- Approche TDD
- Jest + Cypress + Puppeteer

### Variable d'environnements

### CI/CD

### Linter

### Git

### Design Pattern

### Microservices

## Choix techniques

### Frontend

Nos possibilités étaient :

- Front end Vanilla (HTML, CSS, JavaScript)
- [React]
- [Vue]
- [Next]
- [HTMX](https://htmx.org/)

<!-- Tableau markdown 5 lignes, 5 colonnes -->

| Nom | Connaissance | Envie | Documentation | Commentaires |
| --- | --- | --- | --- | --- |
| React | 4/5 | 4/5 | 4/5 | Connus par toute l'équipe |
| Vue | 2/5 | 5/5 | 4/5 | Maitrisé par 1 personne |
| Next | 1/5 | 2/5 | 4/5 | Solution prête pour la production |
| HTMX | 0/5 | 2/5 | 3/5 | A tester |

- Nous implémentons Vue pour la landing page et React pour le reste de l'application.
- Next pourra être utilisé pour la version 2 de l'application.
- HTMX sera testé pour la version 3.

<!-- Genere un tableau de classification des technologies backend -->

### Backend

## Schéma de l'application

## Schéma de la base de données

## Documentation API

## Outils gestion de projet

- Figma
- Trello
- GitHub
