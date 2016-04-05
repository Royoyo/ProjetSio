var webApp = angular.module("webApp", ["ui.router","ui.bootstrap","smart-table","ngAnimate","restangular","ui.calendar"]);

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
        if(next.name !== "activation"){
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
		if ($state.current.name === path) {
			return "actif";
		} else {
			return "";
		}
	}
	
	$rootScope.logout = function(){
		Authentification.logout();
	};

});