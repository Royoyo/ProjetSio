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

//Ici on utilise la méthode config pour déclarer le routage de l'application
webApp.config(function($stateProvider, $urlRouterProvider,RestangularProvider) {

//Mise en place de l'url de base pour restangular
RestangularProvider.setBaseUrl('http://guilaumehaag.ddns.net/SIO/PPEBackend');


//Cette ligne force toute les routes autres que celles déclarées vers "/"
$urlRouterProvider.otherwise("/");

// NOTA BENE : ui-router utilise la terminologie "state" à la place de "route", mais le principe de base reste le même

//déclaration des states ( ou routes)
$stateProvider
	//D'abord on déclare le nom du state
	.state('login', {
	//Puis on crée la liaison avec un url 
	url: "/",
	//Ensuite on indique le template utilisé 
	templateUrl: "view/login.html",
	//Et pour finir on lie un controller à la view
	controller: "loginController"
	})
	
	
	//Partie Administrateur
	.state('administration', {
	url: "/administration",
	templateUrl: "view/administration.html",
	controller: "AdminList"
	})
	
	//Partie Planificateur
	.state('planification', {
	url: "/planification",
	templateUrl: "view/planification.html",
	controller: "PlanController"
	})
	
	.state('planification.classes', {
	url: "/planification/classes",
	templateUrl: "view/planification.classes.html",
	controller: "PlanClassesController"
	})
	
	.state('planification.matieres', {
	url: "/planification/matieres",
	templateUrl: "view/planification.matieres.html",
	controller: "PlanMatieresController"
	})
	
	.state('planification.periodes', {
	url: "/planification/periodes",
	templateUrl: "view/planification.periodes.html",
	controller: "PlanPeriodesController"
	})
	
	//Partie Enseignant
	
	;
});