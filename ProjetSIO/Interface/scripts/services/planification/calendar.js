webApp.factory("planCalendarService",
    function(uiCalendarConfig, $uibModal, coursService, enseignantsService) {

        var eventRender = function(event, element, view) {

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

        var eventClick = function(event, jsEvent, view) {
            if (view.type === "agendaWeek" && moment(event.start).isAfter(moment().startOf("day"))) {
                //openEventDetails(event);
                var modalDetails = $uibModal.open({
                    animation: true,
                    templateUrl: "modals/coursDetails.html",
                    controller: "CoursDetails",
                    size: "md",
                    resolve: {
                        event: function() {
                            return event;
                        }
                    }
                });

                modalDetails.result.then(function (coursP) {
                    if (coursP.toDelete) {
                        coursService.remove(coursP).then(function () {
                            enseignantsService.updateList();
                            uiCalendarConfig.calendars.planCalendar.fullCalendar("removeEventSource", events);
                            uiCalendarConfig.calendars.planCalendar.fullCalendar("addEventSource", events);
                        });
                    } else {
                        coursService.save(coursP).then(function () {
                            enseignantsService.updateList();
                            uiCalendarConfig.calendars.planCalendar.fullCalendar("removeEventSource", events);
                            uiCalendarConfig.calendars.planCalendar.fullCalendar("addEventSource", events);
                        });
                    }
                    
                });
            }
        };

        var sendAssignations = function(){
            var view = uiCalendarConfig.calendars.planCalendar.fullCalendar("getView");
            coursService.sendAssignations(view.intervalStart.format(), view.intervalEnd.format());
        };

        /* Configuration du calendrier */
        var config = {
            calendar: {
                height: 540,
                editable: false,
                customButtons: {
                    sendMail: {
                        text: "Envoyer mails d'assignations",
                        click: sendAssignations
                    }
                },
                header: {
                    left: "title, sendMail",
                    center: "month,agendaWeek",
                    right: "today prev,next"
                },
                weekends: false,
                weekNumbers: true,
                eventRender: eventRender,
                eventClick: eventClick,
                minTime: "08:00:00",
                maxTime: "17:30:00",
                defaultView: "agendaWeek",
                dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
            }
        };

        //Données du calendrier

        var events = {
            url: "http://localhost/ProjetSIO/ProjetSIO/Backend/plan/cours",
            color: "green",
            className: "coursEvent",
            eventDataTransform: function(rawEventData) {
                return {
                    id: rawEventData.id,
                    title: rawEventData.user != undefined ? rawEventData.matiere.nom + " | " + rawEventData.user.lastName : rawEventData.matiere.nom,
                    start: rawEventData.start,
                    end: rawEventData.end
                };
            }
        };

        //Fond clickable pour rajouter les cours
        var backgroundEvent = [
            {
                start: "8:00",
                end: "12:15",
                dow: [1, 2, 3, 4, 5],
                className: "coursContainer",
                description: "Rajouter un cours"
            },
            {
                start: "13:15",
                end: "17:30",
                dow: [1, 2, 3, 4, 5],
                className: "coursContainer",
                description: "Rajouter un cours"
            }
        ];

        var eventsGoogle = {
            googleCalendarId: "fr.french#holiday@group.v.calendar.google.com",
            googleCalendarApiKey: "AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M",
            className: "gcal-event",
            currentTimezone: "Europe/Paris"
        };

        /* Arrays de avec données de base du calendrier (au chargement de la page) */
        var feed = [events, eventsGoogle, backgroundEvent];

        return {
            config: config,
            feed: feed
        }
    })