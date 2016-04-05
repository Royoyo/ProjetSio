webApp.controller("MatiereDetails",
	function($scope, $timeout, $uibModalInstance,  planMatieres, Restangular, matiere){
		
		$scope.matiere = {};
        
		if (matiere === -1) 
		{
			$scope.creation = true;
		}
		else
		{
			$scope.creation = false;
		}
        
        if(!$scope.creation){
            planMatieres.getMatiere(matiere.id).then(function (matiere){
				Restangular.copy(matiere,$scope.matiere);
			});
        }
        else {
            $scope.matiere = planMatieres.getNewMatiere();
        }
        
		$scope.save = function (matiere) {
            matiere.save();
            $uibModalInstance.close();
		};
        
        $scope.delete = function (matiere) {
            matiere.remove();
            $uibModalInstance.close();
		};
        
		$scope.cancel = function () {
			$uibModalInstance.dismiss("Annuler");
		};        
	});