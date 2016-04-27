webApp.controller("EnsCalendarController",
	function ($scope, ensCalendarService) {
	    $scope.calendarConfig = ensCalendarService.calendarConfig;
	    $scope.eventSources = ensCalendarService.eventSources;
});