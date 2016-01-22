//Ici on utilise la méthode config pour déclarer le routage de l'application
webApp.config(function($stateProvider, $urlRouterProvider,RestangularProvider,USERS_ROLES) {

//Mise en place de l'url de base pour restangular
RestangularProvider.setBaseUrl('http://guilaumehaag.ddns.net/SIO/PPEBackend');


//Cette ligne force toute les routes autres que celles déclarées vers "/"
$urlRouterProvider.otherwise("/");

// NOTA BENE : ui-router utilise la terminologie "state" à la place de "route", mais le principe de base reste le même

//déclaration des states ( ou routes)
$stateProvider
	//D'abord on déclare le nom du state
	.state('accueil', {
	//Puis on crée la liaison avec un url 
	url: "/",
	//Ensuite on indique le template utilisé 
	templateUrl: "view/accueil.html",
	data: {
          authorizedRoles: [USERS_ROLES.administrateur, USERS_ROLES.planificateur, USERS_ROLES.enseignant]
      }
	})
	
    //Page activation de compte
    .state('activation', {
	url: "/activation/:id/:token",
	templateUrl: "view/activation.html",
	controller: "ActivationController",
    resolve:{
		id: function($stateParams){
			return $stateParams.id
		},
        token: function($stateParams){
			return $stateParams.token
		}
	},
	})
    
    //Page de profil
	.state('profil', {
	url: "/profil",
	templateUrl: "view/profil.html",
	controller: "ProfilController",
	data: {
          authorizedRoles: [USERS_ROLES.administrateur, USERS_ROLES.planificateur, USERS_ROLES.enseignant]
      }
	})
    
	//Partie Administrateur
	.state('administration', {
	url: "/administration",
	templateUrl: "view/administration/administration.html",
	controller: "AdminList",
	data: {
          authorizedRoles: [USERS_ROLES.administrateur]
      }
	})
	
	//Partie Planificateur
	.state('planification', {
	url: "/planification",
	templateUrl: "view/planification/navigation.html",
	data: {
          authorizedRoles: [USERS_ROLES.planificateur]
      }
	})
	
	.state('planification.classes', {
	url: "/classes",
	templateUrl: "view/planification/listeClasses.html",
	controller: "PlanClassesController",
	data: {
          authorizedRoles: [USERS_ROLES.planificateur]
      }
	})

    .state('planification.matieres', {
	url: "/matieres",
	templateUrl: "view/planification/matieres.html",
	controller: "PlanMatieresController",
	data: {
          authorizedRoles: [USERS_ROLES.planificateur]
      }
	})

	.state('planification.enseignants', {
	url: "/enseignants",
	templateUrl: "view/planification/listeEnseignants.html",
	controller: "PlanEnseignantsController",
	data: {
          authorizedRoles: [USERS_ROLES.planificateur]
      }
	})
    
    /* On garde cette route au cas où */
	/*
	.state('planification.periodes', {
	url: "/periodes",
	templateUrl: "view/planification/listeClassesCalendar.html",
	controller: "PlanCalendarClasses",
	data: {
          authorizedRoles: [USERS_ROLES.administrateur, USERS_ROLES.planificateur]
      }
	})
	*/
	.state('planification.calendar', {
	url: "/periodes/:id",
	templateUrl: "view/planification/calendar.html",
	controller: "PlanCalendar",
	resolve:{
		id: function($stateParams){
			return $stateParams.id
		}
	},
	data: {
          authorizedRoles: [USERS_ROLES.planificateur]
      }
	})
	
	//Partie Enseignant
	.state('enseignement', {
	url: "/enseignement",
	templateUrl: "view/enseignement/navigation.html",
	data: {
          authorizedRoles: [USERS_ROLES.enseignant]
      }
	})
	
	.state('enseignement.cours', {
	url: "/cours",
	templateUrl: "view/enseignement/cours.html",
	controller: "EnsCoursController",
	data: {
          authorizedRoles: [USERS_ROLES.enseignant]
      }
	})

	.state('enseignement.indisponibilites', {
	url: "/indisponibilites",
	templateUrl: "view/enseignement/indisponibilites.html",
	data: {
          authorizedRoles: [USERS_ROLES.enseignant]
      }
	})
    
    .state('enseignement.indisponibilites.liste', {
	url: "/liste",
	templateUrl: "view/enseignement/listeIndisponibilites.html",
	controller: "EnsIndisponibilitesController",
	data: {
          authorizedRoles: [USERS_ROLES.enseignant]
      }
	})
    
    .state('enseignement.indisponibilites.calendar', {
	url: "/calendar",
	templateUrl: "view/enseignement/calendarIndisponibilites.html",
	controller: "EnsCalendarIndisponibilitesController",
	data: {
          authorizedRoles: [USERS_ROLES.enseignant]
      }
	})
    
    .state('enseignement.calendar', {
	url: "/calendar",
	templateUrl: "view/enseignement/calendar.html",
	controller: "EnsCalendarController",
	data: {
          authorizedRoles: [USERS_ROLES.enseignant]
      }
	})
	;
});