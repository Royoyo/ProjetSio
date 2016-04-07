webApp.controller("PlanCalendar",
	function ($scope, planCalendarService) {
	    $scope.config = planCalendarService.config;
	    $scope.feed = planCalendarService.feed;
	});