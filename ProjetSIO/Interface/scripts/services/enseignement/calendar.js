webApp.factory("indispoCalendarService",
    function(uiCalendarConfig, indispoService) {

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

        var eventsGoogle = {
            googleCalendarId: "fr.french#holiday@group.v.calendar.google.com",
            googleCalendarApiKey: "AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M",
            className: "gcal-event",
            currentTimezone: "Europe/Paris"
        };

        var eventSources = [eventsGoogle];

        /* Configs : */

        var calendarConfig = {
            calendar: {
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
            }
        };

        return {
            calendarConfig: calendarConfig
        }
    })