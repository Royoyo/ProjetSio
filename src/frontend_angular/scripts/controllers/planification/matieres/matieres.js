webApp.controller("PlanMatieresController",
	function($scope, $uibModal, matieresService){
        
		$scope.matieres = [];

	    matieresService.getList().then(function(data) {
	        $scope.matieres = data;
	        $scope.matieresView = [].concat($scope.matieres);
	    });
		
		$scope.open = function (matiere) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.matiere = matiere;

			var modalDetails = $uibModal.open({
				animation: true,
				templateUrl: "modals/matieresDetails.html",
				controller: "MatiereDetails",
				size: "md",
				resolve: {
					matiere: function () {
						return $scope.matiere;
					}
				}
			});

			modalDetails.result.then(function (matiereP) {
                if (matiereP.toDelete) {
                    $scope.remove(matiereP);
                } else {
                    matieresService.save(matiereP).then(function () {
                        updateTable();
                    });
                }
			});
		};
		
		$scope.remove = function (matiere) {
		    matieresService.remove(matiere).then(function() {
		        updateTable();
		    });
		};
        
		function updateTable() {
		    matieresService.updateList().then(function () {
		        matieresService.getList().then(function(matieres) {
		            $scope.matieres = matieres;
		            $scope.matieresView = [].concat($scope.matieres);
		        });	        
		    });
		}
	});