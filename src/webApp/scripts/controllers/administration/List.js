//Ce controller utilise le service AdminController pour récupérer une liste des utilisateurs du serveur
webApp.controller("AdminController",
	function($scope, $uibModal, Restangular, adminService){
        
		$scope.personnes = [];

	    adminService.getList().then(function(data) {
	        $scope.personnes = data;
	        $scope.personnesView = [].concat($scope.personnes);
	    });
		
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

			modalDetails.result.then(function (personneP) {
                if (personneP.toDelete) {
                    $scope.remove(personneP);
                } else {
                    adminService.save(personneP).then(function () {
                        updateTable();
                    });
                }
			});
		};

		$scope.remove = function (personne) {
		    adminService.remove(personne).then(function() {
		        updateTable();
		    });
		};

		function updateTable() {
		    adminService.updateList().then(function () {
		        adminService.getList().then(function(personnes) {
					Restangular.copy(personnes, $scope.personnes);
					$scope.personnesView = [].concat($scope.personnes);
		        });	        
		    });
		}

		$scope.changeState = function (personne) {
		    adminService.getOne(personne.id).then(function(per) {
		        per.enabled = personne.enabled == '1' ? 0 : 1;
		        per.save();
		        updateTable();
		    });
		};
	});