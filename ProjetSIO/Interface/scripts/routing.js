//Ici on utilise la méthode config pour déclarer le routage de l'application
webApp.config(function($stateProvider, $urlRouterProvider, RestangularProvider, USERS_ROLES) {

//Mise en place de l'url de base pour restangular
    RestangularProvider.setBaseUrl("http://guilaumehaag.ddns.net/SIO/PPEBackend");


//Cette ligne force toute les routes autres que celles déclarées vers "/"
    $urlRouterProvider.otherwise("/");

// NOTA BENE : ui-router utilise la terminologie "state" à la place de "route", mais le principe de base reste le même

//déclaration des states ( ou routes)
    $stateProvider
        //D'abord on déclare le nom du state
        .state("accueil", {
            //Puis on crée la liaison avec un url 
            url: "/",
            //Ensuite on indique le template utilisé 
            templateUrl: "views/accueil.html",
            data: {
                authorizedRoles: [USERS_ROLES.administrateur, USERS_ROLES.planificateur, USERS_ROLES.enseignant]
            }
        })

        //Page activation de compte
        .state("activation", {
            url: "/activation/:id/:token",
            templateUrl: "views/activation.html",
            controller: "ActivationController",
            resolve: {
                id: function($stateParams) {
                    return $stateParams.id;
                },
                token: function($stateParams) {
                    return $stateParams.token;
                }
            }
        })

        //Page de profil
        .state("profil", {
            url: "/profil",
            templateUrl: "views/profil.html",
            controller: "ProfilController",
            data: {
                authorizedRoles: [USERS_ROLES.administrateur, USERS_ROLES.planificateur, USERS_ROLES.enseignant]
            }
        })

        //Partie Administrateur
        .state("administration", {
            url: "/administration",
            templateUrl: "views/administration/administration.html",
            controller: "AdminList",
            data: {
                authorizedRoles: [USERS_ROLES.administrateur]
            }
        })

        //Partie Planificateur
        .state("planification", {
            url: "/planification",
            templateUrl: "views/planification/navigation.html",
            controller: "planificationController",
            data: {
                authorizedRoles: [USERS_ROLES.planificateur]
            }
        })
        .state("planification.classes", {
            url: "/classes",
            templateUrl: "views/planification/listeClasses.html",
            controller: "PlanClassesController",
            data: {
                authorizedRoles: [USERS_ROLES.planificateur]
            }
        })
        .state("planification.matieres", {
            url: "/matieres",
            templateUrl: "views/planification/matieres.html",
            controller: "PlanMatieresController",
            data: {
                authorizedRoles: [USERS_ROLES.planificateur]
            }
        })
        .state("planification.enseignants", {
            url: "/enseignants",
            templateUrl: "views/planification/listeEnseignants.html",
            controller: "PlanEnseignantsController",
            data: {
                authorizedRoles: [USERS_ROLES.planificateur]
            }
        })
        .state("planification.calendar", {
            url: "/periodes/:id",
            templateUrl: "views/planification/calendar.html",
            controller: "PlanCalendar",
            resolve: {
                id: function($stateParams) {
                    return $stateParams.id;
                }
            },
            data: {
                authorizedRoles: [USERS_ROLES.planificateur]
            }
        })

        //Partie Enseignant
        .state("enseignement", {
            url: "/enseignement",
            templateUrl: "views/enseignement/navigation.html",
            data: {
                authorizedRoles: [USERS_ROLES.enseignant]
            }
        })
        .state("enseignement.cours", {
            url: "/cours",
            templateUrl: "views/enseignement/cours.html",
            controller: "EnsCoursController",
            data: {
                authorizedRoles: [USERS_ROLES.enseignant]
            }
        })
        .state("enseignement.indisponibilites", {
            url: "/indisponibilites",
            templateUrl: "views/enseignement/indisponibilites.html",
            controller: "indisposController",
            data: {
                authorizedRoles: [USERS_ROLES.enseignant]
            }
        })
        .state("enseignement.calendar", {
            url: "/calendar",
            templateUrl: "views/enseignement/calendar.html",
            controller: "EnsCalendarController",
            data: {
                authorizedRoles: [USERS_ROLES.enseignant]
            }
        });
});