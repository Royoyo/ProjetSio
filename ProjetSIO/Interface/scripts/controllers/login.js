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