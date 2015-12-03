webApp.controller('PlanClassesController',
	function($scope){
		//TODO :
	});
	
webApp.controller('PlanEnseignantsController',
	function($scope, planEnseignants, Restangular){
		
		$scope.enseignants = [];
		
		planEnseignants.getEnseignants().then(function(enseignants){		
			angular.forEach(enseignants,function(element){
				if (element.enabled == 1){
					element.enabled = true;
				}
				else{
					element.enabled = false;
				}
			})
			Restangular.copy(enseignants,$scope.enseignants);
			$scope.enseignantsView = [].concat($scope.enseignants);
		});
	});

webApp.controller('PlanMatieresController',
	function($scope, personne, matieres, $modal){
		$scope.personne = personne;
		
		$scope.matieres = matieres;
		$scope.showAddForm = function(idList) {

			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"view/planification.enseignants.matieres.details.html",
				controller: "MatieresDetailsController",
				size: "lg",
				resolve: {
					personne : function(){
						return $scope.personne;
					},
					matieres : function(){
						return $scope.matieres;
					}
				}
			})
		};
	});

webApp.controller('MatieresDetailsController',
	function($scope,personne,matieres){
		$scope.personne = personne;
		$scope.matieres = matieres;
	});
	
webApp.controller('PlanCalendarClasses',
	function($scope, planClasses, Restangular){
		$scope.classes =  [];
		planClasses.getClasses().then(function(classes){		
			Restangular.copy(classes,$scope.classes);
		});
	});
	
webApp.controller('PlanCalendar',
	function($scope,$compile,uiCalendarConfig, Restangular, planCours, id){

		// calendrier google pour les jours fériés
		$scope.eventsGoogle = {
			googleCalendarId: 'fr.french#holiday@group.v.calendar.google.com',
			googleCalendarApiKey: 'AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M',
			className: 'gcal-event',
			currentTimezone: 'Europe/Paris'
		};
		
		// évènements pris de la BDD
		$scope.events = {
			url: (id == -1 ?'http://guilaumehaag.ddns.net/SIO/PPEBackend/plan/cours' : 'http://guilaumehaag.ddns.net/SIO/PPEBackend/plan/cours/' + id)
		};
		
		$scope.contraintes = [
		{
			title: "Pause déjeuner",
			start: '12:15:00',
			end: '13:15:00',
			color: 'gray',
			rendering: 'background',
			dow: [1,2,3,4,5]
		}];
		
		/* add custom event*/
		$scope.addEvent = function() {
			$scope.events.push({
				title: 'Open Sesame',
				start: new Date(y, m, 28),
				end: new Date(y, m, 29),
				className: ['openSesame']
			});
		};
		
		/* remove event */
		$scope.remove = function(index) {
			$scope.events.splice(index,1);
		};
		
		/* Change View */
		$scope.changeView = function(view,calendar) {
			uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
		};
		
		/* Change View */
		$scope.renderCalender = function(calendar) {
			if(uiCalendarConfig.calendars[calendar]){
				uiCalendarConfig.calendars[calendar].fullCalendar('render');
			}
		};
		
		/* Render Tooltip */
		$scope.eventRender = function( event, element, view ) { 
			element.attr({'tooltip': event.title,
						'tooltip-append-to-body': true});
			if (event.title === "Programmation")
				element.find('.fc-title').append("<br/>Michel Diemer<br/>SIO2"); 
			$compile(element)($scope);
		};
		
		/* config object */
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
				minTime: "08:00:00",
				maxTime: "17:30:00",
				//slotDuration: "04:00:00",
				dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
				dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
				monthNames: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
			}
		};

		/* event sources array*/
		$scope.eventSources = [$scope.events,$scope.eventsGoogle,$scope.contraintes];
});
	
webApp.controller('InfoPlanificateurController',
	function($scope){
		//TODO :
	});