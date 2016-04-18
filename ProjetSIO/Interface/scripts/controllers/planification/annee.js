webApp.controller("PlanAnneeController",
	function($scope, $uibModal, $http, classesService, weekService){
		$scope.current_classes = [];
		$scope.next_classes = [];
		classesService.getCurrentNextList('current').then(function (classes) {
			$scope.current_classes = classes;
			$scope.classesView = [].concat($scope.current_classes);
		});

		classesService.getCurrentNextList('next').then(function (classes) {
			$scope.next_classes = classes;
			$scope.next_classesView = [].concat($scope.next_classes);
		});

		$scope.year = "";
		$scope.nextyear = "";
		$scope.week = [];
		weekService.getList('current').then(function (week) {
			$scope.week = week;
			$scope.weekView = [].concat($scope.week);
		})

		$scope.nextweek = [];
		weekService.getList('next').then(function (week) {
			$scope.nextweek = week;
			$scope.nextweekView = [].concat($scope.nextweek);
		})

		$http({
		  method: 'GET',
		  url: 'http://localhost/ProjetSIO/ProjetSIO/Backend/plan/years/current'
		}).then(function successCallback(response) {
			$scope.year = response.data.year;
		  }, function errorCallback(response) {
  		});
		$http({
		  method: 'GET',
		  url: 'http://localhost/ProjetSIO/ProjetSIO/Backend/plan/years/next'
		}).then(function successCallback(response) {
			$scope.nextyear = response.data.year;
		  }, function errorCallback(response) {

  		});
	});