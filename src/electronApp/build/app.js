(function () {'use strict';

var webApp = angular.module("webApp", ["ui.router","ui.bootstrap","smart-table","ngAnimate","toastr","restangular","ui.calendar"]);

//TO DO : prendre ces constantes du serveur
webApp.constant("USERS_ROLES", {
    administrateur: "administrateur",
    planificateur: "planificateur",
    enseignant: "enseignant"
});

// Déclaration des constantes pour les évènements de login
webApp.constant("AUTH_EVENTS", {
    loginSuccess: "auth-loginSuccess",
    loginFailed: "auth-loginFailed",
    logoutSuccess: "auth-logoutSuccess",
    sessionTimeout: "auth-sessionTimeout",
    notAuthenticated: "auth-notAuthenticated",
    notAuthorized: "auth-notAuthorized"
});

// Constante pour lien backend
webApp.constant("BACKEND_URL", "./backend/");

//Config de toastr
webApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        positionClass: "toast-bottom-right",
        //Limité à un à cause de la mise à jour 1.4.7 d'angular-animate
        maxOpened: 1
    });
});

// Rajout d'un intercepteur de toutes les requêtes http pour vérifier le login
webApp.config(function($httpProvider) {
    $httpProvider.interceptors.push([
        "$injector",
        function($injector) {
            return $injector.get("AuthInterceptor");
        }
    ]);
});
// test : function checkant le statut de la session à chaque changement de state
webApp.run(function($rootScope, $state, Authentification, AUTH_EVENTS) {

	$rootScope.$on("$stateChangeStart", function (event, next) {
        if(next.name != "activation" && next.name != "annee"){
            var authorizedRoles = next.data.authorizedRoles;
            if (!Authentification.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (Authentification.isAuthenticated()) {
                    // user non autorisé
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } 
                else {
                    // user pas connecté
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        }
	  });
	
	// test pour navbar, à revoir
	$rootScope.getClass = function(path) {
		if ($state.current.name == path) {
			return "actif";
		} else {
			return "";
		}
	}
	
	$rootScope.logout = function(){
		Authentification.logout();
	};

});
//Ici on utilise la méthode config pour déclarer le routage de l'application
webApp.config(function($stateProvider, $urlRouterProvider, RestangularProvider, USERS_ROLES, BACKEND_URL) {

//Mise en place de l'url de base pour restangular
    RestangularProvider.setBaseUrl(BACKEND_URL);


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

        .state("annee", {
            url: "/annee",
            templateUrl: "views/public/listeAnnee.html",
            controller: "PlanAnneeController"
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
            controller: "AdminController",
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
webApp.controller("ActivationController",
	function($scope, serviceActivation, id, token) {
    
    $scope.user = {};
    $scope.user.id = id;
    $scope.activation = {};
    
    serviceActivation.Activation(id,token).then(function(bool){
        if (bool == 1)
            $scope.activation.message = "Votre compte a bien été activé";
        else
            $scope.activation.message = "Il y a eu un problème lors de l'activation";
    },function(){
        $scope.activation.message = "Il y a eu un problème lors de l'activation";
    });
    
    $scope.submit = function(user){
        serviceActivation.SetFirstPassword(user).then(function(bool){
            if (bool == 1)
                $scope.creationMdp = true;
                $scope.form.message = "Le mot de passe a été créé correctement, vous pouvez vous connectez avec le lien en haut à droite"
        })
    }
});
//Dans ce fichier on va mettre en place les différents controllers qui seront liés à la view
// Il faut voir ça comme des sections de codes seulement accessibles dans la zone html où elles sont déclarées

// Un paramètre qui reviendra constamment est $scope, il faut le voir comme un "sac à variables" que l'on va
// par suite utiliser dans notre html 


//controller du modal de login
webApp.controller("loginController",
	function($scope, $state, $uibModalInstance, $window, Authentification ) {
	$scope.user = {};
	$scope.form = {};
	$scope.error = false;
	
	//fonction qui vérifie si le form est valide
	$scope.submit = function() {
		$scope.submitted = true;
		if (!$scope.form.$invalid) {
			$scope.login($scope.user);
		} else {
			$scope.error = true;
			return;
		}
	};

	//Fonction utilisant la fonction login de la factory authenfication
	$scope.login = function(user) {
		$scope.error = false;
		Authentification.login(user, function(user) {
			//2ème paramètre = fonction de succès
			$uibModalInstance.close();
			if (user)
			    $state.go(user.home);
		}, function() {
			//3ème paramètre fonction d'echec
		    $scope.errorMessage = "Le serveur n'a pas accepté vos identifiants";
			$scope.error = true;
		});
	};
	
	// Check au début si l'utilisateur a déjà une sesssion en cours (au cas d'un refresh)
	if ($window.sessionStorage["userData"]) {
		try {
		var user = JSON.parse($window.sessionStorage["userData"]);
		$scope.login(user);	
		} catch (error) {}		
	}

});
webApp.controller("mainController", function ($scope, $rootScope, $uibModal, Authentification, Session, AUTH_EVENTS, USERS_ROLES) {

    $scope.navCollapsed = true;

	$scope.modalShown = false;
    
	var showLogin = function() {
		if(!$scope.modalShown){
			$scope.modalShown = true;
			var modalInstance = $uibModal.open({
				templateUrl : "modals/login.html",
				controller : "loginController",
				backdrop : "static"
			});

			modalInstance.result.then(function() {
				$scope.modalShown = false;
			});
		}
	};
	
	var setCurrentUser = function(){
		$scope.currentUser = Session;
	}
	
	var showNotAuthorized = function(){
		alert("Zone non autorisé");
	}
	
    $scope.login = function(){
		showLogin();
	}
    
	$scope.logout = function(){
		Authentification.logout();
	}
	
	$scope.currentUser = null;
	$scope.userRoles = USERS_ROLES;
	$scope.isAuthorized = Authentification.isAuthorized;

	//Rajout des listeners pour les évenements de login
	$rootScope.$on(AUTH_EVENTS.notAuthorized, showNotAuthorized);
	$rootScope.$on(AUTH_EVENTS.notAuthenticated, showLogin);
	$rootScope.$on(AUTH_EVENTS.sessionTimeout, showLogin);
	$rootScope.$on(AUTH_EVENTS.logoutSuccess, showLogin);
	$rootScope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);
	
});
webApp.controller("ProfilController",
	function ($scope, $rootScope, profilService, Session, themes) {

	    $scope.emails = {};
	    $scope.passwords = {};

	    $scope.isSavedEmail = false; 
	    $scope.isSavingEmail = false;

	    $scope.isSavingPassword = false;
	    $scope.isSavedPassword = false;

	    $scope.user = Session;

	    $scope.saveEmail = function() {
	        $scope.isSavingEmail = true;
	        profilService.changeEmail($scope.emails).then(function() {
	            $scope.isSavingEmail = false;
	            $scope.isSavedEmail = true;
	        }, function (message) {
	            $scope.isSavingEmail = false;
	            $scope.errorEmail = message;
	        });
	    };

	    $scope.savePassword = function () {
	        $scope.isSavingPassword = true;
	        profilService.changePassword($scope.passwords).then(function () {
	            $scope.isSavingPassword = false;
	            $scope.isSavedPassword = true;
	        }, function (message) {
	            $scope.isSavingPassword = false;
	            $scope.errorPassword = message;
	        });
	    }
        
        $scope.changeTheme = function(choice){
          themes.select(choice);  
        };
        $scope.changeButton = function(choice){
            themes.selectButton(choice);
        }
	});
//Ce filtre récupère chaque instance unique d'une valeur dans un tableau
// Cela permet d'avoir un dropdown comme filtre avec tous les choix possibles selon les données du tableau ( C'est dynamique! O_O ) 
webApp.filter("unique", function() {
    return function (array, champ) {
        var o = {}, i, l = array.length, r = [];
        for(i=0; i<l;i+=1) {
            o[array[i][champ]] = array[i];
        }
        for(i in o) {
            r.push(o[i]);
        }
        return r;
    };
  })
webApp.factory("serviceActivation",
	function(Restangular){
		return {
			Activation: function(id,token){
				return Restangular.one("activation",id).one("token",token).get();
			},
            SetFirstPassword: function(user){
				return Restangular.all("set_firstpassword").post(user);
			},
		}
	})
webApp.factory("helper", function () {
    return {

        //Permet de récupérer l'objet d'un array par son id en indiquant le nom de la propriété par laquelle
        // il faut itérer.
        getObjectFromArray: function (arr, property , id) {
            var result = arr.filter(function (o) { return o[property] == id; });
            return result ? result[0] : null;
        },

        deleteObjectFromArray: function(arr, property, id) {
            return arr.filter(function (o) { return o[property] != id; });
        },

        getObjectFromDateInArray: function(arr, property, date) {
            var result = arr.filter(function (o) { return moment(o[property]).isSame(date,"day"); });
            return result ? result[0] : null;
        },

        getPeriodFromDateInArray: function (arr, date) {
            var resultFiltered = arr.filter(function (o) { return moment(date).isBetween(o["start"],o["end"]); });
            return resultFiltered ? resultFiltered[0] : null;
        }
    }
});
webApp.factory("initializers", function(matieresService, classesService, enseignantsService) {

    function planification() {
        matieresService.updateList();
        classesService.updateList();
        enseignantsService.updateList();
    }

    return {
        planification: planification
    }
});
webApp.factory("serviceMatieres",
	function(Restangular){
		return {
			getMatieres: function(){
				return Restangular.all("matieres").getList();
			},
		}
	})
webApp.factory("notifService", function (toastr) {

    function saving() {
        toastr.clear();
        toastr.info("Sauvegarde en cours...");
    };

    function saved() {
        toastr.clear();
        toastr.success("Sauvegarde terminée!");
    };

    function deleting() {
        toastr.clear();
        toastr.info("Suppression en cours...");
    };

    function deleted() {
        toastr.clear();
        toastr.success("Suppression terminée!");
    };

    function sending() {
        toastr.clear();
        toastr.info("Envoi des assignations en cours...");
    };

    function sent() {
        toastr.clear();
        toastr.success("Assignations envoyées!");
    };
    function error(message) {
        toastr.clear();
        toastr.error(message,"Erreur");
    };

    return {
        saving: saving,
        saved: saved,
        deleting: deleting,
        deleted: deleted,
        error: error,
        sending: sending,
        sent: sent
    }
});
webApp.factory("profilService", function ($q, Restangular) {    
    return {
        changePassword : function(passwords) {
            return $q(function(resolve, reject) {
                Restangular.one("changePassword").doPOST(passwords).then(function() {
                    resolve("ok");
                },function() {
                    reject("Il y a eu un probl�me sur le serveur");
                });
            });
        },
        changeEmail: function (emails) {
            return $q(function (resolve, reject) {
                Restangular.one("changeEmail").doPOST(emails).then(function () {
                    resolve("ok");
                }, function () {
                    reject("Il y a eu un probl�me sur le serveur");
                });
            });
        }
    };
});
webApp.factory("serviceRoles",
	function(Restangular){
		return {
			getRoles: function(){
				return Restangular.all("roles").getList();
			},
		}
	})
//Session utilisateur Javascript ( garder au chaud dans la session du navigateur par la factory Authentification)
webApp.service("Session", function($rootScope, USERS_ROLES) {

	this.create = function(user) {
		this.user = user.name;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.roles = user.roles;
		this.token = user.token;
		this.home = user.home;
		this.id = user.id;
		this.email = user.email;
        this.theme = user.theme;
        $rootScope.theme = user.theme; 
	};
	this.destroy = function() {
		this.user = null;
		this.firstName = null;
		this.lastName = null;
		this.roles = null;
		this.token = null;
		this.home = null;
		this.id = null;
	    this.email = null;
        this.theme = null;
	};
	return this;
});



webApp.factory("themes", function ($rootScope, $state, notifService, Restangular) {    
    
    $rootScope.themes = {
        "cerulean" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css",
        "cosmo" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cosmo/bootstrap.min.css",
        "cyborg" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cyborg/bootstrap.min.css",
        "darkly" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/darkly/bootstrap.min.css",
        "flatly": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/flatly/bootstrap.min.css",
        "journal": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/journal/bootstrap.min.css",
        "lumen": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css",
        "paper": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/paper/bootstrap.min.css",
        "readable": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/readable/bootstrap.min.css",
        "sandstone": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/sandstone/bootstrap.min.css",
        "simplex": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/simplex/bootstrap.min.css",
        "slate": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/slate/bootstrap.min.css",
        "spacelab": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/spacelab/bootstrap.min.css",
        "superhero": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/superhero/bootstrap.min.css",
        "united": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/united/bootstrap.min.css",
        "yeti": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/yeti/bootstrap.min.css"
    }   
    
    function select(choice){
        notifService.saving();
        Restangular.all("theme").post({ theme: choice}).then(function(){
            notifService.saved();
            $rootScope.theme = choice;
        },function(){
            notifService.error("Votre choix n'a pas été sauvegardé");
        });
    }
    
    return {
        select:select
    };
});
//Ce controller utilise le service AdminController ainsi que le service pré-installé $filter ET le paramètre passé par l'URL
// pour récupérer un utilisateur en particulier
webApp.controller("AdminDetails",
	function($scope, $timeout, $uibModalInstance,  adminService, personne, serviceRoles, Restangular){
		
	    $scope.personne = {};
		$scope.roles = {};
		$scope.formRoles = {};
	    $scope.creation = personne ? false : true;

	    serviceRoles.getRoles().then(function(roles) {
	        $scope.roles = roles;
	    });

		if (personne === -1) {
			$scope.creation = true;
            listeners();
		}
		else {
			adminService.getOne(personne.id).then(function (personne) {
				Restangular.copy(personne, $scope.personne);

			    angular.forEach(personne.roles, function(role) {
			        $scope.formRoles[role.id] = true;
			    }, this);
			});
            listeners();
		}
			
		// Fonctions
        
        function listeners() {
            $scope.$watch(function () {
                return $scope.personne.firstName;   
            },function(){
                if ($scope.personne.firstName != undefined && $scope.personne.lastName != undefined)
                    changeLogin();
            }, true);
            
            $scope.$watch(function () {
                return $scope.personne.lastName;   
            },function(){
                if ($scope.personne.firstName != undefined && $scope.personne.lastName != undefined)
                    changeLogin();
            }, true);
            
            $scope.$watch(function () {
                return $scope.formRoles;
            }, function (value) {
                $scope.personne.roles = [];
                angular.forEach($scope.formRoles, function (v, k) {
                    v && $scope.personne.roles.push(getRolesById(k));
                });
            }, true);
        }
		// Fonctions
		function getRolesById(id) {
			for (var i = 0; i < $scope.roles.length; i++) {
				if ($scope.roles[i].id == id) {
					return $scope.roles[i];
				}
			}
		};

        function changeLogin(){
            $scope.personne.login = $scope.personne.firstName.substring(0,1).toLowerCase() + $scope.personne.lastName.toLowerCase();
        }

        if(!$scope.creation){
            adminService.getOne(personne.id).then(function (data) {
                $scope.personne = data;
            });
        }
        else {
            $scope.personne = adminService.getNew();
        }
        
		$scope.save = function () {
		    $scope.personne.toDelete = false;
            $uibModalInstance.close($scope.personne);
		};
        
        $scope.remove = function () {
            $scope.personne.toDelete = true;
            $uibModalInstance.close($scope.personne);
		};
        
		$scope.cancel = function () {
			$uibModalInstance.dismiss("Annuler");
		};        
	});
//Ce controller utilise le service AdminController pour récupérer une liste des utilisateurs du serveur
webApp.controller("AdminController",
	function($scope, $uibModal, Restangular, adminService){
        
		$scope.personnes = [];

	    adminService.getList().then(function(data) {
	        $scope.personnes = data;
	        $scope.personnesView = [].concat($scope.personnes);
	    });
		
		updateTable();
		$scope.openDetails = function (personne) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.personne = personne;

			var modalDetails = $uibModal.open({
				animation: true,
				templateUrl: "modals/personnesDetails.html",
				controller: "AdminDetails",
				size: "md",
				resolve: {
					personne: function () {
						return $scope.personne;
					}
				}
			});

			modalDetails.result.then(function (personneP) {
                if (personneP.toDelete) {
                    $scope.remove(personneP);
                } else {
                    adminService.save(personneP).then(function () {
                        updateTable();
                    });
                }
			});
		};

		$scope.remove = function (personne) {
		    adminService.remove(personne).then(function() {
		        updateTable();
		    });
		};

		function updateTable() {
		    adminService.updateList().then(function () {
		        adminService.getList().then(function(personnes) {
					Restangular.copy(personnes, $scope.personnes);
					$scope.personnesView = [].concat($scope.personnes);
		        });	        
		    });
		}

		$scope.changeState = function (personne) {
		    adminService.getOne(personne.id).then(function(per) {
		        per.enabled = personne.enabled == '1' ? 0 : 1;
		        per.save();
		        updateTable();
		    });
		};
	});
webApp.controller("EnsCalendarController",
	function ($scope, ensCalendarService) {
	    $scope.calendarConfig = ensCalendarService.calendarConfig;
	    $scope.eventSources = ensCalendarService.eventSources;
});
webApp.controller("EnsCoursController",
	function ($scope, $window, Session, ensCours, Restangular, BACKEND_URL) {

	    $scope.id = Session.id;
		$scope.host = $window.location.hostname;
		$scope.BACKEND_URL = BACKEND_URL;
		$scope.cours = [];

		updateTable();

		function updateTable() {
			ensCours.getCours().then(function (cours) {
			    angular.forEach(cours, function(element) {
			        element.periode = moment(element.start).hour() == 8 ? "matin" : "après-midi";
			        element.date = moment(element.start).format("DD-MM-YYYY");
			    });
				Restangular.copy(cours, $scope.cours);
				$scope.coursView = [].concat($scope.cours);
			});
		}       
	});
webApp.controller("indisposController",
	function ($scope, ensCalendarService, indispoService) {

        //Initialisation
	    $scope.isLoading = true;
	    $scope.error = "";
	    $scope.isModified = indispoService.listModified();

	    $scope.calendarConfig = ensCalendarService.calendarConfig;
	    $scope.eventSource = [];

	    update();

        //Fonctions pour boutons
	    $scope.addPeriod = function () {
	        indispoService.openPeriodeModal();
	    }

	    $scope.saveChanges = function() {
	        indispoService.updateIndispos();
	    }

	    $scope.cancelChanges = function () {
	        update();
	    }

        //fonction mettant à jour liste client avec liste serveur
        function update() {
            indispoService.getServerIndispos().then(function () {
                $scope.isLoading = false;
            }, function () {
                $scope.error = "Il y a eu une erreur avec le serveur.";
            });
        }

        //Watch sur listModified pour faire apparaitre les boutons sauvegarde/cancel
        //A Refaire avec emit/on pour limiter l'overhead
	    $scope.$watch(function () { return indispoService.listModified() },
            function (newValue, oldValue) {
	        if (newValue !== oldValue) {
	            $scope.isModified = indispoService.listModified();
	        }
	    });
	});
webApp.controller("periodeModal",
    function($scope, indispo, $uibModalInstance) {

        $scope.indispo = indispo;
        if (!indispo.isNew) {
            $scope.indispo.start = moment($scope.indispo.start).startOf("day").toDate();
            $scope.indispo.end = moment($scope.indispo.end).startOf("day").toDate();
        }

        $scope.pickerDateDebut = {
            opened: false
        }
        $scope.pickerDateFin = {
            opened: false
        }

        $scope.openPickerDebut = function () {
            $scope.pickerDateDebut.opened = true;
        };
        $scope.openPickerFin = function () {
            $scope.pickerDateFin.opened = true;
        };

        $scope.save = function () {
            //TO Do revoir construction de la date
            $scope.indispo.start = moment($scope.indispo.start).hour(8).format("YYYY-MM-DD HH:mm:ss");;
            $scope.indispo.end = moment($scope.indispo.end).hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss");;
            $scope.indispo.toSave = true;
            $uibModalInstance.close($scope.indispo);
        };

        $scope.delete = function () {
            $scope.indispo.toSave = false;
            $uibModalInstance.close($scope.indispo);
        };

        $scope.dismiss = function () {
            $uibModalInstance.dimiss("cancel");
        };
    });
webApp.controller("planificationController", function (initializers) {
    initializers.planification();
});
webApp.controller("PlanAnneeController",
	function ($scope, $uibModal, $http, classesService, weekService, BACKEND_URL) {
		
		$scope.BACKEND_URL = BACKEND_URL;
	    $scope.current_classes = [];
	    $scope.next_classes = [];
		
	    classesService.getCurrentNextList('current').then(function (classes) {
	        $scope.current_classes = classes;
	        $scope.classesView = [].concat($scope.current_classes);
	    });

	    classesService.getCurrentNextList('next').then(function (classes) {
	        $scope.next_classes = classes;
	        $scope.next_classesView = [].concat($scope.next_classes);
	    });

	    $scope.year = "";
	    $scope.nextyear = "";
	    $scope.week = [];
	    weekService.getList('current').then(function (week) {
	        $scope.week = week;
	        $scope.weekView = [].concat($scope.week);
	    });

	    $scope.nextweek = [];
	    weekService.getList('next').then(function(week) {
	        $scope.nextweek = week;
	        $scope.nextweekView = [].concat($scope.nextweek);
	    });

	    $http({
	        method: 'GET',
	        url: BACKEND_URL + 'plan/years/current'
	    }).then(function successCallback(response) {
	        $scope.year = response.data.year;
	    }, function errorCallback(response) {
	    });
	    $http({
	        method: 'GET',
	        url: BACKEND_URL + 'plan/years/next'
	    }).then(function successCallback(response) {
	        $scope.nextyear = response.data.year;
	    }, function errorCallback(response) {

	    });
	});
webApp.factory("ensCalendarService",
    function(uiCalendarConfig, indispoService, BACKEND_URL) {

        //Partie pour calendar indispos
        var dayRender = function (date, cell) {
            if (!cell.hasClass("fc-other-month") && moment(date).isAfter(moment().startOf("day"))) {
                if (!cell.hasClass("clickable")) {
                    cell.addClass("clickable");
                }

                cell.empty();
                cell.css("position", "relative");
                
                switch (indispoService.checkDayForIndispo(date)) {
                case 1:
                    cell.append('<p class="day-text"><strong>Journée</strong></p>');
                    cell.css("background-color", "#FF4136");
                    break;
                case 2:
                    cell.append('<p class="day-text"><strong>Matin</strong></p>');
                    cell.css("background-color", "#FFDC00");
                    break;
                case 3:
                    cell.append('<p class="day-text"><strong>Après-midi</strong></p>');
                    cell.css("background-color", "#FF851B");
                    break;
                case 4:
                    cell.append('<p class="day-text"><strong>Période</strong></p>');
                    cell.css("background-color", "#AAAAAA");
                    break;
                case 0:
                    cell.append('<p class="day-text"><strong>Disponible</strong></p>');
                    cell.css("background-color", "#2ECC40");
                    break;
                }
            }
        };

        var dayClick = function (date, jsEvent, view) {
            var i = indispoService.checkDayForIndispo(date);
            if (i !== 4) {
                indispoService.changeIndispoType(date);
                dayRender(date, $(this));
                //uiCalendarConfig.calendars.indisposCalendar
            } else {
                //TO DO
                indispoService.openPeriodeModal(date);
            }
        }

        //Partie pour calendar cours

        var eventsGoogle = {
            googleCalendarId: "fr.french#holiday@group.v.calendar.google.com",
            googleCalendarApiKey: "AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M",
            className: "gcal-event",
            currentTimezone: "Europe/Paris"
        };

        var events = {
            url: BACKEND_URL + "public/cours",
            color: "green",
            className: "coursEvent",
            eventDataTransform: function (rawEventData) {
                return {
                    id: rawEventData.id,
                    title: rawEventData.matiere.nom,
                    enseignant: rawEventData.user != undefined ? rawEventData.user.firstName + " " + rawEventData.user.lastName : "",
                    classes: printClasses(rawEventData.classes),
                    start: rawEventData.start,
                    end: rawEventData.end,
                    assignationSent: rawEventData.assignationSent
                };
            }
        };

        function printClasses(classes) {
            var result = "";
            classes.forEach(function (classe) {
                result += classe.nom + " ";
            });
            return result;
        }

        var eventSources = [eventsGoogle, events];

        var eventRender = function (event, element, view) {
            if (view.type == "agendaWeek")
                if (element.hasClass("coursEvent")) {
                    element.find(".fc-content").append("<p>" + event.enseignant + "</p>");
                    element.find(".fc-content").append("<p>" + event.classes + "</p>");
                }
        };

        /* Configs : */

        var calendarConfig = {
            calendarIndispos: {
                height: 540,
                editable: false,
                header: {
                    left: "title",
                    right: "today prev,next"
                },
                weekends: false,
                weekNumbers: true,
                dayRender: dayRender,
                dayClick: dayClick,
                minTime: "08:00:00",
                maxTime: "17:30:00",
                dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
            },
            calendarCours: {
                height: 540,
                editable: false,
                header: {
                    left: "title",
                    center: "month,agendaWeek",
                    right: "today prev,next"
                },
                weekends: false,
                weekNumbers: true,
                eventRender: eventRender,
                minTime: "08:00:00",
                maxTime: "17:30:00",
                dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
            }
        };

        return {
            calendarConfig: calendarConfig,
            eventSources: eventSources
        }
    })
webApp.factory("ensCours",
	function(Restangular){
		return {
			getCours: function(){
				return Restangular.all("ens/cours").getList();
			}         
		}
	})
webApp.factory("indispoService",
    function ($q, $uibModal, helper, Restangular, uiCalendarConfig, notifService) {

        var indispos = [];

        var listModified = false;

        function getServerIndispos() {
            return $q(function(resolve, reject) {
                Restangular.all("ens/indispo").getList().then(
                    function(data) {
                        indispos = [].concat(data.plain());
                        listModified = false;
                        //peut-être à mettre dans le service calendar (force la mise à jour de l'ui) :
                        uiCalendarConfig.calendars.indisposCalendar.fullCalendar('prev');
                        uiCalendarConfig.calendars.indisposCalendar.fullCalendar('next');
                        resolve(true);
                    }, function() {
                        reject(false);
                    });
            });
        };

        function checkDayForIndispo(date) {
            var result = 0;
            var indispo = helper.getObjectFromDateInArray(indispos, "start", date);
            if (indispo) {
                if (indispo.toDelete) {
                    result = 0;
                }
                else if (moment(indispo.start).hour() === 8 && moment(indispo.end).hour() === 17 && (moment(indispo.start).isSame(indispo.end, "day"))) {
                    result = 1;
                } else if (moment(indispo.start).hour() === 8 && moment(indispo.end).hour() === 12) {
                    result = 2;
                } else if (moment(indispo.start).hour() === 13 && moment(indispo.end).hour() === 17) {
                    result = 3;
                } else {
                    result = 4;
                }
            } else {
                if (helper.getPeriodFromDateInArray(indispos, date)) {
                    result = 4;
                }
            }

            return result;
        };

        function changeIndispoType(date) {
            var indispo = helper.getObjectFromDateInArray(indispos, "start", date);
            if (indispo) {
                indispo.isModified = true;

                //Si Disponible -> Journée
                if (indispo.toDelete) {
                    indispo.start = moment(indispo.start).hour(8).format("YYYY-MM-DD HH:mm:ss");
                    indispo.toDelete = false;
                }
                //Si Journée -> Matin
                else if (moment(indispo.start).hour() === 8 && moment(indispo.end).hour() === 17) {
                    indispo.end = moment(indispo.end).hour(12).minutes(15).format("YYYY-MM-DD HH:mm:ss");
                }
                //Si Matin -> Après-midi
                else if (moment(indispo.start).hour() === 8 && moment(indispo.end).hour() === 12) {
                    indispo.start = moment(indispo.start).hour(13).minutes(15).format("YYYY-MM-DD HH:mm:ss");
                    indispo.end = moment(indispo.end).hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss");
                }
                //Si Après-midi -> Disponible
                else if (moment(indispo.start).hour() === 13 && moment(indispo.end).hour() === 17) {
                    indispo.toDelete = true;
                    indispo.isModified = false;
                }
                //Si Disponible -> Journée
            } else {
                var newIndispo = {};
                newIndispo.start = date.hour(8).format("YYYY-MM-DD HH:mm:ss");
                newIndispo.end = date.hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss");
                newIndispo.isModified = true;
                indispos.push(newIndispo);
            }
            listModified = true;
        };

        function updateIndispos() {

            var promises = [];

            indispos.forEach(function (ind) {
                if (ind.isModified) {
                    promises.push(Restangular.all("ens/indispo").post(ind));
                }
                if (ind.toDelete) {
                    promises.push(Restangular.one("ens/indispo", ind.id).remove());
                }
            });

            notifService.saving();
            //Attendre que toutes les promesses soit remplies avant de mettre à jour l'ui!
            $q.all(promises).then(function() {
                getServerIndispos();
                listModified = false;
                notifService.saved();
                return true;
            },function() {
                getServerIndispos();
                listModified = false;
                notifService.error("Un problème avec le serveur a empeché la sauvegarde");
                return false;
            });
        };

        function openPeriodeModal(date) {
            var indispo = date ? helper.getPeriodFromDateInArray(indispos, date) : { isNew:true };
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "modals/indispos/periodeModal.html",
                controller: "periodeModal",
                size: "md",
                resolve: {
                    indispo: function () {
                        return Object.create(indispo);
                    }
                }
            });

            modalInstance.result.then(function (newIndispo) {
                if (newIndispo.toSave) {
                    Restangular.all("ens/indispo").post(newIndispo).then(function() {
                        getServerIndispos();
                    });
                } else {
                    Restangular.one("ens/indispo", newIndispo.id).remove().then(function () {
                        getServerIndispos();
                    });
                }
            }, function () {
                //Logique à mettre?
            });
        };
        return {

            getIndispos: function() {
                return indispos;
            },

            listModified: function () {
                return listModified;
            },

            getServerIndispos: getServerIndispos,

            checkDayForIndispo: checkDayForIndispo,

            changeIndispoType: changeIndispoType,

            updateIndispos: updateIndispos,

            openPeriodeModal: openPeriodeModal
        }
    })
webApp.factory("adminService",
    function($q, notifService, Restangular) {

        var list = [];

        function updateList() {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.all("admin/personnes").getList().then(function(data) {
                    list = [].concat(data);
                    //TO DO SUCCESS TOASTR
                    resolve();
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function getList() {
            return $q(function(resolve, reject) {
                if (list) {
                    resolve(list);
                } else {
                    console.log(list);
                    updateList().then(function() {
                        resolve(list);
                    });
                }
            });
        };

        function getOne(id) {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.one("admin/personnes", id).get().then(function(data) {
                    //TO DO SUCCESS TOASTR
                    resolve(data);
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function getNew() {
            return Restangular.one("admin/personnes");
        };

        function save(personne) {
            return $q(function(resolve, reject) {
                notifService.saving();
                personne.save().then(function() {
                    notifService.saved();
                    resolve();
                }, function(response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        };

        function remove(personne) {
            return $q(function(resolve, reject) {
                notifService.deleting();
                personne.remove().then(function() {
                    notifService.deleted();
                    resolve();
                }, function(response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        }

        return {

            updateList: updateList,

            getList: getList,

            getOne: getOne,

            getNew: getNew,

            save: save,

            remove: remove
        }
    })
webApp.factory("Authentification",function($rootScope, $window, Session, AUTH_EVENTS, Restangular) {
	var authService = {};		
	
	//la fonction login
	authService.login = function(user, success, error) {
	
	Restangular.all("login").post(user)
	.then(function(data) {
		if(data){
			var user = data;
			//Stockage des données utilisateurs dans le navigateur
			$window.sessionStorage["userData"] = JSON.stringify(user);
			Session.create(user);
			
			//Déclencher l'evenement loginSuccess
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			//lancer la fonction succès ( 2eme paramètre)
			success(user);
		}
	}, function() {
	            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	            error();
	        }
	    )};

	//verification si user est connecté
	authService.isAuthenticated = function() {
		return !!Session.user; // le double point d'exclamation force un booléan 
	};
	
	//verification si user est autorisé
	authService.isAuthorized = function(authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
	      authorizedRoles = [authorizedRoles];
	    }
		var bool = false;
		if (authService.isAuthenticated()){
			angular.forEach(Session.roles, function(role) {
				if (authorizedRoles.indexOf(role) !== -1)
					bool = true;
				});
		}
	    return bool;
	};
	
	//logout de l'utilisateur, destruction de la session ( javascript + naviguateur)
	authService.logout = function () {
	    Restangular.one("logout").doPOST();
		Session.destroy();
		$window.sessionStorage.removeItem("userData");
		$window.location.reload();
		//$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
	}

	return authService;
});


webApp.factory("AuthInterceptor",function($rootScope, $q, Session, AUTH_EVENTS) {
	return {
		responseError : function(response) {
			$rootScope.$broadcast({
				401 : AUTH_EVENTS.notAuthenticated,
				403 : AUTH_EVENTS.notAuthorized,
				419 : AUTH_EVENTS.sessionTimeout,
				440 : AUTH_EVENTS.sessionTimeout
			}[response.status], response);
			return $q.reject(response);
		}
	};
});
webApp.factory("planCalendarService",
    function(uiCalendarConfig, $uibModal, coursService, enseignantsService, BACKEND_URL) {

        var eventRender = function(event, element, view) {

            if (view.type === "agendaWeek") {
                if (element.hasClass("coursContainer") && moment(event.start).isAfter(moment().startOf("day"))) {
                    element.find(".fc-bg").append("<div>" + event.description + "</div>");
                    element.addClass("clickable");
                }
                if (element.hasClass("coursEvent")) {
                    element.find(".fc-content").append("<p>" + event.enseignant + "</p>");
                    element.find(".fc-content").append("<p>" + event.classes + "</p>");
                }
            } else {
                if (element.hasClass("coursContainer")) {
                    element.css("display", "none");
                }                  
            }
            if(event.assignationSent == 0) {
                element.css("backgroundColor", "#FF851B");
            }
        };

        var eventClick = function(event, jsEvent, view) {
            if (view.type === "agendaWeek" && moment(event.start).isAfter(moment().startOf("day"))) {
                //openEventDetails(event);
                var modalDetails = $uibModal.open({
                    animation: true,
                    templateUrl: "modals/coursDetails.html",
                    controller: "CoursDetails",
                    size: "md",
                    resolve: {
                        event: function() {
                            return event;
                        }
                    }
                });

                modalDetails.result.then(function (coursP) {
                    if (coursP.toDelete) {
                        coursService.remove(coursP).then(function () {
                            enseignantsService.updateList();
                            uiCalendarConfig.calendars.planCalendar.fullCalendar("removeEventSource", events);
                            uiCalendarConfig.calendars.planCalendar.fullCalendar("addEventSource", events);
                        });
                    } else {
                        coursService.save(coursP).then(function () {
                            enseignantsService.updateList();
                            uiCalendarConfig.calendars.planCalendar.fullCalendar("removeEventSource", events);
                            uiCalendarConfig.calendars.planCalendar.fullCalendar("addEventSource", events);
                        });
                    }
                    
                });
            }
        };

        var sendAssignations = function(){
            var view = uiCalendarConfig.calendars.planCalendar.fullCalendar("getView");
            coursService.sendAssignations(view.intervalStart.format(), view.intervalEnd.format()).then(function() {
                uiCalendarConfig.calendars.planCalendar.fullCalendar("removeEventSource", events);
                uiCalendarConfig.calendars.planCalendar.fullCalendar("addEventSource", events);
            });          
        };

        /* Configuration du calendrier */
        var config = {
            calendar: {
                height: 540,
                editable: false,
                customButtons: {
                    sendMail: {
                        text: "Envoyer mails d'assignations",
                        click: sendAssignations
                    }
                },
                header: {
                    left: "title, sendMail",
                    center: "month,agendaWeek",
                    right: "today prev,next"
                },
                weekends: false,
                weekNumbers: true,
                eventRender: eventRender,
                eventClick: eventClick,
                minTime: "08:00:00",
                maxTime: "17:30:00",
                defaultView: "agendaWeek",
                dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
            }
        };

        //Données du calendrier

        var events = {
            url: BACKEND_URL + "plan/cours",
            color: "green",
            className: "coursEvent",
            eventDataTransform: function(rawEventData) {
                return {
                    id: rawEventData.id,
                    title: rawEventData.matiere.nom,
                    enseignant: rawEventData.user != undefined ? rawEventData.user.firstName + " " + rawEventData.user.lastName : "",
                    classes: printClasses(rawEventData.classes),
                    start: rawEventData.start,
                    end: rawEventData.end,
                    assignationSent: rawEventData.assignationSent
            };
            }
        };
        
        function printClasses(classes) {
            var result = "";
            classes.forEach(function(classe) {
                result += classe.nom + " ";
            });
            return result;
        }
        //Fond clickable pour rajouter les cours
        var backgroundEvent = [
            {
                start: "8:00",
                end: "12:15",
                dow: [1, 2, 3, 4, 5],
                className: "coursContainer",
                description: "Rajouter un cours"
            },
            {
                start: "13:15",
                end: "17:30",
                dow: [1, 2, 3, 4, 5],
                className: "coursContainer",
                description: "Rajouter un cours"
            }
        ];

        var eventsGoogle = {
            googleCalendarId: "fr.french#holiday@group.v.calendar.google.com",
            googleCalendarApiKey: "AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M",
            className: "gcal-event",
            currentTimezone: "Europe/Paris"
        };

        /* Arrays de avec données de base du calendrier (au chargement de la page) */
        var feed = [events, eventsGoogle, backgroundEvent];

        return {
            config: config,
            feed: feed
        }
    })
webApp.factory("classesService",
	function ($q, notifService, Restangular) {
	    var list = [];

	    function updateList() {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.all("plan/classe").getList().then(function (data) {
	                angular.forEach(data, function (element) {
	                    element.annee = element.start.substr(0, 4) + "/" + element.end.substr(0, 4);
	                });
	                list = [].concat(data.plain());
	                //TO DO SUCCESS TOASTR
	                resolve();
	            }, function () {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function updateCurrentNextList(year) {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.one("plan/current_next_classe", year).getList().then(function (data) {
	                angular.forEach(data, function (element) {
	                    element.annee = element.start.substr(0, 4) + "/" + element.end.substr(0, 4);
	                });
	                list = [].concat(data.plain());
	                //TO DO SUCCESS TOASTR
	                resolve();
	            }, function () {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function getList() {
	        return $q(function (resolve, reject) {
	            updateList().then(function () {
	                resolve(list);
	            });
	        });
	    };

	    function getCurrentNextList(year) {
	        return $q(function (resolve, reject) {
	            updateCurrentNextList(year).then(function () {
	                resolve(list);
	            });
	        });
	    };

	    function getOne(id) {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.one("plan/classe", id).get().then(function (data) {
	                data.annee = data.start.substr(0, 4) + "/" + data.end.substr(0, 4);
	                data.start = moment(data.start).startOf("day").toDate();
	                data.end = moment(data.end).startOf("day").toDate();
	                data.id_Users = Number(data.id_Users);
	                //TO DO SUCCESS TOASTR
	                resolve(data);
	            }, function () {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function getNew() {
	        return Restangular.one("plan/classe");
	    };

	    function save(classe) {
	        return $q(function (resolve, reject) {
	            notifService.saving();
	            classe.save().then(function () {
	                notifService.saved();
	                resolve();
	            }, function (message) {
	                notifService.error(message);
	                reject();
	            });
	        });
	    };

	    function remove(classe) {
	        return $q(function (resolve, reject) {
	            notifService.deleting();
	            classe.remove().then(function () {
	                notifService.deleted();
	                resolve();
	            }, function (response) {
	                notifService.error(response.data.message);
	                reject();
	            });
	        });
	    }

	    return {
	        updateList: updateList,

	        getList: getList,

	        updateCurrentNextList: updateCurrentNextList,

	        getCurrentNextList: getCurrentNextList,

	        getOne: getOne,

	        getNew: getNew,

	        save: save,

	        remove: remove
	    }
	})
webApp.factory("coursService",
	function($q, Restangular, notifService){

	    function getOne(id) {
	        return $q(function(resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.one("plan/cours", id).get().then(function (data) {
	                data.id_Users = Number(data.id_Users);
	                data.id_Matieres = Number(data.id_Matieres);
	                //TO DO SUCCESS TOASTR
	                resolve(data);
	            }, function() {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function getNew() {
	        return Restangular.one("plan/cours");
	    };

	    function save(cours) {
	        return $q(function(resolve, reject) {
	            notifService.saving();
	            cours.save().then(function() {
	                notifService.saved();
	                resolve();
	            }, function(response) {
	                notifService.error(response.data.message);
	                reject();
	            });
	        });
	    };

	    function remove(cours) {
	        return $q(function(resolve, reject) {
	            notifService.deleting();
	            cours.remove().then(function() {
	                notifService.deleted();
	                resolve();
	            }, function(response) {
	                notifService.error(response.data.message);
	                reject();
	            });
	        });
	    };
        
        function sendAssignations(start,end) {
            return $q(function(resolve, reject) {
                notifService.sending();
                Restangular.one("plan/cours").customGET("assignation", { start: start, end: end }).then(function() {
                    notifService.sent();
                    resolve();
                }, function(response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        };

	    return {

	        getOne: getOne,

	        getNew: getNew,

	        save: save,

	        remove: remove,
            
            sendAssignations: sendAssignations
	    }
	})
webApp.factory("enseignantsService",
    function($q, notifService, Restangular) {
        
        var list = [];

        function updateList() {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.all("plan/enseignant").getList().then(function (data) {
                    angular.forEach(data, function (element) {
                        element.fullName = element.firstName + " " + element.lastName;
                    });
                    list = [].concat(data);
                    //TO DO SUCCESS TOASTR
                    resolve();
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function getList() {
            return $q(function(resolve, reject) {
                if (list) {
                    resolve(list);
                } else {
                    updateList().then(function() {
                        resolve(list);
                    });
                }
            });
        };

        function getOne(id) {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.one("plan/enseignant", id).get().then(function(data) {
                    //TO DO SUCCESS TOASTR
                    resolve(data);
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function save(enseignant) {
            return $q(function (resolve, reject) {
                notifService.saving();
                enseignant.save().then(function () {
                    notifService.saved();
                    resolve();
                }, function (response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        };

        return {
            updateList: updateList,
            getList: getList,
            getOne: getOne,
            save :save
        }
    })
webApp.factory("matieresService",
    function($q, notifService, Restangular) {

        var list = [];

        function updateList() {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.all("plan/matiere").getList().then(function(data) {
                    list = [].concat(data);
                    //TO DO SUCCESS TOASTR
                    resolve();
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function getList() {
            return $q(function(resolve, reject) {
                if (list) {
                    resolve(list);
                } else {
                    updateList().then(function() {
                        resolve(list);
                    });
                }
            });
        };

        function getOne(id) {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.one("plan/matiere", id).get().then(function(data) {
                    //TO DO SUCCESS TOASTR
                    resolve(data);
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function getNew() {
            return Restangular.one("plan/matiere");
        };

        function save(matiere) {
            return $q(function(resolve, reject) {
                notifService.saving();
                matiere.save().then(function() {
                    notifService.saved();
                    resolve();
                }, function(response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        };

        function remove(matiere) {
            return $q(function(resolve, reject) {
                notifService.deleting();
                matiere.remove().then(function() {
                    notifService.deleted();
                    resolve();
                }, function(response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        }

        return {
            updateList: updateList,

            getList: getList,

            getOne: getOne,

            getNew: getNew,

            save: save,

            remove: remove
        }
    })
webApp.factory("weekService",
	function ($q, notifService, Restangular) {
	    var list = [];

	    function updateList(year) {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.one("plan/weeks", year).getList().then(function (data) {
	                list = [].concat(data.plain());
	                //TO DO SUCCESS TOASTR
	                resolve();
	            }, function () {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function getList(year) {
	        return $q(function (resolve, reject) {
	            updateList(year).then(function () {
	                resolve(list);
	            });
	        });
	    };


	    return {
	        updateList: updateList,

	        getList: getList,
	    }
	})
webApp.controller("PlanCalendar",
	function ($scope, planCalendarService) {
	    $scope.config = planCalendarService.config;
	    $scope.feed = planCalendarService.feed;
	});
webApp.controller("CoursDetails",
	function($scope, $uibModalInstance, helper, coursService, enseignantsService, matieresService, classesService, event){

        $scope.matieres = [];
        $scope.enseignantsBase = [];
        $scope.enseignants = [];
        $scope.classes = [];
        $scope.formClasses = {};

        

        matieresService.getList().then(function (data) {
            $scope.matieres = data;
        });

	    classesService.getList().then(function (data) {
	        $scope.classes = data;
	    });	    

        $scope.creation = event.title ? false : true;
        
        if (!$scope.creation){
            coursService.getOne(event.id).then(function(cours) {
                    $scope.cours = cours;
                    $scope.cours.title = cours.matiere ? cours.matiere.nom : "";                    
                    $scope.cours.title += cours.user ? " | " + cours.user.lastName : "";
                    angular.forEach(cours.classes, function (classe) {
					   $scope.formClasses[classe.id] = true;
                    }, this);
                    enseignantsService.getList().then(function (data) {
                        rajouterDisponibilité(data);
                        $scope.enseignantsBase = [].concat(data);
                        $scope.enseignants = [].concat($scope.enseignantsBase);
                        listeners();
                    });
                    
                });
        }
        else {
            $scope.cours = coursService.getNew();
            $scope.cours.start = event.start.format();
            $scope.cours.end = event.end.format();
            enseignantsService.getList().then(function (data) {
                rajouterDisponibilité(data);
                $scope.enseignantsBase = [].concat(data);
                $scope.enseignants = [].concat($scope.enseignantsBase);
                listeners();
            });
        }
        
        
                
        function listeners(){
            $scope.$watch(function(){
                return $scope.cours.id_Matieres;
            }, function (oldValue, newValue) {
                if (oldValue !== newValue) {
                    $scope.enseignants = [];
                    angular.forEach($scope.enseignantsBase, function (enseignant) {
                        if (filtreEnseignants(enseignant))
                            $scope.enseignants.push(enseignant);
                    });
                }    
            }, true);
            
            $scope.$watch(function () {
			 return $scope.formClasses;
            }, function (value) {
                $scope.cours.classes = [];
                angular.forEach($scope.formClasses, function (v, k) {
                    v && $scope.cours.classes.push(helper.getObjectFromArray($scope.classes,"id",k));
                });
            }, true);       
        };       
        
        function filtreEnseignants(enseignant)
        {
            if (!$scope.cours.id_Matieres)
                return true;
            
            if (helper.getObjectFromArray(enseignant.matieres, "id", $scope.cours.id_Matieres)) {
                return true;
            } else {
                return false;
            }
        }
        
        function rajouterDisponibilité(enseignants) {
            angular.forEach(enseignants, function (enseignant) {
                if (enseignant.id == $scope.cours.id_Users) {
                    enseignant.indisponible = false;
                    enseignant.viewName = enseignant.fullName + " (choix actuel)";
                }
                else if (helper.getPeriodFromDateInArray(enseignant.indisponibilite, event.start)) {
                    enseignant.indisponible = true;
                    enseignant.viewName = enseignant.fullName + " (indisponible)";
                } else {
                    if (helper.getPeriodFromDateInArray(enseignant.cours, event.start)) {
                        enseignant.indisponible = true;
                        enseignant.viewName = enseignant.fullName + " (déjà assigné)";
                    } else {
                        enseignant.indisponible = false;
                        enseignant.viewName = enseignant.fullName;
                    }
                }
            });
        };

        $scope.save = function () {
            $scope.cours.toDelete = false;
            $uibModalInstance.close($scope.cours);
		};
		
        $scope.delete = function () {
            $scope.cours.toDelete = true;
            $uibModalInstance.close($scope.cours);
        };
		$scope.cancel = function(){
			$uibModalInstance.dismiss();
		};
        
        
	});
webApp.controller("PlanClassesController",
	function($scope, $uibModal, classesService){
		
		$scope.classes = [];    
        
		classesService.getList().then(function (classes) {
		    $scope.classes = classes;
		    $scope.classesView = [].concat($scope.classes);
		});
		
		$scope.openClasse = function (classe) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.classe = classe;

			var modalDetails = $uibModal.open({
				animation: true,
				templateUrl: "modals/classesDetails.html",
				controller: "ClasseDetails",
				size: "md",
				resolve: {
					classe: function () {
						return $scope.classe;
					}
				}
			});

			modalDetails.result.then(function (classeP) {
                if (classeP.toDelete) {
                    classesService.remove(classeP).then(function() {
                        updateTable();
                    });
                } else {
                    classesService.save(classeP).then(function() {
                        updateTable();
                    });
                }
			});
		};
		
        $scope.delete = function(classe) {
            classesService.remove(classe).then(function() {
                updateTable();
            });
        }

		function updateTable() {
		    classesService.updateList().then(function() {
		        classesService.getList().then(function(classes) {
		            $scope.classes = classes;
		            $scope.classesView = [].concat($scope.classes);
		        });
		    });
		}
	});
webApp.controller("ClasseDetails",
	function($scope, $timeout, $uibModalInstance, classesService, enseignantsService, classe){

	    enseignantsService.getList().then(function(data) {
	        $scope.enseignants = data;
	    });

		$scope.pickerDateDebut = {
		    opened: false
		}
		$scope.pickerDateFin = {
		    opened: false
		}

		$scope.openPickerDebut = function () {
		    $scope.pickerDateDebut.opened = true;
		};
		$scope.openPickerFin = function () {
		    $scope.pickerDateFin.opened = true;
		};
        
		$scope.creation = classe ? false : true;

        if(!$scope.creation){
            classesService.getOne(classe.id).then(function (data){
                $scope.classe = data;
			});
        }
        else {
            $scope.classe = classesService.getNew();
        }   
		
        $scope.save = function () {
            $scope.classe.toDelete = false;
            $uibModalInstance.close($scope.classe);
		};

        $scope.remove = function () {
            $scope.classe.toDelete = true;
            $uibModalInstance.close($scope.classe);
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		};
	});
webApp.controller("PlanEnseignantsController",
	function($scope, $uibModal, helper, enseignantsService){
		
		$scope.enseignants = [];
		$scope.matieres = [];
		$scope.showMatieresTable = false;

	    enseignantsService.getList().then(function(data) {
	        $scope.enseignants = data;
	        $scope.enseignantsView = [].concat($scope.enseignants);
	    });
		
		$scope.selectedEnseignant = {};
		
		$scope.select = function (enseignant) {
		    $scope.selectedEnseignant = helper.getObjectFromArray($scope.enseignants, "id", enseignant.id);
		    $scope.showMatieresTable = true;
		};
		
		$scope.removeMatiere = function(id){
			// A mettre dans une helper class?
		    $scope.selectedEnseignant.matieres = helper.deleteObjectFromArray($scope.selectedEnseignant.matieres, "id", id);
			$scope.selectedEnseignant.save();
			updateTable();
		};
		
		$scope.showAddForm = function() {
			var modalDetails = $uibModal.open({
				animation : true,
				templateUrl:"modals/listeMatieres.html",
				controller: "EnseignantsMatieresController",
				size: "lg",
				windowClass: "container-fluid",
				resolve:  {
					enseignant : function(){
						return $scope.selectedEnseignant;
					}
				}		
			});

			modalDetails.result.then(function (enseignantP) {
			    enseignantsService.save(enseignantP).then(function() {
			        updateTable();
			    });
			});
		};
		
		function updateTable(){
		    enseignantsService.updateList().then(function () {
		        enseignantsService.getList().then(function(data) {
		            $scope.enseignants = data;
		            $scope.enseignantsView = [].concat($scope.enseignants);
		        });			
			});
		};		
	});
webApp.controller("EnseignantsMatieresController",
	function($scope, $uibModalInstance, helper, matieresService, enseignant){
		
		$scope.matieres = [];
        $scope.enseignant = enseignant;

	    matieresService.getList().then(function(data) {
	        $scope.matieres = data;
	        $scope.matieresView = [].concat($scope.matieres);
	    });
		
		$scope.add = function(matiere) {
			if(!helper.getObjectFromArray($scope.enseignant.matieres,"id",matiere))
			{
				$scope.enseignant.matieres.push(matiere);
			}				
		}
		
		$scope.save = function() {
		    $uibModalInstance.close($scope.enseignant);
		}
		
		$scope.cancel = function(){
			$uibModalInstance.dismiss();
		}		
	});
webApp.controller("PlanMatieresController",
	function($scope, $uibModal, matieresService){
        
		$scope.matieres = [];

	    matieresService.getList().then(function(data) {
	        $scope.matieres = data;
	        $scope.matieresView = [].concat($scope.matieres);
	    });
		
		$scope.open = function (matiere) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.matiere = matiere;

			var modalDetails = $uibModal.open({
				animation: true,
				templateUrl: "modals/matieresDetails.html",
				controller: "MatiereDetails",
				size: "md",
				resolve: {
					matiere: function () {
						return $scope.matiere;
					}
				}
			});

			modalDetails.result.then(function (matiereP) {
                if (matiereP.toDelete) {
                    $scope.remove(matiereP);
                } else {
                    matieresService.save(matiereP).then(function () {
                        updateTable();
                    });
                }
			});
		};
		
		$scope.remove = function (matiere) {
		    matieresService.remove(matiere).then(function() {
		        updateTable();
		    });
		};
        
		function updateTable() {
		    matieresService.updateList().then(function () {
		        matieresService.getList().then(function(matieres) {
		            $scope.matieres = matieres;
		            $scope.matieresView = [].concat($scope.matieres);
		        });	        
		    });
		}
	});
webApp.controller("MatiereDetails",
	function($scope, $timeout, $uibModalInstance,  matieresService, matiere){
		
	    $scope.matiere = {};
	    $scope.creation = matiere ? false : true;
        
        if(!$scope.creation){
            matieresService.getOne(matiere.id).then(function (data) {
                $scope.matiere = data;
            });
        }
        else {
            $scope.matiere = matieresService.getNew();
        }
        
		$scope.save = function () {
		    $scope.matiere.toDelete = false;
            $uibModalInstance.close($scope.matiere);
		};
        
        $scope.remove = function () {
            $scope.matiere.toDelete = true;
            $uibModalInstance.close($scope.matiere);
		};
        
		$scope.cancel = function () {
			$uibModalInstance.dismiss("Annuler");
		};        
	});
}());
//# sourceMappingURL=app.js.map