//Dans ce fichier on va mettre en place les différents controllers qui seront liés à la view
// Il faut voir ça comme des sections de codes seulement accessibles dans la zone html où elles sont déclarées

// Un paramètre qui reviendra constamment est $scope, il faut le voir comme un "sac à variables" que l'on va
// par suite utiliser dans notre html 

webApp.controller('mainController',
	function($scope){
		//Ce controller servira principalement à contrôler la navbar
		// et à garder les infos de la session en cours
	});
	
webApp.controller('loginController',
	function($scope){
		//TODO : logique d'authentification
	});
	
//Ce controller utilise le service AdminList pour récupérer une liste des utilisateurs du serveur
webApp.controller('AdminList',
	function ($scope, $filter, adminService,$modal, Restangular) {
		
		$scope.personnes = [];
		var personnes = adminService.getPersonnes();
		personnes.getList().then(function(personnes){
			Restangular.copy(personnes,$scope.personnes);
		});
		
		$scope.openDetails = function(id) {
			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"view/administration.details.html",
				controller: "AdminDetails",
				size: "md",
				resolve: {
					id:id
				}
			})
		};
		//$scope.personnes = adminList.getPersonnes();
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
		personnes.getList().then(function(personne){
			Restangular.copy(personnes,$scope.personnes);
		});
	});

webApp.controller('PlanClassesController',
	function($scope){
		//TODO :
	});
	
webApp.controller('PlanMatieresController',
	function($scope){
		//TODO :
	});
	
webApp.controller('PlanPeriodesController',
	function($scope){
		//TODO :
	});
	
webApp.controller('InfoPlanificateurController',
	function($scope){
		//TODO :
	});
