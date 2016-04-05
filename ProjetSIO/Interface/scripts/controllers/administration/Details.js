//Ce controller utilise le service AdminList ainsi que le service pré-installé $filter ET le paramètre passé par l'URL
// pour récupérer un utilisateur en particulier
webApp.controller("AdminDetails",
	function ($scope, adminPersonnes, Restangular, personne, $uibModalInstance, serviceRoles) {	
		
		//Initialisation form
		
		$scope.personne = {};
		$scope.roles = {};
		$scope.creation = false;
		$scope.formRoles = {};

		serviceRoles.getRoles().then(function (roles) {
			$scope.roles = roles;
		})

		if (personne === -1) {
			$scope.creation = true;
            listeners();
		}
		else {
			adminPersonnes.getPersonne(personne.id).then(function (personne) {
				Restangular.copy(personne, $scope.personne);

				angular.forEach(personne.roles, function (role) {
					$scope.formRoles[role.id] = true;
				}, this)
			});
            listeners();
		}
			
		// Fonctions
        
        function listeners() {
            $scope.$watch(function () {
                return $scope.personne.firstName;   
            },function(){
                if ($scope.personne.firstName != undefined && $scope.personne.lastName != undefined)
                    changeLogin();
            }, true);
            
            $scope.$watch(function () {
                return $scope.personne.lastName;   
            },function(){
                if ($scope.personne.firstName != undefined && $scope.personne.lastName != undefined)
                    changeLogin();
            }, true);
            
            $scope.$watch(function () {
                return $scope.formRoles;
            }, function (value) {
                $scope.personne.roles = [];
                angular.forEach($scope.formRoles, function (v, k) {
                    v && $scope.personne.roles.push(getRolesById(k));
                });
            }, true);
        }
		function getRolesById(id) {
			for (var i = 0; i < $scope.roles.length; i++) {
				if ($scope.roles[i].id == id) {
					return $scope.roles[i];
				}
			}
		};
		
        function changeLogin(){
            $scope.personne.login = $scope.personne.firstName.substring(0,1).toLowerCase() + $scope.personne.lastName.toLowerCase();
        }
		
		//Traitement différent pour la création car l'objet personne n'est pas objet Restangular dans ce cas et donc n'a pas d'implémentation de la méthode save()
		$scope.save = function (personne) {
			if ($scope.creation === true) {
				adminPersonnes.postPersonne(personne);
				$uibModalInstance.close();
			}
			else {
				personne.save();
				$uibModalInstance.close();
			}
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss("Annuler");
		};

	});