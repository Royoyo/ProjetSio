webApp.controller("EnseignantsMatieresController",
	function($scope, $uibModalInstance, serviceMatieres, enseignant){
		
		$scope.matieres = [];
        $scope.enseignant = enseignant;
		$scope.nom = enseignant.firstName + " " + enseignant.lastName;
		
		serviceMatieres.getMatieres().then(function(matieres){
			angular.copy(matieres,$scope.matieres);
			$scope.matieresView = [].concat($scope.matieres);
		})
		
		$scope.add = function(matiere) {
			if(!containsObject(matiere,$scope.enseignant.matieres))
			{
				$scope.enseignant.matieres.push(matiere);
			}				
		}
		
		$scope.save = function(){
            $scope.enseignant.save().then(function(){
                $uibModalInstance.close()
            })			
		}
		
		$scope.cancel = function(){
			$uibModalInstance.dismiss("Annuler");
		}
		
		//A mettre dans un service avec toutes les helpers classes
		function containsObject(obj, list){
			var bool = false;
			angular.forEach(list,function(element){
				//check sur l'id
				if (element.id == obj.id)
				{
					bool = true;
				}				
			});
			return bool;
		}
		
	});