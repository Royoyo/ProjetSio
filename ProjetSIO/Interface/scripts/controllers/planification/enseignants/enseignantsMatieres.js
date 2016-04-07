webApp.controller("EnseignantsMatieresController",
	function($scope, $uibModalInstance, helper, matieresService, enseignant){
		
		$scope.matieres = [];
        $scope.enseignant = enseignant;

	    matieresService.getList().then(function(data) {
	        $scope.matieres = data;
	        $scope.matieresView = [].concat($scope.matieres);
	    });
		
		$scope.add = function(matiere) {
			if(!helper.getObjectFromArray($scope.enseignant.matieres,"id",matiere))
			{
				$scope.enseignant.matieres.push(matiere);
			}				
		}
		
		$scope.save = function() {
		    $uibModalInstance.close($scope.enseignant);
		}
		
		$scope.cancel = function(){
			$uibModalInstance.dismiss();
		}		
	});