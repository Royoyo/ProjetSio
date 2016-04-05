webApp.controller("PlanCalendarClasses",
	function($scope, planClasses, Restangular){
		$scope.classes =  [];
		planClasses.getClasses().then(function(classes) {
		    angular.forEach(classes, function(element) {
		        element.annee = element.dateDebut.substr(0, 4) + "/" + element.dateFin.substr(0, 4);
		    });
            Restangular.copy(classes,$scope.classes);
		});
	});