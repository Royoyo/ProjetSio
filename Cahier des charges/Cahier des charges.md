# Cahier des charges

## Généralités

Le but est de réaliser une application web en PHP permettant de faciliter la réalisation de planning de cours.

À cette fin :
* les enseignants se voient proposer une page web permettant d'indiquer au moyen de cases à cocher, leurs demi-journées d'indisponibilité,
* les planificateurs accèdent à une page web pour semaine de cours et pour chaque demi-journée disposent d'une liste déroulante permettant de choisir quel enseignant affecter à ce cours en fonction de leurs indisponibilités,
* les administrateurs ont la possibilité d'ouvrir et fermer les périodes de cours année scolaire par année scolaire, de définir les semaines de cours, les jours fériés, de créer/modifier/supprimer les utilisateurs et de leur attribuer des rôles.

Lorsque la planification d'une semaine de cours est finalisée, alors des exports vers plusieurs formats sont à prévoir : iCal, PDF

## Définitions

* mailing: envoi de messages électroniques individuels ou en masse.
* template: fichier modèle, le plus souvent en HTML, contenant une mise en forme avec des variables permettant d'affecter un contenu destiné à l'affichage.
* zone de travail de la page: partie principale de la page web qui correspond aux tâches que l'utilisateurs souhaite réaliser, ce qui exlu les éléments se trouvant sur toutes les pages (en-têtes et pieds de page, menu de navigation...).

### Acteurs

Dans ce document, il est fait référence à plusieurs acteurs susceptibles d'intervenir dans le déroulement du projet :

* le client ou le commanditaire : à l'origine de la demande, il écrit le cahier des charges et valide le projet par étapes ; puis, lorsque le projet arrive à son terme, reçoit livraison de l'application,
* le prestataire ou le développeur : effectue le codage de l'application en fonction du cahier des charge, rend compte au client, communique avec lui au besoin,
* les utilisateurs : les personnes amenées à utiliser l'application au terme du projet ; elles sont impliquées dans la réalisation du projet de façon à préciser leurs attentes, à identifier d'éventuels problèmes ainsi qu'à valider par étapes le projet ; il s'agit autant d'administrateurs que de planificateurs ou d'enseignants.

### Objets métier

#### Objets métier inhérent à l'application

