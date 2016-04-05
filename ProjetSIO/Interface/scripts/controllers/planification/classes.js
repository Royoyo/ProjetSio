webApp.controller("PlanClassesController",
	function($scope, $uibModal, planClasses, planEnseignants, Restangular){
		
		$scope.classes = [];    
		$scope.enseignants = [];
              
        planEnseignants.getEnseignants().then(function(enseignants){
			$scope.enseignants = [].concat(enseignants);
		})
        
		updateTable();
		
		$scope.openDetails = function (classe) {
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
					},
                    enseignants: function () {
						return $scope.enseignants;
					}
				}
			});

			modalDetails.result.then(function () {
				updateTable();
			});
		};
		
        $scope.delete = function(classe){
            classe.remove();
            updateTable();
        }
        
		function updateTable() {
			planClasses.getClasses().then(function(classes){
			angular.forEach(classes,function(element){
				element.annee = element.dateDebut.substr(0,4) + "/" + element.dateFin.substr(0,4);
			})
            $scope.classes = [].concat(classes);
			$scope.classesView = [].concat($scope.classes);
			})
		}
	});