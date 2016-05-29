#GPCI Desktop

Cette partie du projet permet de créer une application native windows en prenant l'application angularJS comme base.

Elle se base sur [electron](http://electron.atom.io/) et le projet open source [electron-boilerplate](https://github.com/szwacz/electron-boilerplate).

##Environnement Requis
[NodeJs](https://nodejs.org) ainsi que [NSIS](http://nsis.sourceforge.net/Main_Page) doivent être installés sur la machine de développement


##Installation de l'application

L'application s'installe avec les étapes suivantes :

#####1/ Installation des paquets npm :

````
cd PATH\ProjetSio\src\electronApp
npm install
````

De plus, vous pouvez lancer l'application en mode développeur avec :
````
npm start
````
#####2/ Création de l'installateur

````
npm run release
````

#####3/ Voilà, l'installateur windows a bien été créé 

Il se trouvera dans le dossier PATH\ProjetSio\src\electronApp\releases
