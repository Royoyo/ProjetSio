webApp.factory('Authentification',function($rootScope, $window, Session, AUTH_EVENTS, Restangular) {
	var authService = {};		
	
	//la fonction login
	authService.login = function(user, success, error) {
	
	Restangular.all('login').post(user)
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
		else{
			//Quand le body est vide -> erreur de login 
			// Evenement loginFailed + fonction error(3eme paramètre)
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
			error();
			}
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
	authService.logout = function(){
		Session.destroy();
		$window.sessionStorage.removeItem("userData");
		$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
	}

	return authService;
});

