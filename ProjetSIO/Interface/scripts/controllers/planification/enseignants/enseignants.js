webApp.controller("PlanEnseignantsController",
	function($scope, $uibModal, helper, enseignantsService){
		
		$scope.enseignants = [];
		$scope.matieres = [];
		$scope.showMatieresTable = false;

	    enseignantsService.getList().then(function(data) {
	        $scope.enseignants = data;
	        $scope.enseignantsView = [].concat($scope.enseignants);
	    });
		
		$scope.selectedEnseignant = {};
		
		$scope.select = function (enseignant) {
		    $scope.selectedEnseignant = helper.getObjectFromArray($scope.enseignants, "id", enseignant.id);
		    $scope.showMatieresTable = true;
		};
		
		$scope.removeMatiere = function(id){
			// A mettre dans une helper class?
		    $scope.selectedEnseignant.matieres = helper.deleteObjectFromArray($scope.selectedEnseignant.matieres, "id", id);
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

			modalDetails.result.then(function (enseignantP) {
			    enseignantsService.save(enseignantP).then(function() {
			        updateTable();
			    });
			});
		};
		
		function updateTable(){
		    enseignantsService.updateList().then(function () {
		        enseignantsService.getList().then(function(data) {
		            $scope.enseignants = data;
		            $scope.enseignantsView = [].concat($scope.enseignants);
		        });			
			});
		};		
	});