webApp.controller('PlanClassesController',
	function($scope, $modal, planClasses, planEnseignants, Restangular){
		
		$scope.classes = [];    
		$scope.enseignants = [];
              
        planEnseignants.getEnseignants().then(function(enseignants){
			angular.copy(enseignants,$scope.enseignants);
		})
        
		updateTable();
		
		$scope.openDetails = function (classe) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.classe = classe;

			var modalDetails = $modal.open({
				animation: true,
				templateUrl: "modals/classesDetails.html",
				controller: "ClasseDetails",
				size: "md",
				resolve: {
					classe: function () {
						return $scope.classe;
					},
                    enseignants: function () {
						return $scope.enseignants;
					}
				}
			});

			modalDetails.result.then(function () {
				updateTable();
			});
		};
		
		function updateTable() {
			planClasses.getClasses().then(function(classes){
			$scope.classes = classes;
			angular.forEach(classes,function(element){
				element.annee = element.dateDebut.substr(0,4) + "/" + element.dateFin.substr(0,4);
			})
			$scope.classesView = [].concat($scope.classes);
			})
		}
	});

webApp.controller('ClasseDetails',
	function($scope, $timeout, $modalInstance,  planClasses, Restangular, enseignants, classe){
		
		$scope.classe = {};
		$scope.pickerDateDebut = false;
		$scope.pickerDateFin = false;
        $scope.selectedEnseignant = "";
        
        $scope.enseignants = enseignants;
        
		if (classe === -1) 
		{
			$scope.creation = true;
		}
		else
		{
			$scope.creation = false;
		}
        
        if(!$scope.creation){
            planClasses.getClasse(classe.id).then(function (classe){
				Restangular.copy(classe,$scope.classe);
				$scope.classe.annee = $scope.classe.dateDebut.substr(0,4) + "/" + $scope.classe.dateFin.substr(0,4);
                $scope.selectedEnseignant = $scope.classe.user.id;
			});
        }
        else {
            $scope.classe = planClasses.getNewClasse();
        }
		
		$scope.openDatePicker = function(i){
            $timeout(function () {
                if (i==1)
                {
                    $scope.pickerDateDebut = true;
                }
                else
                {
                    $scope.pickerDateFin = true;
                }
            });			
		}
		
		function getObjectById(objects,id) {
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].id == id) {
					return objects[i];
				}
			}
		};
		
		$scope.save = function (classe) {
            classe.user = getObjectById($scope.enseignants,$scope.selectedEnseignant);
            classe.save();
            $modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('Annuler');
		};
	});

webApp.controller('PlanMatieresController',
	function($scope, $modal, $filter, planMatieres){
        
		$scope.matieres = [];
        
		updateTable();
		
		$scope.openDetails = function (matiere) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.matiere = matiere;

			var modalDetails = $modal.open({
				animation: true,
				templateUrl: "modals/matieresDetails.html",
				controller: "MatiereDetails",
				size: "md",
				resolve: {
					matiere: function () {
						return $scope.matiere;
					}
				}
			});

			modalDetails.result.then(function () {
				updateTable();
			});
		};
		
        $scope.delete = function (matiere) {
            matiere.remove();
            updateTable();
		};
        
		function updateTable() {
			planMatieres.getMatieres().then(function(matieres){
			$scope.matieres = matieres;
			$scope.matieresView = [].concat($scope.matieres);
			})
		}
	});

webApp.controller('MatiereDetails',
	function($scope, $timeout, $modalInstance,  planMatieres, Restangular, matiere){
		
		$scope.matiere = {};
        
		if (matiere === -1) 
		{
			$scope.creation = true;
		}
		else
		{
			$scope.creation = false;
		}
        
        if(!$scope.creation){
            planMatieres.getMatiere(matiere.id).then(function (matiere){
				Restangular.copy(matiere,$scope.matiere);
			});
        }
        else {
            $scope.matiere = planMatieres.getNewMatiere();
        }
        
		$scope.save = function (matiere) {
            matiere.save();
            $modalInstance.close();
		};
        
        $scope.delete = function (matiere) {
            matiere.remove();
            $modalInstance.close();
		};
        
		$scope.cancel = function () {
			$modalInstance.dismiss('Annuler');
		};        
	});
	
