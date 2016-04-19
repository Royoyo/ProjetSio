webApp.factory("indispoService",
    function ($q, $uibModal, helper, Restangular, uiCalendarConfig, notifService) {

        var indispos = [];

        var listModified = false;

        function getServerIndispos() {
            return $q(function(resolve, reject) {
                Restangular.all("ens/indispo").getList().then(
                    function(data) {
                        indispos = [].concat(data.plain());
                        listModified = false;
                        //peut-être à mettre dans le service calendar (force la mise à jour de l'ui) :
                        uiCalendarConfig.calendars.indisposCalendar.fullCalendar('prev');
                        uiCalendarConfig.calendars.indisposCalendar.fullCalendar('next');
                        resolve(true);
                    }, function() {
                        reject(false);
                    });
            });
        };

        function checkDayForIndispo(date) {
            var result = 0;
            var indispo = helper.getObjectFromDateInArray(indispos, "start", date);
            if (indispo) {
                if (indispo.toDelete) {
                    result = 0;
                }
                else if (moment(indispo.start).hour() === 8 && moment(indispo.end).hour() === 17 && (moment(indispo.start).isSame(indispo.end, "day"))) {
                    result = 1;
                } else if (moment(indispo.start).hour() === 8 && moment(indispo.end).hour() === 12) {
                    result = 2;
                } else if (moment(indispo.start).hour() === 13 && moment(indispo.end).hour() === 17) {
                    result = 3;
                } else {
                    result = 4;
                }
            } else {
                if (helper.getPeriodFromDateInArray(indispos, date)) {
                    result = 4;
                }
            }

            return result;
        };

        function changeIndispoType(date) {
            var indispo = helper.getObjectFromDateInArray(indispos, "start", date);
            if (indispo) {
                indispo.isModified = true;

                //Si Disponible -> Journée
                if (indispo.toDelete) {
                    indispo.start = moment(indispo.start).hour(8).format("YYYY-MM-DD HH:mm:ss");
                    indispo.toDelete = false;
                }
                //Si Journée -> Matin
                else if (moment(indispo.start).hour() === 8 && moment(indispo.end).hour() === 17) {
                    indispo.end = moment(indispo.end).hour(12).minutes(15).format("YYYY-MM-DD HH:mm:ss");
                }
                //Si Matin -> Après-midi
                else if (moment(indispo.start).hour() === 8 && moment(indispo.end).hour() === 12) {
                    indispo.start = moment(indispo.start).hour(13).minutes(15).format("YYYY-MM-DD HH:mm:ss");
                    indispo.end = moment(indispo.end).hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss");
                }
                //Si Après-midi -> Disponible
                else if (moment(indispo.start).hour() === 13 && moment(indispo.end).hour() === 17) {
                    indispo.toDelete = true;
                    indispo.isModified = false;
                }
                //Si Disponible -> Journée
            } else {
                var newIndispo = {};
                newIndispo.start = date.hour(8).format("YYYY-MM-DD HH:mm:ss");
                newIndispo.end = date.hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss");
                newIndispo.isModified = true;
                indispos.push(newIndispo);
            }
            listModified = true;
        };

        function updateIndispos() {

            var promises = [];

            indispos.forEach(function (ind) {
                if (ind.isModified) {
                    promises.push(Restangular.all("ens/indispo").post(ind));
                }
                if (ind.toDelete) {
                    promises.push(Restangular.one("ens/indispo", ind.id).remove());
                }
            });

            notifService.saving();
            //Attendre que toutes les promesses soit remplies avant de mettre à jour l'ui!
            $q.all(promises).then(function() {
                getServerIndispos();
                listModified = false;
                notifService.saved();
                return true;
            },function() {
                getServerIndispos();
                listModified = false;
                notifService.error("Un problème avec le serveur a empeché la sauvegarde");
                return false;
            });
        };

        function openPeriodeModal(date) {
            var indispo = date ? helper.getPeriodFromDateInArray(indispos, date) : { isNew:true };
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "modals/indispos/periodeModal.html",
                controller: "periodeModal",
                size: "md",
                resolve: {
                    indispo: function () {
                        return Object.create(indispo);
                    }
                }
            });

            modalInstance.result.then(function (newIndispo) {
                if (newIndispo.toSave) {
                    Restangular.all("ens/indispo").post(newIndispo).then(function() {
                        getServerIndispos();
                    });
                } else {
                    Restangular.one("ens/indispo", newIndispo.id).remove().then(function () {
                        getServerIndispos();
                    });
                }
            }, function () {
                //Logique à mettre?
            });
        };
        return {

            getIndispos: function() {
                return indispos;
            },

            listModified: function () {
                return listModified;
            },

            getServerIndispos: getServerIndispos,

            checkDayForIndispo: checkDayForIndispo,

            changeIndispoType: changeIndispoType,

            updateIndispos: updateIndispos,

            openPeriodeModal: openPeriodeModal
        }
    })