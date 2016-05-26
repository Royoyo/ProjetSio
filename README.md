#GPCI
Gestion du Planning du Centre de formation Ifide

##Présentation du projet

Cette application sert à gérer le planning du centre de formation

##Environnement Requis
Version de PHP : 5.3.5 ou plus


##Installation de l'application

L'application s'installe avec les étapes suivantes :

1/ Copier le dossier src/webApp dans le dossier web de votre serveur

2/ Installer les dépendances du backend avec composer :

````
cd PathVersDossierWeb/backend
php composer.phar install
````

3/ Créer la base de données qui va être utilisée sur votre serveur

4/ Rajouter les variables d'environnements nécessaires :

Pour cela, il faut modifier le fichier .env.exemple dans le dossier PathVersDossierWeb/backend/app :
````
DATABASE_NAME=""
DATABASE_USER=""
DATABASE_PASSWORD=""
SMTP_ADDRESS=""
SMTP_USER=""
SMTP_PASSWORD=""
````
Une fois que les informations nécessaires sont inscrites dans le fichier changer le nom du fichier en .env

5/ Utiliser le script php migration dans le dossier backend :

````
php migration migrate 
php migration seed
````

6/ Voilà, l'application est prête à l'emploi

Un premier utilisateur nommé "admin" avec "abc" est créé automatiquement.