webApp.controller('PlanEnseignantsController',
	function($scope, planEnseignants, Restangular, $modal){
		
		$scope.enseignants = [];
		$scope.matieres = [];
		$scope.showMatieresTable = false;		
		
		updateTable();	
		
		$scope.selectedEnseignant = {};
		
		$scope.select = function(enseignant){
			planEnseignants.getEnseignant(enseignant.id).then(function(ens){
				Restangular.copy(enseignant,$scope.selectedEnseignant);
				$scope.matieresView = [].concat($scope.selectedEnseignant.matieres);
				$scope.showMatieresTable = true;
			})		
		};
		
		$scope.removeMatiere = function(id){
			// A mettre dans une helper class?
			for (var i = 0; i < $scope.selectedEnseignant.matieres.length; i++) {
				if ($scope.selectedEnseignant.matieres[i].id == id) {
					$scope.selectedEnseignant.matieres.splice(i,1);
				}
			}
			$scope.selectedEnseignant.save();
			updateTable();
		};
		
		$scope.showAddForm = function() {
			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"modals/listeMatieres.html",
				controller: "ListeMatieresController",
				size: "lg",
				windowClass: "container-fluid",
				resolve:  {
					enseignant : function(){
						return $scope.selectedEnseignant;
					}
				}		
			});
			
			modalDetails.result.then(function(matieres){
				updateTable();
			})
		};
		
		function updateTable(){
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
		};
		
	});

webApp.controller('ListeMatieresController',
	function($scope, $modalInstance, serviceMatieres, enseignant){
		
		$scope.matieres = [];
		$scope.matieresChoix = [];
		$scope.nom = enseignant.firstName + " " + enseignant.lastName;
		
		angular.copy(enseignant.matieres,$scope.matieresChoix);
		
		serviceMatieres.getMatieres().then(function(matieres){
			angular.copy(matieres,$scope.matieres);
			$scope.matieresView = [].concat($scope.matieres);
		})
		
		$scope.add = function(matiere) {
			if(!containsObject(matiere,$scope.matieresChoix))
			{
				$scope.matieresChoix.push(matiere);
			}				
		}
		
		$scope.save = function(){
			$modalInstance.close($scope.matieresChoix)
		}
		
		$scope.cancel = function(){
			$modalInstance.dismiss('Annuler');
		}
		
		//A mettre dans un service avec toutes les helpers classes
		function containsObject(obj, list){
			var bool = false;
			angular.forEach(list,function(element){
				//check sur l'id
				if (element.id == obj.id)
				{
					bool = true;
				}				
			});
			return bool;
		}
		
	});
	
webApp.controller('PlanCalendarClasses',
	function($scope, planClasses, Restangular){
		$scope.classes =  [];
		planClasses.getClasses().then(function(classes){					
            angular.forEach(classes,function(element){
				element.annee = element.dateDebut.substr(0,4) + "/" + element.dateFin.substr(0,4);
			})
            Restangular.copy(classes,$scope.classes);
		});
	});

webApp.controller('CoursDetails',
	function($scope, $modalInstance, Restangular, event, matieres, enseignants, classes, planCours){
        
        $scope.cours = {};   
            
        $scope.matieres = matieres;
        $scope.enseignants = enseignants;
        $scope.classes = classes;
        
        $scope.selectedMatiere = "";
        $scope.selectedEnseignant = "";
        $scope.formClasses = {};
        
        if(event.title == undefined) {
            $scope.creation = true;
        }
        else {
            $scope.creation = false;
        }
        
        if (!$scope.creation){
            planCours.getCoursSeul(event.id).then(
                function(cours){
                    Restangular.copy(cours,$scope.cours);
                    if(cours.matiere != undefined){
                        $scope.cours.title = cours.matiere.nom;
                        $scope.selectedMatiere = cours.matiere.id.toString(); 
                    }                       
                    if(cours.user != undefined){
                        $scope.cours.title += " | " + cours.user.lastName;
                        $scope.selectedEnseignant = cours.user.id.toString();
                    }
                    angular.forEach(cours.classes, function (classe) {
					   $scope.formClasses[classe.id] = true;
				    }, this);
                    listeners();
                },
                function(){
                    alert("Erreur lors du chargement des détails du cours sélectionné.");
                }
           );
        }
        else {
            $scope.cours = planCours.getNewCours();
            $scope.cours.start = event.start.format();
            $scope.cours.end = event.end.format();
            listeners();
        }
        
        function listeners(){
            $scope.$watch(function(){
                return $scope.selectedMatiere;
            }, function(value){
                $scope.enseignants = [];
                angular.forEach(enseignants,function(enseignant){
                    if(filtreEnseignants(enseignant))
                        $scope.enseignants.push(enseignant);
                });
            }, true);
            
            $scope.$watch(function () {
			 return $scope.formClasses;
            }, function (value) {
                $scope.cours.classes = [];
                angular.forEach($scope.formClasses, function (v, k) {
                    v && $scope.cours.classes.push(getObjectById($scope.classes,k));
                });
            }, true);
        
        };       
        
        function filtreEnseignants(enseignant)
        {
            if ($scope.selectedMatiere == "")
                return true;
            
            var match = false;
            
            angular.forEach(enseignant.matieres,function(matiere){
                if(matiere.id == $scope.selectedMatiere)
                    match = true;
            });
            
            return match;
        }
        
        
        
        function getObjectById(objects,id) {
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].id == id) {
					return objects[i];
				}
			}
		};
        
        $scope.save = function(){
            $scope.cours.user = getObjectById($scope.enseignants,$scope.selectedEnseignant);
            $scope.cours.matiere = getObjectById($scope.matieres,$scope.selectedMatiere);
            $scope.cours.save();
            angular.copy($scope.cours.matiere,event.matiere);
            angular.copy($scope.cours.user,event.user);
            angular.copy($scope.cours.classes,event.classes);
			$modalInstance.close(false);
		};
		
		$scope.cancel = function(){
			$modalInstance.dismiss('Annuler');
		};
        
        $scope.delete = function(){
            $scope.cours.remove();
			$modalInstance.close(true);
		};
	});
    	
