webApp.controller("ClasseDetails",
	function($scope, $timeout, $uibModalInstance,  planClasses, Restangular, enseignants, classe){
		
		$scope.classe = {};
		$scope.pickerDateDebut = false;
		$scope.pickerDateFin = false;
        $scope.selectedEnseignant = "";
        
        $scope.enseignants = [].concat(enseignants);
        
		if (classe === -1) 
		{
			$scope.creation = true;
		}
		else
		{
			$scope.creation = false;
		}
        
        if(!$scope.creation){
            planClasses.getClasse(classe.id).then(function (classe){
				$scope.classe = classe;
				$scope.classe.annee = $scope.classe.dateDebut.substr(0,4) + "/" + $scope.classe.dateFin.substr(0,4);
                $scope.selectedEnseignant = $scope.classe.user.id;
			});
        }
        else {
            $scope.classe = planClasses.getNewClasse();
        }
		
		$scope.openDatePicker = function(i){
            $timeout(function () {
                if (i==1)
                {
                    $scope.pickerDateDebut = true;
                }
                else
                {
                    $scope.pickerDateFin = true;
                }
            });			
		}
		
		function getObjectById(objects,id) {
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].id == id) {
					return objects[i];
				}
			}
		};
		
		$scope.save = function (classe) {
            classe.user = getObjectById($scope.enseignants,$scope.selectedEnseignant);
            classe.save();
            $uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss("Annuler");
		};
	});