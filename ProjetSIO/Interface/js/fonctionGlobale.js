// test : function checkant le statut de la session à chaque changement de state
webApp.run(function($rootScope, $state, Authentification, AUTH_EVENTS) {

	$rootScope.$on('$stateChangeStart', function (event, next) {
        if(next.name != "activation"){
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