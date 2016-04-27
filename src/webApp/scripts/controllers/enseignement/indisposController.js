webApp.controller("indisposController",
	function ($scope, ensCalendarService, indispoService) {

        //Initialisation
	    $scope.isLoading = true;
	    $scope.error = "";
	    $scope.isModified = indispoService.listModified();

	    $scope.calendarConfig = ensCalendarService.calendarConfig;
	    $scope.eventSource = [];

	    update();

        //Fonctions pour boutons
	    $scope.addPeriod = function () {
	        indispoService.openPeriodeModal();
	    }

	    $scope.saveChanges = function() {
	        indispoService.updateIndispos();
	    }

	    $scope.cancelChanges = function () {
	        update();
	    }

        //fonction mettant à jour liste client avec liste serveur
        function update() {
            indispoService.getServerIndispos().then(function () {
                $scope.isLoading = false;
            }, function () {
                $scope.error = "Il y a eu une erreur avec le serveur.";
            });
        }

        //Watch sur listModified pour faire apparaitre les boutons sauvegarde/cancel
        //A Refaire avec emit/on pour limiter l'overhead
	    $scope.$watch(function () { return indispoService.listModified() },
            function (newValue, oldValue) {
	        if (newValue !== oldValue) {
	            $scope.isModified = indispoService.listModified();
	        }
	    });
	});