webApp.factory("ensCalendarService",
    function(uiCalendarConfig, indispoService) {

        //Partie pour calendar indispos
        var dayRender = function (date, cell) {
            if (!cell.hasClass("fc-other-month") && moment(date).isAfter(moment().startOf("day"))) {
                if (!cell.hasClass("clickable")) {
                    cell.addClass("clickable");
                }

                cell.empty();
                cell.css("position", "relative");
                
                switch (indispoService.checkDayForIndispo(date)) {
                case 1:
                    cell.append('<p class="day-text"><strong>Journée</strong></p>');
                    cell.css("background-color", "#FF4136");
                    break;
                case 2:
                    cell.append('<p class="day-text"><strong>Matin</strong></p>');
                    cell.css("background-color", "#FFDC00");
                    break;
                case 3:
                    cell.append('<p class="day-text"><strong>Après-midi</strong></p>');
                    cell.css("background-color", "#FF851B");
                    break;
                case 4:
                    cell.append('<p class="day-text"><strong>Période</strong></p>');
                    cell.css("background-color", "#AAAAAA");
                    break;
                case 0:
                    cell.append('<p class="day-text"><strong>Disponible</strong></p>');
                    cell.css("background-color", "#2ECC40");
                    break;
                }
            }
        };

        var dayClick = function (date, jsEvent, view) {
            var i = indispoService.checkDayForIndispo(date);
            if (i !== 4) {
                indispoService.changeIndispoType(date);
                dayRender(date, $(this));
                //uiCalendarConfig.calendars.indisposCalendar
            } else {
                //TO DO
                indispoService.openPeriodeModal(date);
            }
        }

        //Partie pour calendar cours

        var eventsGoogle = {
            googleCalendarId: "fr.french#holiday@group.v.calendar.google.com",
            googleCalendarApiKey: "AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M",
            className: "gcal-event",
            currentTimezone: "Europe/Paris"
        };

        var events = {
            url: "http://10.0.0.5/gpci/backend/public/cours",
            color: "green",
            className: "coursEvent",
            eventDataTransform: function (rawEventData) {
                return {
                    id: rawEventData.id,
                    title: rawEventData.matiere.nom,
                    enseignant: rawEventData.user != undefined ? rawEventData.user.firstName + " " + rawEventData.user.lastName : "",
                    classes: printClasses(rawEventData.classes),
                    start: rawEventData.start,
                    end: rawEventData.end,
                    assignationSent: rawEventData.assignationSent
                };
            }
        };

        function printClasses(classes) {
            var result = "";
            classes.forEach(function (classe) {
                result += classe.nom + " ";
            });
            return result;
        }

        var eventSources = [eventsGoogle, events];

        var eventRender = function (event, element, view) {
            if (view.type == "agendaWeek")
                if (element.hasClass("coursEvent")) {
                    element.find(".fc-content").append("<p>" + event.enseignant + "</p>");
                    element.find(".fc-content").append("<p>" + event.classes + "</p>");
                }
        };

        /* Configs : */

        var calendarConfig = {
            calendarIndispos: {
                height: 540,
                editable: false,
                header: {
                    left: "title",
                    right: "today prev,next"
                },
                weekends: false,
                weekNumbers: true,
                dayRender: dayRender,
                dayClick: dayClick,
                minTime: "08:00:00",
                maxTime: "17:30:00",
                dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
            },
            calendarCours: {
                height: 540,
                editable: false,
                header: {
                    left: "title",
                    center: "month,agendaWeek",
                    right: "today prev,next"
                },
                weekends: false,
                weekNumbers: true,
                eventRender: eventRender,
                minTime: "08:00:00",
                maxTime: "17:30:00",
                dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
            }
        };

        return {
            calendarConfig: calendarConfig,
            eventSources: eventSources
        }
    })