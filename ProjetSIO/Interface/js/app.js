//C'est ici que l'application Angular est déclarée
// Le premier paramètre est le nom qu'on donne à l'application, le 2eme est une liste des plugins qu'on rajoute
var webApp = angular.module('webApp', ['ui.router','ui.bootstrap','smart-table','ngAnimate','restangular']);

//Présentation rapide des plugins :
//
// ui.router :  permet un routage ( voir plus bas) plus développé que l'angular de base, notamment par le biais de "nested views"
//
// ui.bootstrap : donne accès aux components de bootstrap avec une syntaxe angular
//
// smart-table : un plugin très pratique pour gérer les tables liées à une base de données de manière asynchrone
//
// ngAnimate : pour que le site soit un peu plus plaisant à utiliser
//
// Autres plugins potentiels : ui.calendar ( pour le calendrier),restangular(pour gérer la liaison avec le backend) 

//Logique de login :

// Déclaration des constantes pour les logins
webApp.constant('USERS_ROLES', {
	administrateur : 'administrateur',
	planificateur : 'planificateur',
	enseignant : 'enseignant'
})

// Déclaration des constantes pour les évènements de login
webApp.constant('AUTH_EVENTS',{
	loginSuccess : 'auth-loginSuccess',
	loginFailed : 'auth-loginFailed',
	logoutSuccess : 'auth-logoutSuccess',
	sessionTimeout : 'auth-sessionTimeout',
	notAuthenticated : 'auth-notAuthenticated',
	notAuthorized : 'auth-notAuthorized'
})

// Rajout d'un intercepteur de toutes les requêtes http pour vérifier le login
webApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})