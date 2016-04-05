webApp.controller("PlanCalendar",
	function($scope, $compile, $uibModal, uiCalendarConfig, Restangular, planCours, serviceMatieres, planEnseignants, planClasses, id){ 
        
        /* Infos pour forms */
        
        $scope.matieres = [];
	    serviceMatieres.getMatieres().then(function(matieres) {
	        angular.copy(matieres, $scope.matieres);
	    });
        
        $scope.enseignants = [];
	    planEnseignants.getEnseignants().then(function(enseignants) {
	        angular.copy(enseignants, $scope.enseignants);
	    });
        
        $scope.classes = [];
	    planClasses.getClasses().then(function(classes) {
	        angular.forEach(classes, function(element) {
	            element.annee = element.dateDebut.substr(0, 4) + "/" + element.dateFin.substr(0, 4);
	        });
	        angular.copy(classes, $scope.classes);
	    });


        /* Fonctions du calendrier */     
		$scope.eventRender = function(event, element, view) {
                    
            if (view.type === "agendaWeek") {
                if (element.hasClass("coursContainer") && moment(event.start).isAfter(moment().startOf("day"))) {
                    element.find(".fc-bg").append("<div>" + event.description + "</div>");
                    element.addClass("clickable");
                }
            } else {
                if (element.hasClass("coursContainer"))
                    element.css("display", "none");
            }
		};
        
		$scope.eventClick = function(event, jsEvent, view) {
		    if (view.type === "agendaWeek" && moment(event.start).isAfter(moment().startOf("day"))) {
                $scope.event = event;
                //openEventDetails(event);
                var modalDetails = $uibModal.open({
                    animation: true,
                    templateUrl: "modals/coursDetails.html",
                    controller: "CoursDetails",
                    size: "md",
                    resolve: {
                        event: function () {
                            return $scope.event;
                        },
                        matieres: function () {
                            return $scope.matieres;
                        },
                        enseignants: function () {
                            return $scope.enseignants;
                        },
                        classes: function () {
                            return $scope.classes;
                        }
                    }
                });

                modalDetails.result.then(function () {                         
                    uiCalendarConfig.calendars.planCalendar.fullCalendar("removeEventSource", $scope.events);
                    uiCalendarConfig.calendars.planCalendar.fullCalendar("addEventSource", $scope.events);                             
                });
            }
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
				minTime: "08:00:00",
				maxTime: "17:30:00",
                defaultView: "agendaWeek",
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
			url: "http://guilaumehaag.ddns.net/SIO/PPEBackend/plan/cours",
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
        
        //Fond clickable pour rajouter les cours
        $scope.backgroundEvent = [
            {
                start : "8:00",
                end: "12:15",
                dow:[1,2,3,4,5],
                className: "coursContainer",
                description: "Rajouter un cours"
            },
            {
                start : "13:15",
                end: "17:30",
                dow:[1,2,3,4,5],
                className: "coursContainer",
                description: "Rajouter un cours"
            }
        ];
        
		/* Arrays de avec données de base du calendrier (au chargement de la page) */
        $scope.eventSources = [$scope.events, $scope.eventsGoogle, $scope.backgroundEvent];
});