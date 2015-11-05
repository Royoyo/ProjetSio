//Dans ce fichier on va mettre en place les différents controllers qui seront liés à la view
// Il faut voir ça comme des sections de codes seulement accessibles dans la zone html où elles sont déclarées

// Un paramètre qui reviendra constamment est $scope, il faut le voir comme un "sac à variables" que l'on va
// par suite utiliser dans notre html 


//controller du modal de login
webApp.controller('loginController',
	function($scope, $state, $modalInstance, $window, Authentification ) {
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
			$modalInstance.close();
			if (user)
			$state.go(user.home);
		}, function(err) {
			//3ème paramètre fonction d'echec
			console.log("error");
			$scope.error = true;
		});
	};
	
	// Check au début si l'utilisateur a déjà une sesssion en cours (au cas d'un refresh)
	/*if ($window.sessionStorage["userData"]) {
		try {
		var user = JSON.parse($window.sessionStorage["userData"]);
		$scope.login(user);	
		} catch (error) {}		
	}*/

});
	
//Ce controller utilise le service AdminList pour récupérer une liste des utilisateurs du serveur
webApp.controller('AdminList',
	function ($scope, $filter, adminService,$modal, Restangular) {
		
		$scope.personnes = [];
		var personnes = adminService.getPersonnes();
		personnes.getList().then(function(personnes){
			Restangular.copy(personnes,$scope.personnes);
		});
		
		$scope.openDetails = function(idList) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.idList = idList;
			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"view/administration.details.html",
				controller: "AdminDetails",
				size: "md",
				resolve: {
					id: function(){
						return $scope.idList;
					}
				}
			})
		};
	});


//Ce controller utilise le service AdminList ainsi que le service pré-installé $filter ET le paramètre passé par l'URL
// pour récupérer un utilisateur en particulier
webApp.controller('AdminDetails',
	function($scope, adminService, Restangular, id, $modalInstance){
		
		//TO DO : connexion avec l'api backend par requêtes GET(pour le select) + POST(pour l'update)
		//Filtrage de la liste par l'id
		$scope.personne = {};
		adminService.getPersonne(id).then(function(personne){
			Restangular.copy(personne,$scope.personne);
		});
		
		$scope.save = function () {
			$modalInstance.close();
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss('Annuler');
		};
		
	});

	
webApp.controller('PlanController',
	function($scope,planService, Restangular){
		
		$scope.personnes = [];
		
		var personnes = planService.getPersonnes();
		personnes.getList().then(function(personnes){
			Restangular.copy(personnes,$scope.personnes);
		});
	});

webApp.controller('PlanClassesController',
	function($scope){
		//TODO :
	});
	
webApp.controller('PlanEnseignantsController',
	function($scope, planService, Restangular){
		
		$scope.personnes = [];
		
		var personnes = planService.getPersonnes();
		personnes.getList().then(function(personnes){
			Restangular.copy(personnes,$scope.personnes);
		});
	});

webApp.controller('PlanMatieresController',
	function($scope, personne, matieres, $modal){
		$scope.personne = personne;
		
		$scope.matieres = matieres;
		$scope.showAddForm = function(idList) {

			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"view/planification.enseignants.matieres.details.html",
				controller: "MatieresDetailsController",
				size: "lg",
				resolve: {
					personne : function(){
						return $scope.personne;
					},
					matieres : function(){
						return $scope.matieres;
					}
				}
			})
		};
	});

webApp.controller('MatieresDetailsController',
	function($scope,personne,matieres){
		$scope.personne = personne;
		$scope.matieres = matieres;
	});
	
webApp.controller('PlanPeriodesController',
	function($scope){
		//TODO :
	});
	
webApp.controller('InfoPlanificateurController',
	function($scope){
		//TODO :
	});
