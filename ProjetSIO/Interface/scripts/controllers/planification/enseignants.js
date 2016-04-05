webApp.controller("PlanEnseignantsController",
	function($scope, planEnseignants, Restangular, $uibModal){
		
		$scope.enseignants = [];
		$scope.matieres = [];
		$scope.showMatieresTable = false;		
		
		updateTable();	
		
		$scope.selectedEnseignant = {};
		
		$scope.select = function(enseignant) {
		    planEnseignants.getEnseignant(enseignant.id).then(function(ens) {
		        Restangular.copy(enseignant, $scope.selectedEnseignant);
		        $scope.matieresView = [].concat($scope.selectedEnseignant.matieres);
		        $scope.showMatieresTable = true;
		    });
		};
		
		$scope.removeMatiere = function(id){
			// A mettre dans une helper class?
			for (var i = 0; i < $scope.selectedEnseignant.matieres.length; i++) {
				if ($scope.selectedEnseignant.matieres[i].id == id) {
					$scope.selectedEnseignant.matieres.splice(i,1);
				}
			}
			$scope.selectedEnseignant.save();
			updateTable();
		};
		
		$scope.showAddForm = function() {
			var modalDetails = $uibModal.open({
				animation : true,
				templateUrl:"modals/listeMatieres.html",
				controller: "EnseignantsMatieresController",
				size: "lg",
				windowClass: "container-fluid",
				resolve:  {
					enseignant : function(){
						return $scope.selectedEnseignant;
					}
				}		
			});
			
			modalDetails.result.then(function(){
				updateTable();
			})
		};
		
		function updateTable(){
			planEnseignants.getEnseignants().then(function(enseignants) {
			    angular.forEach(enseignants, function(element) {
			        if (element.enabled == 1) {
			            element.enabled = true;
			        } else {
			            element.enabled = false;
			        }
			        element.fullName = element.firstName + " " + element.lastName;
			    });
			Restangular.copy(enseignants,$scope.enseignants);
			$scope.enseignantsView = [].concat($scope.enseignants);
			});
		};
		
	});