webApp.controller('mainController', function($scope, $rootScope, $modal, Authentification, Session, AUTH_EVENTS, USERS_ROLES){
	// Controller de base, tous les controllers héritent de celui-ci
	///Applique la logique d'authentification

	
	$scope.modalShown = false;
    
	var showLogin = function() {
		if(!$scope.modalShown){
			$scope.modalShown = true;
			var modalInstance = $modal.open({
				templateUrl : 'modals/login.html',
				controller : "loginController",
				backdrop : 'static',
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