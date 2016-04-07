webApp.controller("MatiereDetails",
	function($scope, $timeout, $uibModalInstance,  matieresService, matiere){
		
	    $scope.matiere = {};
	    $scope.creation = matiere ? false : true;
        
        if(!$scope.creation){
            matieresService.getOne(matiere.id).then(function (data) {
                $scope.matiere = data;
            });
        }
        else {
            $scope.matiere = matieresService.getNew();
        }
        
		$scope.save = function () {
		    $scope.matiere.toDelete = false;
            $uibModalInstance.close($scope.matiere);
		};
        
        $scope.remove = function () {
            $scope.matiere.toDelete = true;
            $uibModalInstance.close($scope.matiere);
		};
        
		$scope.cancel = function () {
			$uibModalInstance.dismiss("Annuler");
		};        
	});