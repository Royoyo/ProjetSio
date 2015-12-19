//Ce controller utilise le service AdminList pour récupérer une liste des utilisateurs du serveur
webApp.controller('AdminList',
	function ($scope, $filter, adminPersonnes, $modal, Restangular) {

		$scope.personnes = [];

		updateTable();

		$scope.openDetails = function (personne) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.personne = personne;

			var modalDetails = $modal.open({
				animation: true,
				templateUrl: "modals/administration.details.html",
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


//Ce controller utilise le service AdminList ainsi que le service pré-installé $filter ET le paramètre passé par l'URL
// pour récupérer un utilisateur en particulier
webApp.controller('AdminDetails',
	function ($scope, adminPersonnes, Restangular, personne, $modalInstance, roles) {	
		
		//Initialisation form
		
		$scope.personne = {};
		$scope.roles = {};
		$scope.creation = false;
		$scope.formRoles = {};

		roles.getRoles().then(function (roles) {
			$scope.roles = roles;
		})

		if (personne === -1) {
			$scope.creation = true;
		}
		else {
			adminPersonnes.getPersonne(personne.id).then(function (personne) {
				Restangular.copy(personne, $scope.personne);

				angular.forEach(personne.roles, function (role) {
					$scope.formRoles[role.id] = true;
				}, this)
			});
		}
			
		// Fonctions
		
		$scope.$watch(function () {
			return $scope.formRoles;
		}, function (value) {
			$scope.personne.roles = [];
			angular.forEach($scope.formRoles, function (v, k) {
				v && $scope.personne.roles.push(getRolesById(k));
			});
		}, true);

		function getRolesById(id) {
			for (var i = 0; i < $scope.roles.length; i++) {
				if ($scope.roles[i].id == id) {
					return $scope.roles[i];
				}
			}
		};
		
		
		//Traitement différent pour la création car l'objet personne n'est pas objet Restangular dans ce cas et donc n'a pas d'implémentation de la méthode save()
		$scope.save = function (personne) {
			if ($scope.creation === true) {
				adminPersonnes.postPersonne(personne);
				$modalInstance.close();
			}
			else {
				personne.save();
				$modalInstance.close();
			}
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('Annuler');
		};

	});