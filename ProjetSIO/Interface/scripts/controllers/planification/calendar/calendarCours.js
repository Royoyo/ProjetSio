webApp.controller("CoursDetails",
	function($scope, $uibModalInstance, helper, coursService, enseignantsService, matieresService, classesService, event){

        $scope.matieres = [];
        $scope.enseignantsBase = [];
        $scope.enseignants = [];
        $scope.classes = [];
        $scope.formClasses = {};

        

        matieresService.getList().then(function (data) {
            $scope.matieres = data;
        });

	    classesService.getList().then(function (data) {
	        $scope.classes = data;
	    });	    

        $scope.creation = event.title ? false : true;
        
        if (!$scope.creation){
            coursService.getOne(event.id).then(function(cours) {
                    $scope.cours = cours;
                    $scope.cours.title = cours.matiere ? cours.matiere.nom : "";                    
                    $scope.cours.title += cours.user ? " | " + cours.user.lastName : "";
                    angular.forEach(cours.classes, function (classe) {
					   $scope.formClasses[classe.id] = true;
                    }, this);
                    enseignantsService.getList().then(function (data) {
                        rajouterDisponibilité(data);
                        $scope.enseignantsBase = [].concat(data);
                        $scope.enseignants = [].concat($scope.enseignantsBase);
                        listeners();
                    });
                    
                });
        }
        else {
            $scope.cours = coursService.getNew();
            $scope.cours.start = event.start.format();
            $scope.cours.end = event.end.format();
            enseignantsService.getList().then(function (data) {
                rajouterDisponibilité(data);
                $scope.enseignantsBase = [].concat(data);
                $scope.enseignants = [].concat($scope.enseignantsBase);
                listeners();
            });
        }
        
        
                
        function listeners(){
            $scope.$watch(function(){
                return $scope.cours.id_Matieres;
            }, function (oldValue, newValue) {
                if (oldValue !== newValue) {
                    $scope.enseignants = [];
                    angular.forEach($scope.enseignantsBase, function (enseignant) {
                        if (filtreEnseignants(enseignant))
                            $scope.enseignants.push(enseignant);
                    });
                }    
            }, true);
            
            $scope.$watch(function () {
			 return $scope.formClasses;
            }, function (value) {
                $scope.cours.classes = [];
                angular.forEach($scope.formClasses, function (v, k) {
                    v && $scope.cours.classes.push(helper.getObjectFromArray($scope.classes,"id",k));
                });
            }, true);       
        };       
        
        function filtreEnseignants(enseignant)
        {
            if (!$scope.cours.id_Matieres)
                return true;
            
            if (helper.getObjectFromArray(enseignant.matieres, "id", $scope.cours.id_Matieres)) {
                return true;
            } else {
                return false;
            }
        }
        
        function rajouterDisponibilité(enseignants) {
            angular.forEach(enseignants, function (enseignant) {
                if (enseignant.id == $scope.cours.id_Users) {
                    enseignant.indisponible = false;
                    enseignant.viewName = enseignant.fullName + " (choix actuel)";
                }
                else if (helper.getPeriodFromDateInArray(enseignant.indisponibilite, event.start)) {
                    enseignant.indisponible = true;
                    enseignant.viewName = enseignant.fullName + " (indisponible)";
                } else {
                    if (helper.getPeriodFromDateInArray(enseignant.cours, event.start)) {
                        enseignant.indisponible = true;
                        enseignant.viewName = enseignant.fullName + " (déjà assigné)";
                    } else {
                        enseignant.indisponible = false;
                        enseignant.viewName = enseignant.fullName;
                    }
                }
            });
        };

        $scope.save = function () {
            $scope.cours.toDelete = false;
            $uibModalInstance.close($scope.cours);
		};
		
        $scope.delete = function () {
            $scope.cours.toDelete = true;
            $uibModalInstance.close($scope.cours);
        };
		$scope.cancel = function(){
			$uibModalInstance.dismiss();
		};
        
        
	});