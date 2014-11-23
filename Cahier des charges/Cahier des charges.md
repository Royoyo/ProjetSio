# Cahier des charges

## Généralités

Le but est de réaliser une application web en PHP permettant de faciliter la réalisation de planning de cours.

À cette fin :
* les enseignants se voient proposer une page web permettant d'indiquer au moyen de cases à cocher, leurs demi-journées d'indisponibilité,
* les planificateurs accèdent à une page web pour semaine de cours et pour chaque demi-journée disposent d'une liste déroulante permettant de choisir quel enseignant affecter à ce cours en fonction de leur disponibilité,
* les administrateurs ont la possibilité d'ouvrir et fermer les périodes de cours année scolaire par année scolaire, de définir les semaines de cours, les jours fériés, de créer/modifier/supprimer les utilisateurs et de leur attribuer des rôles.

Lorsque la planification d'une semaine de cours est finalisée, alors des exports vers plusieurs formats sont à prévoir : Excel, CSV, iCal.

## Définitions

* mailing: envoi automatique de messages électroniques individuels ou en masse.
* template: fichier modèle, le plus souvent en HTML, contenant une mise en forme avec des variables permettant d'affecter un contenu destiné à l'affichage.
* zone de travail de la page: partie principale de la page web qui correspond aux tâches que l'utilisateurs souhaite réaliser, ce qui exlu les éléments se trouvant sur toutes les pages (en-têtes et pieds de page, menu de navigation...).

### Acteurs

Dans ce document, il est fait référence à plusieurs acteurs susceptibles d'intervenir dans le déroulement du projet :

* le client ou le commanditaire : à l'origine de la demande, il écrit le cahier des charges et valide le projet par étapes ; puis, lorsque le projet arrive à son terme, reçoit livraison de l'application,
* le prestataire ou le développeur : effectue le codage de l'application en fonction du cahier des charge, rend compte au client, communique avec lui au besoin,
* les utilisateurs : les personnes amenées à utiliser l'application au terme du projet ; elles sont impliquées dans la réalisation du projet de façon à préciser leurs attentes, à identifier d'éventuels problèmes ainsi qu'à valider par étapes le projet ; il s'agit autant d'administrateurs que de planificateurs ou d'enseignants.

### Organisation et communication

GitHub est utilisé pour ses fonctions de versionnage de code, de gestion de tickets et, éventuellement, de documentation (Wiki) si cette solution était retenue par les développeurs.
Toute tâche doit faire l'objet d'un ticket qui en documente la réalisation.
Tout bug doit faire l'objet d'un ticket qui en documente la nature et la solution.
Toute question au client doit faire l'objet d'un ticket.
Si, au cours d'un ticket une question à poser au client se révèle, celle-ci doit faire l'objet d'un ticket __séparé__ auquel le client sera affecté, de façon à ce que le client ne reçoive pas tous les commentaires liés au ticket originel et qui ne le concerne pas forcément.

### Rôles

L'application prévoit aujourd'hui trois rôles :

* `administrateur`
* `planificateur`
* `enseignant`
 
Un utilisateur _doit pouvoir cumuler_ les rôles si nécessaire.

## Environnements

### Environnement de développement

Le prestataire est libre d'utiliser l'environnement de développement qu'il lui semble le plus approprié, ainsi que les outils associés.

Toutefois, le code source produit devra être versionné et pouvoir être consulté par le client à tout moment. Pour ce faire, un projet est créé sur le site GitHub auquel le prestataire et le client ont accès en lecture comme en écriture. Si le client estime que le code produit est confidentiel, le projet GitHub pourra devenir privé pour un coût qui sera à la charge du client.

L'application devra fonctionner avec une base de données MySQL 5 en utilisant la librairie [MySQLi](http://fr2.php.net/manual/fr/book.mysqli.php) et en aucun cas la librairie [MySQL](http://fr2.php.net/manual/fr/book.mysql.php) qui est dépréciée.

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
* extensions à PHP : mysqli


## Sécurité

### Cryptage des communications

L'environnement de production n'étant pas entièrement défini au moment de la rédaction de ce cahier des charges, l'application devra pouvoir fonctionner indifférement avec ou sans cryptage des communications, c'est-à-dire en utilisant les protocoles `http` ou `https`.

Une option de la configuration devra permettre, si elle est activée, de détecter si les communications ont lieu selon le protocole `http` et dans ce cas de forcer un basculement vers `https`.

### Processus d'initialisation de compte

Lorsque l'administrateur créer un nouvel utilisateur, un champ `mail` destiné à recueillir l'adresse électronique est obligatoire. Lorsque l'utilisateur est créé, l'application envoie immédiatement un message à cette adresse indiquant à l'utilisateur que son compte vient d'être créer, mais qu'il doit être activé. Pour cela, le message contient un lien ayant une validité limitée à 24 heures, permettant à l'utilisateur d'activer son compte. Le lien permet d'accéder à une page où l'utilisateur est invité à indiquer son mot de passe à fin d'enregistrement. Le compte n'est actif que lorsque le mot de passe a été correctement enregistré dans la base de donnée.

