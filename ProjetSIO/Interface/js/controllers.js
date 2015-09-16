//Dans ce fichier on va mettre en place les différents controllers qui seront liés à la view
// Il faut voir ça comme des sections de codes seulement accessibles dans la zone html où elles sont déclarées

// Un paramètre qui reviendra constamment est $scope, il faut le voir comme un "sac à variables" que l'on va
// par suite utiliser dans notre html 

webApp.controller('mainController',
	function($scope){
		//Ce controller servira principalement à contrôler la navbar
	});
	
//Ce controller utilise le service AdminList pour récupérer une liste des utilisateurs du serveur
webApp.controller('AdminList',
	function ($scope, $filter, adminList) {
		$scope.personnes = adminList.getPersonnes();

		angular.forEach($scope.personnes, function (personne) {
			var rolesString = "";
			rolesString += personne.Roles.admin ? "A " : "";
			rolesString += personne.Roles.planificateur ? "P " : "";
			rolesString += personne.Roles.enseignant ? "E" : "";
			personne.rolesString = rolesString;
			
			personne.statusString = personne.Statut ? "Actif" : "Inactif"; 
		}, $scope.personnes);
	});


//Ce controller utilise le service AdminList ainsi que le service pré-installé $filter ET le paramètre passé par l'URL
// pour récupérer un utilisateur en particulier
webApp.controller('AdminDetails',
	function($scope,$stateParams, adminList, $filter, $state){
		
		//TO DO : connexion avec l'api backend par requêtes GET(pour le select) + POST(pour l'update)
		//Filtrage de la liste par l'id
		$scope.personne = adminList.getPersonne($stateParams.id);
	});
	
webApp.controller('loginController',
	function($scope){
		//TODO : logique d'authentification
	});