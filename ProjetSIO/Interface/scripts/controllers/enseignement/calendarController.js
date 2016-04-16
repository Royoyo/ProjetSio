webApp.controller("EnsCalendarController",
	function($scope, $compile, $uibModal, uiCalendarConfig, Restangular, planCours){ 
        
        /* Fonctions du calendrier */
		
		
		$scope.changeView = function(view,calendar) {
			uiCalendarConfig.calendars[calendar].fullCalendar("changeView",view);
		};
        
		$scope.eventRender = function(event, element, view) {                    
            if (view.type == "agendaWeek")
                if (event.className == "coursContainer")
                    element.find(".fc-bg").append("<div>" + event.description + "</div>");            
		};
        
        /* Configuration du calendrier */
		$scope.uiConfig = {
			calendar:{
				height: 540,
				editable: false,
				header:{
					left: "title",
					center: "month,agendaWeek",
					right: "today prev,next"
				},
				weekends : false,
				weekNumbers : true,
				eventRender: $scope.eventRender,
                eventClick : $scope.eventClick,
                viewRender : $scope.viewRender,
                viewDestroy : $scope.viewDestroy,
				minTime: "08:00:00",
				maxTime: "17:30:00",
				//slotDuration: "04:00:00",
				dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
				dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
				monthNames: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
			}
		};
        
        /* Données du calendrier */
        
		$scope.eventsGoogle = {
			googleCalendarId: "fr.french#holiday@group.v.calendar.google.com",
			googleCalendarApiKey: "AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M",
			className: "gcal-event",
			currentTimezone: "Europe/Paris"
		};
		
		$scope.events = {
			url: "http://localhost/ProjetSIO/ProjetSIO/Backend/plan/cours",
            color: "green",
            className: "coursEvent",
            eventDataTransform: function (rawEventData) {
                        return {
                            id: rawEventData.id,
                            title: rawEventData.user != undefined ? rawEventData.matiere.nom + " | " + rawEventData.user.lastName : rawEventData.matiere.nom,
                            start: rawEventData.start,
                            end: rawEventData.end
                        };
                }
		};	
        
		/* Arrays de avec données de base du calendrier (au chargement de la page) */
		$scope.eventSources = [$scope.events,$scope.eventsGoogle];
});