### Stockage du mot de passe

Le mot de passe ne doit pas être stocké en clair dans la base de donnée, mais crypté selon un algorithme irréversible. Il est fortement recommandé d'utiliser la [nouvelle API destinée à cette tâche présente dans PHP 5.6](http://fr2.php.net/manual/fr/book.password.php).

L'environnement de test ne permettant pas à ce jour l'utilisation de cette API (voir [ticket #8](https://github.com/Royoyo/ProjetSio/issues/8), le prestataire aura soin de prévoir des solutions de remplacements:

* possibilité de définir dans la configuration l'utilisation d'une méthode dépréciée aujourd'hui de hachage de mots de passe (SHA1 ou MD5 par exemple), avec grain de sel dans la configuration,
* si PHP est en version inférieure à 5.5 mais supérieure à 5.3.7, alors la nouvelle API est utilisée en [version "espace utilisateur"](https://github.com/ircmaxell/password_compat), sauf si la directive de configuration indiquée au point précédent est active,
* si PHP est en version 5.5 ou supérieure et que la directive de configuration du premier point n'est pas active, alors on utilisera la version de l'API du noyau de PHP.

La directive de configuration est à positionner au moment de l'installation, en fonction de la version de PHP dans l'environnement d'installation. Une fois cette configuration établie, seul l'administrateur du serveur pourra la modifier. En effet, il faut prendre soin qu'une mise à jour de version ne vienne pas invalider tous les mots de passe stockés. Une procédure de migration de la méthode dépréciée vers la méthode recommandée devra être fournie.

L'utilisation de la nouvelle API se fera à partir de la version en espace utilisateur ou du coeur de PHP par détection de présence de fonction et sera transparente pour les utilisateurs.

### Mailings

L'application est succeptible d'envoyer des mailings. Pour chaque type de mailing, le prestataire développera un template sous la forme d'un fichier [Markdown](http://fr.wikipedia.org/wiki/Markdown) pouvant inclure du HTML. Des champs sous forme de mots-clés seront utilisés pour personnaliser et contextualiser les messages envoyés.Le prestataire est libre d'utiliser la syntaxe de son choix pour ces mots-clés, mais ceux-ci devront être documentés dans la documentation Administrateur.

Le prestataire aura recours à la méthode de son choix pour la conversion de Markdown vers HTML. Pour l'envoi des mails, une solution utilisant la librairie [SwiftMailer](http://swiftmailer.org/) est recommandée.

## Documentation

Le prestataire devra produire une documentation complète comportant plusieurs volets :

* un volet à destination du client, décrivant les prérequis de l'application concernant l'environnement de déploiement et la proccédure d'installation de l'application,
* un volet à destination des administrateurs décrivant les procédures à suivre pour réaliser les tâches qui sont dévolues à leur rôle,
* idem pour les planificateur,
* idem pour les enseignants.

Cette documentation devra être rédigée en HTML et des liens jusdicieusement placés dans l'application permettront de la consulter ponctuellement en fonction du contexte dans une fenêtre externe à l'application, mais en ouvrant une nouvelle fenêtre que si plus aucune fenêtre destinée à consulter la documentation n'est ouverte.

### Documentation Administrateur
Cette documentation comprendra une procédure décrivant la migration permettant de passer de la méthode de cryptage de mots de passe dépréciée à la méthode recommandée.

## Fonctionnalités de l'application

### Fonctionnalités communes à chaque rôle

Les fonctionnalités communes sont celles qui sont liées à la gestion de son compte pas l'utilisateur.

#### Activation du compte

#### Identification lors de l'accès à l'application

#### Réinitialisation du mot de passe

#### Changement de mot de passe

#### Mise à jour du profil


### Fonctionnalités du rôle Administrateur

#### Listage d'utilisateurs

#### Création d'utilisateur(s)
La création d'un utilisateur s'effectue à l'aide d'un formulaire comprenant les champs suivants :
* Nom d'utilisateur
* Adresse email
* Prénom
* Nom
* Rôle
Si un problème survient lors de la création de l'utilisateur, le même formulaire est réaffiché avec les valeurs remplis par l'utilisateur, le tout accompagné par une message d'erreur expliquant le problème au dessus du formulaire.
Une case à cocher supplémentaire permet, si elle est cochée et que la création de l'utilisateur réussie, de réafficher le même formulaire à nouveau vierge pour créer un autre utilisateur. Dans ce cas là, la case est à nouveau cochée, ce qui permet d'enchaîner la création d'utilisateurs.
Si la case n'est pas cochée, alors la page listant les utilisateurs s'affiche.
Dans les deux cas, un message indiquant le succès de l'opération s'affiche en haut de la zone de travail de la page.

#### Consultation d'un utilisateur

#### Suspension d'utilisateur(s)

#### Suppression d'utilisateur(s)

#### Renvoi de mails d'initialisation de compte d'utilisateur(s)

#### Modification d'un utilisateur

#### Actions en masse

#### Fonctionnalité par défaut



### Fonctionnalités du rôle Planificateur

#### 

#### Fonctionnalité par défaut

### Fonctionnalités du rôle Enseignant
