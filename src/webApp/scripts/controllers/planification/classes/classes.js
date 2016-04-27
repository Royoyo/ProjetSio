webApp.controller("PlanClassesController",
	function($scope, $uibModal, classesService){
		
		$scope.classes = [];    
        
		classesService.getList().then(function (classes) {
		    $scope.classes = classes;
		    $scope.classesView = [].concat($scope.classes);
		});
		
		$scope.openClasse = function (classe) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.classe = classe;

			var modalDetails = $uibModal.open({
				animation: true,
				templateUrl: "modals/classesDetails.html",
				controller: "ClasseDetails",
				size: "md",
				resolve: {
					classe: function () {
						return $scope.classe;
					}
				}
			});

			modalDetails.result.then(function (classeP) {
                if (classeP.toDelete) {
                    classesService.remove(classeP).then(function() {
                        updateTable();
                    });
                } else {
                    classesService.save(classeP).then(function() {
                        updateTable();
                    });
                }
			});
		};
		
        $scope.delete = function(classe) {
            classesService.remove(classe).then(function() {
                updateTable();
            });
        }

		function updateTable() {
		    classesService.updateList().then(function() {
		        classesService.getList().then(function(classes) {
		            $scope.classes = classes;
		            $scope.classesView = [].concat($scope.classes);
		        });
		    });
		}
	});