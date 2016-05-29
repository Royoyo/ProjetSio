webApp.controller("EnsCoursController",
	function ($scope, $window, Session, ensCours, Restangular, BACKEND_URL) {

	    $scope.id = Session.id;
		$scope.host = $window.location.hostname;
		$scope.BACKEND_URL = BACKEND_URL;
		$scope.cours = [];

		updateTable();

		function updateTable() {
			ensCours.getCours().then(function (cours) {
			    angular.forEach(cours, function(element) {
			        element.periode = moment(element.start).hour() == 8 ? "matin" : "après-midi";
			        element.date = moment(element.start).format("DD-MM-YYYY");
			    });
				Restangular.copy(cours, $scope.cours);
				$scope.coursView = [].concat($scope.cours);
			});
		}       
	});