webApp.controller('PlanCalendar',
	function($scope, $compile, $modal, uiCalendarConfig, Restangular, planCours, serviceMatieres, planEnseignants, planClasses, id){ 
        
        /* Infos pour forms */
        
        $scope.matieres = [];
        serviceMatieres.getMatieres().then(function(matieres){
			angular.copy(matieres,$scope.matieres);
		})
        
        $scope.enseignants = [];
        planEnseignants.getEnseignants().then(function(enseignants){
			angular.copy(enseignants,$scope.enseignants);
		})
        
        $scope.classes = [];
        planClasses.getClasses().then(function(classes){
            angular.forEach(classes,function(element){
				element.annee = element.dateDebut.substr(0,4) + "/" + element.dateFin.substr(0,4);
			})
			angular.copy(classes,$scope.classes);
		})
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
		
		
		$scope.renderCalender = function(calendar) {
			if(uiCalendarConfig.calendars[calendar]){
				//uiCalendarConfig.calendars[calendar].fullCalendar('render');
			}
		};
        
		$scope.eventRender = function(event, element, view) {
                    
            if (view.type == "agendaWeek")
                if (event.className == "coursContainer")
                    element.find('.fc-bg').append("<div>" + event.description + "</div>");     
		};
        
		$scope.eventClick = function(event, jsEvent, view) {
            if(view.type=="agendaWeek"){
                $scope.event = event;
                //openEventDetails(event);
                var modalDetails = $modal.open({
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

                modalDetails.result.then(function (deleteBool) {
                    if (deleteBool){
                        $scope.$watch('uiCalendarConfig.calendars.length',function(){
                            uiCalendarConfig.calendars.planCalendar.fullCalendar('removeEvents', event.id);
                            uiCalendarConfig.calendars.planCalendar.fullCalendar('rerenderEvents');
                        });
                    }
                    else {
                        $scope.$watch('uiCalendarConfig.calendars.length',function(){
                            uiCalendarConfig.calendars.planCalendar.fullCalendar('updateEvent', event);
                            uiCalendarConfig.calendars.planCalendar.fullCalendar('rerenderEvents');
                        });
                    }                           
                });
            }
		};
        
        $scope.viewRender = function(view,element)
        {
            $scope.$watch('uiCalendarConfig.calendars.length',function()
            {
                if(typeof uiCalendarConfig.calendars.planCalendar != 'undefined'){
                    if (view.type == "agendaWeek"){
                        //mettre un $watch sur uiCalendarConfig.calendars.length puis faire la ligne d'en dessous 
                        uiCalendarConfig.calendars.planCalendar.fullCalendar('addEventSource',$scope.backgroundEvent);
                        uiCalendarConfig.calendars.planCalendar.fullCalendar('rerenderEvents');
                    }
                }
            });
        }
        
        $scope.viewDestroy = function(view,element)
        {
            $scope.$watch('uiCalendarConfig.calendars.length',function()
            {
                if(typeof uiCalendarConfig.calendars.planCalendar != 'undefined'){
                    if(view.type == "agendaWeek"){
                        uiCalendarConfig.calendars.planCalendar.fullCalendar('removeEventSource',$scope.backgroundEvent);
                        uiCalendarConfig.calendars.planCalendar.fullCalendar('rerenderEvents');
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
			url: (id == -1 ? 'http://guilaumehaag.ddns.net/SIO/PPEBackend/plan/cours' : 'http://guilaumehaag.ddns.net/SIO/PPEBackend/plan/cours/classe/' + id),
            color: 'green',
            className: 'coursEvent',
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
                start : '8:00',
                end: '12:15',
                dow:[1,2,3,4,5],
                className: 'coursContainer',
                description: "Rajouter un cours"
            },
            {
                start : '13:15',
                end: '17:30',
                dow:[1,2,3,4,5],
                className: 'coursContainer',
                description: "Rajouter un cours"
            }
        ];
        
		/* Arrays de avec données de base du calendrier (au chargement de la page) */
		$scope.eventSources = [$scope.events,$scope.eventsGoogle];
});
	
webApp.controller('InfoPlanificateurController',
	function($scope){
		//TODO :
	});