L'application est destinée à permettre aux différents acteurs de manipuler un certain nombre d'[objets métier](http://fr.wikipedia.org/wiki/Objet_m%C3%A9tier) (à ne pas confondre avec l'[objet algorithmique](http://fr.wikipedia.org/wiki/Objet_%28informatique%29)) selon leurs rôles.

Ces objets sont :

* des [classes d'élèves](#classes-délèves)
* des [enseignants](#enseignants)
* des [matières enseignées](#matières-enseignées)
* des [années scolaires](#années-scolaires)
* des [semaines d'enseignement](#semaines-denseignement)
* des [demi-journée](#demi-journée)
* des [demi-journées de cours](#demi-journées-de-cours)
* des [demi-journées d'indisponibilités d'enseignants](#demi-journées-dindisponibilité-denseignants)
* des [affectations d'enseignant à une classe](#affectation-denseignant-à-une-classe)
* des [affectations d'enseignant à une classe sur une demi-journée de cours](#affectations-denseignant-à-une-classe-sur-une-demi-journée-de-cours)

À noter que certains objets-métier sont également des utilisateurs de l'application. Tout est question de point de vue : un enseignant est un utilisateur de l'application pour lui-même et pour l'administrateur, mais il est un objet-métier pour le planificateur.

#### Classes d'élèves

Pour notre application, une classe d'élève reçoit un nom, une date de début et une date de fin. Ces dates servent à borner toute période de planification possible pour cette classe.

#### Enseignants

Les enseignants sont des utilisateurs de l'application ayant le rôle "Enseignant". Ils héritent donc des caractéristiques de l'utilisateur. Pour la production des plannings, il faut ajouter : nom abrégé, matière, matière abrégée, couleur.

#### Matières enseignées

Pour notre application, une matière enseignée reçoit un nom.

#### Années scolaires

Une année scolaire est définie par une date de début et une date de fin, ainsi qu'un nom, en général l'année de début suivie d'un tiret puis l'année de fin abrégée.

Ainsi pour une année scolaire allant du 15 août 2013 au 15 juillet 2014, l'année scolaire aurait pour nom 2013-14.

#### Semaines d'enseignement

Une semaine d'enseignement est définie par une date de début, une date de fin et un numéro correspondant à l'ordre de la semaine dans l'année civile à laquelle elle appartient.

#### Demi-journée

Une demi-journée est une date comprise entre les dates bornes d'une année scolaire, hors dimanche, samedi et jours fériés, avec une précision indiquant s'il s'agit d'une matinnée ou d'un après-midi.

#### Demi-journées de cours

Une demi-journée de cours est une demi-journée appartenant à une semaine de cours.

#### Indisponibilités d'enseignants

Une indisponibilité d'enseignant est une demi-journée sur laquelle un enseignant ne peut être affecté à aucune classe.

#### Affectations des enseignants à une classe

Une affectation d'un enseignant à une classe associe un enseignant à une classe à laquelle il enseigne.

#### Affectations d'enseignants à des matières

Une affectation d'un enseignant à une matière associe un enseignant à une matière exprimant ainsi qu'il est succeptible d'enseigner cette matière.

#### Affectations de matières à une classe

Une affectation d'une matière à une classe associe une classe à une matière exprimant ainsi que la classe doit recevoir un enseignement dans cette matière.

#### Affectations des enseignants à une classe sur une demi-journée

L'affectation d'un enseignant à une classe sur une demi-journée correspond la planification d'une demi-journée de cours donné par cet enseignant à cette classe. Cette affectation _peut_ inclure une affectation de matière.

#### Objets métier introduit par l'application

Il s'agit des objets métier du client qui ne préexistaient pas à l'application et sont donc introduits par elle. (L'application ne devant pas avoir recours à la programmation objet, il n'en reste pas moins que des objets abstraits s'y définissent tout de même dans l'esprit des développeurs et des utilisateurs, ce qui nous contraint à les définir comme des objets métier, même si ce n'est pas de cela qu'il s'agit en réalité).

Ces objets sont:

* les utilisateurs

### Rôles

L'application prévoit aujourd'hui trois rôles :

* `administrateur` : créer, modifier, activer/désactiver les utilisateurs,
* `planificateur` : créer, modifier, supprimer, metre à jour, lier les classes d'élèves, les enseignants, les années scolaires, les cours,
* `enseignant` : crée et supprime ses indisponibilités.
 
Un utilisateur _doit pouvoir cumuler_ les rôles si nécessaire.

## Encodage de caractères
Le code source comme le HTML produit par l'application devront utiliser l'encodage de caractères UTF-8.

## Organisation et communication

GitHub est utilisé pour ses fonctions de versionnage de code et de gestion de tickets.
Toute tâche doit faire l'objet d'un ticket qui en documente la réalisation.
Tout bug doit faire l'objet d'un ticket qui en documente la nature et la solution.
Toute question au client doit faire l'objet d'un ticket.
Si, au cours d'un ticket une question à poser au client se révèle, celle-ci doit faire l'objet d'un ticket __séparé__ auquel le client sera affecté, de façon à ce que le client ne reçoive pas tous les commentaires liés au ticket originel et qui ne le concerne pas forcément.

## Environnements

### Environnement de développement

Le prestataire est libre d'utiliser l'environnement de développement qu'il lui semble le plus approprié, ainsi que les outils associés.

Toutefois, le code source produit devra être versionné et pouvoir être consulté par le client à tout moment. Pour ce faire, un projet est créé sur le site GitHub auquel le prestataire et le client ont accès en lecture comme en écriture. Si le client estime que le code produit est confidentiel, le projet GitHub pourra devenir privé pour un coût qui sera à la charge du client.

L'application devra fonctionner avec une base de données MySQL 5 en utilisant le framework [Eloquent](https://laravel.com/docs/5.2/eloquent)

### Environnement de production

#### Serveur

L'environnement de production n'est pas établi à l'avance et pourra de toute façon évoluer au cours de la vie de l'application. Toutefois, le client ayant tout de même la maîtrise de cet environnement, pourra veiller à suivre les prérequis que le prestataire jugera nécessaires, dans la mesure où ses propres contraintes lui permettent.

Le prestataire veillera tout de même à minimiser les contraintes imposées au client, ainsi que les présupposés quant à l'environnement de production. En particulier, le prestataire veillera à développer une application multi-plateforme fonctionnant sans modification notable, c'est-à-dire autre que de configuration, tant sur un serveur fonctionnant avec Windows que sous Linux, tant avec Apache qu'un autre serveur web.

#### Client

Le client n'ayant pas la maîtrise des terminaux utilisés par nombre des utilisateurs de l'application, le développement de l'interface devra être utilisable par tout type de terminaux supportant les protocoles habituels du web, avec n'importe quel navigateur. Ce point est particulièrement important en ce qui concerne le rôle `enseignant` puisqu'il s'agit de personnes travaillant au moins pour partie avec leur propre matériel.

Pour les autres rôles, la contrainte est moins forte et l'environnement cible _privilégié_ est Firefox sur PC. On s'attend tout de même à ce que l'application soit exploitable avec d'autres navigateurs, même si l'ergonomie est moins agréable.

### Environnement de test

Le prestataire est libre d'effectuer les tests comme bon lui semble. Toutefois, il s'engage à valider son développement pour l'environnement de production _actuel_ du client, à savoir un serveur tournant sous Linux avec PHP 5. L'application doit pouvoir fonctionner __sans mise à jour du serveur__.

Voici quelques détails techniques concernant cette plateforme :

* OS: Linux Ubuntu
* Serveur web : Apache 2.2.17
* PHP 5.3.5


## Sécurité

### Cryptage des communications

L'environnement de production n'étant pas entièrement défini au moment de la rédaction de ce cahier des charges, l'application devra pouvoir fonctionner indifférement avec ou sans cryptage des communications, c'est-à-dire en utilisant les protocoles `http` ou `https`.

### Processus d'initialisation de compte

Lorsque l'administrateur créer un nouvel utilisateur, un champ `mail` destiné à recueillir l'adresse électronique est obligatoire. Lorsque l'utilisateur est créé, l'application envoie immédiatement un message à cette adresse indiquant à l'utilisateur que son compte vient d'être créer, mais qu'il doit être activé. Pour cela, le message contient un lien ayant une validité limitée à 24 heures, permettant à l'utilisateur d'activer son compte. Le lien permet d'accéder à une page où l'utilisateur est invité à indiquer son mot de passe à fin d'enregistrement. Le compte n'est actif que lorsque le mot de passe a été correctement enregistré dans la base de donnée.

### Stockage du mot de passe

Le mot de passe ne doit pas être stocké en clair dans la base de donnée, mais crypté selon un algorithme irréversible. Il est fortement recommandé d'utiliser la [nouvelle API destinée à cette tâche présente dans PHP 5.6](http://fr2.php.net/manual/fr/book.password.php).

L'environnement de test ne permettant pas à ce jour l'utilisation de cette API (voir [ticket #8](https://github.com/Royoyo/ProjetSio/issues/8), le prestataire aura soin de prévoir des solutions de remplacements:

* possibilité de définir dans la configuration l'utilisation d'une méthode dépréciée aujourd'hui de hachage de mots de passe (SHA1 ou MD5 par exemple), avec grain de sel dans la configuration,
* si PHP est en version inférieure à 5.5 mais supérieure à 5.3.7, alors la nouvelle API est utilisée en [version "espace utilisateur"](https://github.com/ircmaxell/password_compat), sauf si la directive de configuration indiquée au point précédent est active,
* si PHP est en version 5.5 ou supérieure et que la directive de configuration du premier point n'est pas active, alors on utilisera la version de l'API du noyau de PHP.

### Mailings

L'application est succeptible d'envoyer des mailings. Pour chaque type de mailing, le prestataire développera un template sous la forme d'un fichier HTML. Des champs sous forme de mots-clés seront utilisés pour personnaliser et contextualiser les messages envoyés.Le prestataire est libre d'utiliser la syntaxe de son choix pour ces mots-clés, mais ceux-ci devront être documentés dans la documentation Administrateur.

Le prestataire aura recours à la méthode de son choix pour la conversion de Markdown vers HTML. Pour l'envoi des mails, une solution utilisant la librairie [SwiftMailer](http://swiftmailer.org/) est recommandée.

## Documentation

Le prestataire devra produire une documentation complète comportant plusieurs volets :

* un volet à destination du client, décrivant les prérequis de l'application concernant l'environnement de déploiement et la proccédure d'installation de l'application,
* un volet à destination des administrateurs décrivant les procédures à suivre pour réaliser les tâches qui sont dévolues à leur rôle,
* idem pour les planificateur,
* idem pour les enseignants.

## Fonctionnalités de l'application

### Fonctionnalités communes à chaque rôle

Les fonctionnalités communes sont celles qui sont liées à la gestion de son compte par l'utilisateur.

#### Activation du compte

Voir [Sécurité/Procédure d'activation du compte](#processus-dinitialisation-de-compte).

#### Identification lors de l'accès à l'application

L'accès à l'application est sécurisé par un formulaire d'identification. L'utilisateur y indique son identifiant ainsi que son mot de passe, connu de lui seul. Le champ destiné à recevoir le mot de passe ne doit pas avoir de contenu visuellement lisible.

#### Changement de mot de passe

Le mot de passe peut être modifié à tout moment par l'utilisateur à l'aide d'un formulaire de deux champs dont le contenu ne doit pas être lisible. Les champs sont destinés à contenir le nouveau mot de passe. Celui-ci ne sera pris en compte que si les valeurs saisies dans les deux champs sont identiques.

#### Mise à jour du profil

L'utilisateur doit pouvoir changer son adresse email.

### Fonctionnalités du rôle Administrateur

#### Listage d'utilisateurs

L'administrateur a accès à la liste de tous les utilisateurs de l'application. La page affichant cette liste doit permettre de créer, consulter, modifier, activer/désactiver ces utilisateurs.

Il s'agit de la page par défaut d'un administrateur une fois qu'il est connecté.

#### Création d'utilisateur(s)
La création d'un utilisateur s'effectue à l'aide d'un formulaire comprenant les champs suivants :
* Nom d'utilisateur
* Adresse email
* Prénom
* Nom
* Rôle_(s)_

Si un problème survient lors de la création de l'utilisateur, le même formulaire est réaffiché avec les valeurs remplise par l'utilisateur, le tout accompagné par une message d'erreur expliquant le problème au dessus du formulaire.

Une case à cocher supplémentaire permet, si elle est cochée et que la création de l'utilisateur réussie, de réafficher le même formulaire à nouveau vierge pour créer un autre utilisateur. Dans ce cas là, la case est à nouveau cochée, ce qui permet d'enchaîner la création d'utilisateurs.

Si la case n'est pas cochée, alors la page listant les utilisateurs s'affiche.

Dans les deux cas, un message indiquant le succès de l'opération s'affiche en haut de la zone de travail de la page.

#### Consultation d'un utilisateur

Affiche les informations saisies lors de la création de l'utilisateur.

#### Suspension d'utilisateur(s)

La suspension d'un utilisateur permet d'interdire l'accès à l'application à cet utilisateur sans pour autant supprimer son compte. Naturellement, une fonction de réactivation doit également être prévue.

#### Renvoi de mails d'initialisation de compte d'utilisateur(s)

L'administrateur doit pouvoir envoyer un mail de réinitialisation de mot de passe à l'utilisateur.

#### Modification d'un utilisateur

Accès en mode édition des renseignements indiqués lors de la création de l'utilisateur.

### Fonctionnalités du rôle Planificateur

Le Planificateur gère l'ensemble des tâches relatives à la planification :
* gestion des classes d'élèves
* gestion des matières enseignées
* gestion des enseignants
* gestion des périodes (années scolaires, jours de fermeture, demi-journées)

Par gestion, il faut entendre création, suppression, consultation, mise à jour, et mise en relation des différents types d'éléments.

#### Gestion de classes d'élèves

Le Planificateur a la possibilité de créer, modifier et supprimer une classe d'élèves. Celle-ci doit pouvoir avoir un nom ainsi qu'ne date de début et de fin.

#### Gestion des matières enseignées

Le Planificateur a la possibilité de créer, modifier et supprimer une matière enseignée. Celle doit pouvoir avoir un nom et des enseignants affectés. Seul le nom est obligatoire.

#### Gestion des enseignants

Le Planificateur a la possibilité de modifier, créer, supprimer les affectations d'un enseignant à des matières.

#### Gestion des semaines d'enseignements

Pour chaque classe d'élèves, le Planificateur doit pouvoir accéder à un tableau par semaine (uniquement en consultation pour les semaines passées).

Cet accès s'effectue par une liste des semaines (par défaut, on ne verra que les semaines à venir et la semaine en cours, mais il doit être possible d'afficher les semaines passées, par un système de pagination ?). Ces semaines regroupent toutes les années actives auxquelles la classe est affecté et sont triées dans l'ordre chronologique.

Lorsque le Planificateur clique sur une semaine, il accède à un tableau permettant d'affecter professeurs et matières pour chaque demi-journée en excluant les journées de fermeture. Pour chaque demi-journée, le Planificateur déroule une liste indiquant l'ensemble des enseignants _disponibles_ (c'est-à-dire ayant indiqué dans leur partie de l'application qu'ils sont disponibles à cette date et _n'étant pas affecter à un autre cours_) dans laquelle il choisit celui qui sera alors affecté.

Un bouton, appeler "Enregistrer" permet d'enregistrer les modifications sans autre action. Un autre bouton appelé "Finaliser" permet d'enregistrer les modifications, d'envoyer un mail de notification aux enseignants concernés et de rendre cette semaine de planifcation consultable par les enseignants.

**Une semaine de planification n'est _pas consultable_ par les enseignants tant qu'elle n'a pas été finalisée !**

### Fonctionnalités du rôle Enseignant

#### Indication des indisponibilités

Pour chaque année scolaire active, un enseignant peut accéder à un tableau similaire [à celui auquel accès le Planificateur](#Gestion-des-années-scolaires) dans lequel il a la possiblité d'[indiquer ses indisponibilités](https://github.com/Royoyo/ProjetSio/issues/12) : une case cochée correspondant à une **demi**-journée d'indiponibilité.

Si l'enseignant indiquait une indisponibilité de cours sur une date pour laquelle il a déjà un cours de planifié, un avertissement sera affiché et un mail envoyé aux planificateurs ainsi qu'à l'enseignant pour prévenir du conflit.

**Un tel conflit devra être mis en évidence sur les écrans pertinents de façon à ce que les utilisateurs de l'application ne puissent l'ignorer.**

#### Consultation de sa planification

L'enseignant a la possibilité de prendre connaissance de sa planification (par défaut, uniquement la semaine en cours et les semaines à venir) des cours pour lesquels il est planifié à travers un tableau récapitulatif :
* une ligne par cours
* colone 1: Date
* colone 2: Periode ( matin ou après-midi)
* colone 3: Matière
* colone 4: Classes
 
#### Consultation des semaines planifiées

Pour chaque semaine finalisée d'une classe à laquelle l'enseignant est affecté, l'enseignant a la possibilité de consulter la planification de la classe.
