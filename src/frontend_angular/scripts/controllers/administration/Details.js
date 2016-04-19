//Ce controller utilise le service AdminController ainsi que le service pré-installé $filter ET le paramètre passé par l'URL
// pour récupérer un utilisateur en particulier
webApp.controller("AdminDetails",
	function($scope, $timeout, $uibModalInstance,  adminService, personne, serviceRoles, Restangular){
		
	    $scope.personne = {};
		$scope.roles = {};
		$scope.formRoles = {};
	    $scope.creation = personne ? false : true;

	    serviceRoles.getRoles().then(function(roles) {
	        $scope.roles = roles;
	    });

		if (personne === -1) {
			$scope.creation = true;
            listeners();
		}
		else {
			adminService.getOne(personne.id).then(function (personne) {
				Restangular.copy(personne, $scope.personne);

			    angular.forEach(personne.roles, function(role) {
			        $scope.formRoles[role.id] = true;
			    }, this);
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
		// Fonctions
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

        if(!$scope.creation){
            adminService.getOne(personne.id).then(function (data) {
                $scope.personne = data;
            });
        }
        else {
            $scope.personne = adminService.getNew();
        }
        
		$scope.save = function () {
		    $scope.personne.toDelete = false;
            $uibModalInstance.close($scope.personne);
		};
        
        $scope.remove = function () {
            $scope.personne.toDelete = true;
            $uibModalInstance.close($scope.personne);
		};
        
		$scope.cancel = function () {
			$uibModalInstance.dismiss("Annuler");
		};        
	});