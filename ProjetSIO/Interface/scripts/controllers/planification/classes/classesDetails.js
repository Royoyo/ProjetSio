webApp.controller("ClasseDetails",
	function($scope, $timeout, $uibModalInstance, classesService, enseignantsService, classe){

	    enseignantsService.getList().then(function(data) {
	        $scope.enseignants = data;
	    });

		$scope.pickerDateDebut = {
		    opened: false
		}
		$scope.pickerDateFin = {
		    opened: false
		}

		$scope.openPickerDebut = function () {
		    $scope.pickerDateDebut.opened = true;
		};
		$scope.openPickerFin = function () {
		    $scope.pickerDateFin.opened = true;
		};
        
		$scope.creation = classe ? false : true;

        if(!$scope.creation){
            classesService.getOne(classe.id).then(function (data){
                $scope.classe = data;
			});
        }
        else {
            $scope.classe = classesService.getNew();
        }   
		
        $scope.save = function () {
            $scope.classe.toDelete = false;
            $uibModalInstance.close($scope.classe);
		};

        $scope.remove = function () {
            $scope.classe.toDelete = true;
            $uibModalInstance.close($scope.classe);
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		};
	});