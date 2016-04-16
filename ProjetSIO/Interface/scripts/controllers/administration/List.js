//Ce controller utilise le service AdminList pour récupérer une liste des utilisateurs du serveur
webApp.controller("AdminList",
	function ($scope, $filter, adminPersonnes, $uibModal, Restangular) {

		$scope.personnes = [];

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

			modalDetails.result.then(function () {
				updateTable();
			});
		};

		function updateTable() {
			adminPersonnes.getPersonnes().then(function (personnes) {
				angular.forEach(personnes, function (element) {
					if (element.enabled == 1) {
						element.enabled = true;
					}
					else {
						element.enabled = false;
					}
				})
				Restangular.copy(personnes, $scope.personnes);
				$scope.personnesView = [].concat($scope.personnes);
			});
		}

		$scope.changeState = function (personne) {

			adminPersonnes.getPersonne(personne.id).then(function (per) {
				per.enabled = personne.enabled ? "false" : "true";
				per.save();
				updateTable();
			})			
			// lignes qui suivent à garder au chaud
			//personne.remove().then(function(){
			//var index = $scope.personnes.indexOf(personne);
			//if (index > -1)
			//  $scope.personnes.splice(index, 1);				
			//})
		}
	});