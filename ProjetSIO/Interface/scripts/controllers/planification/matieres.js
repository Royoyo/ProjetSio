webApp.controller("PlanMatieresController",
	function($scope, $uibModal, $filter, planMatieres){
        
		$scope.matieres = [];
        
		updateTable();
		
		$scope.openDetails = function (matiere) {
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

			modalDetails.result.then(function () {
				updateTable();
			});
		};
		
        $scope.delete = function (matiere) {
            matiere.remove();
            updateTable();
		};
        
		function updateTable() {
			planMatieres.getMatieres().then(function(matieres){
			$scope.matieres = [].concat(matieres);
			$scope.matieresView = [].concat($scope.matieres);
			})
		}
	});