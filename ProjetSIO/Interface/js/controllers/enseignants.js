webApp.controller('EnsCoursController',
	function ($scope, ensCours, Restangular) {

		$scope.cours = [];

		updateTable();

		function updateTable() {
			ensCours.getCours().then(function (cours) {
				angular.forEach(cours, function (element) {
                    element.periode = moment(element.start).hour() == 8 ? "matin": "après-midi";
                    element.date = moment(element.start).format("DD-MM-YYYY");
				})
				Restangular.copy(cours, $scope.cours);
				$scope.coursView = [].concat($scope.cours);
			});
		}       
	});
    
webApp.controller('EnsIndisponibilitesController',
	function ($scope, ensIndisponibilite, Restangular) {
        
        $scope.indispos = [];

		updateTable();

		function updateTable() {
			ensIndisponibilite.getIndispos().then(function (indispos) {
				Restangular.copy(indispos, $scope.indispos);
				$scope.indisposView = [].concat($scope.indispos);
			});
		}   
        
	});
webApp.controller('IndisposDetails',
	function ($scope, $modalInstance, Restangular, event, ensIndisponibilite) {
        
	});
   
webApp.controller('EnsCalendarIndisponibilitesController',
	function ($scope, $compile, $modal, uiCalendarConfig, Restangular, ensIndisponibilite){ 
        
        /* Infos pour forms */
        
        /* Fonctions du calendrier */
        
		/* add custom event*/
		$scope.addEvent = function(event) {
            //TO DO un appel pour le REST
			$scope.events.push({
				title: event.title,
				start: event.start,
				end: event.end
			});
		};
		
		/* remove event */
		$scope.remove = function(index) {
			$scope.events.splice(index,1);
		};
		
		
		$scope.changeView = function(view,calendar) {
			uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
		};
        
		$scope.eventRender = function(event, element, view) {
                    
            if (view.type == "agendaWeek")
                if (event.className == "coursContainer")
                    element.find('.fc-bg').append("<div>" + event.description + "</div>"); 
                    
            if (event.source.className == "coursEvent")
                if(event.matiere != undefined)
                    event.title = event.matiere.nom;
                if(event.user != undefined)
                    event.title +=  + " | " + event.user.lastName;           
		};
        
		$scope.eventClick = function(event, jsEvent, view) {
            if(view.type=="agendaWeek"){
                $scope.event = event;
                //openEventDetails(event);
                var modalDetails = $modal.open({
                    animation: true,
                    templateUrl: "modals/indisposDetails.html",
                    controller: "IndisposDetails",
                    size: "md",
                    resolve: {
                        event: function () {
                            return $scope.event;
                        }
                    }
                });

                modalDetails.result.then(function (deleteBool) {
                    if (deleteBool){
                        $scope.$watch('uiCalendarConfig.calendars.length',function(){
                            uiCalendarConfig.calendars.indisposCalendar.fullCalendar('removeEvents', event.id);
                            uiCalendarConfig.calendars.indisposCalendar.fullCalendar('rerenderEvents');
                        });
                    }
                    else {
                        $scope.$watch('uiCalendarConfig.calendars.length',function(){
                            uiCalendarConfig.calendars.indisposCalendar.fullCalendar('updateEvent', event);
                            uiCalendarConfig.calendars.indisposCalendar.fullCalendar('rerenderEvents');
                        });
                    }
                });
            }
		};
        
        $scope.viewRender = function(view,element)
        {
            $scope.$watch('uiCalendarConfig.calendars.length',function()
            {
                if(typeof uiCalendarConfig.calendars.indisposCalendar != 'undefined'){
                    if (view.type == "agendaWeek"){
                        uiCalendarConfig.calendars.indisposCalendar.fullCalendar('addEventSource',$scope.backgroundEvent);
                        uiCalendarConfig.calendars.indisposCalendar.fullCalendar('rerenderEvents');
                    }
                }
            });
        }
        
        $scope.viewDestroy = function(view,element)
        {
            $scope.$watch('uiCalendarConfig.calendars.length',function()
            {
                if(typeof uiCalendarConfig.calendars.indisposCalendar != 'undefined'){
                    if(view.type == "agendaWeek"){
                        uiCalendarConfig.calendars.indisposCalendar.fullCalendar('removeEventSource',$scope.backgroundEvent);
                        uiCalendarConfig.calendars.indisposCalendar.fullCalendar('rerenderEvents');
                    }
                }
            });
        }
        
        /* Configuration du calendrier */
		$scope.uiConfig = {
			calendar:{
				height: 540,
				editable: false,
				header:{
					left: 'title',
					center: 'month,agendaWeek',
					right: 'today prev,next'
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
			googleCalendarId: 'fr.french#holiday@group.v.calendar.google.com',
			googleCalendarApiKey: 'AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M',
			className: 'gcal-event',
			currentTimezone: 'Europe/Paris'
		};
		
		$scope.events = {
			url: 'http://guilaumehaag.ddns.net/SIO/PPEBackend/ens/indispo',
            color: 'green',
            className: 'coursEvent'
		};	
        
        //Fond clickable pour rajouter les cours
        $scope.backgroundEvent = [
            {
                start : '8:00',
                end: '12:15',
                dow:[1,2,3,4,5],
                className: 'coursContainer',
                description: "Rajouter une indisponibilité"
            },
            {
                start : '13:15',
                end: '17:30',
                dow:[1,2,3,4,5],
                className: 'coursContainer',
                description: "Rajouter une indisponibilité"
            }
        ];
        
		/* Arrays de avec données de base du calendrier (au chargement de la page) */
		$scope.eventSources = [$scope.events,$scope.eventsGoogle];
	});
    
webApp.controller('EnsCalendarController',
	function($scope, $compile, $modal, uiCalendarConfig, Restangular, planCours){ 
        
        /* Fonctions du calendrier */
		
		
		$scope.changeView = function(view,calendar) {
			uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
		};
        
		$scope.eventRender = function(event, element, view) {
                    
            if (view.type == "agendaWeek")
                if (event.className == "coursContainer")
                    element.find('.fc-bg').append("<div>" + event.description + "</div>"); 
                    
            if (event.source.className == "coursEvent")
                if(event.matiere != undefined)
                    event.title = event.matiere.nom;
                if(event.user != undefined)
                    event.title +=  + " | " + event.user.lastName;
            
		};
        
        /* Configuration du calendrier */
		$scope.uiConfig = {
			calendar:{
				height: 540,
				editable: false,
				header:{
					left: 'title',
					center: 'month,agendaWeek',
					right: 'today prev,next'
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
			googleCalendarId: 'fr.french#holiday@group.v.calendar.google.com',
			googleCalendarApiKey: 'AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M',
			className: 'gcal-event',
			currentTimezone: 'Europe/Paris'
		};
		
		$scope.events = {
			url: 'http://guilaumehaag.ddns.net/SIO/PPEBackend/plan/cours',
            color: 'green',
            className: 'coursEvent'
		};	
        
		/* Arrays de avec données de base du calendrier (au chargement de la page) */
		$scope.eventSources = [$scope.events,$scope.eventsGoogle];
});