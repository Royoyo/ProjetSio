webApp.factory("helper", function () {
    return {

        //Permet de récupérer l'objet d'un array par son id en indiquant le nom de la propriété par laquelle
        // il faut itérer.
        getObjectFromArray: function (arr, property , id) {
            var result = arr.filter(function (o) { return o[property] === id; });
            return result ? result[0] : null;
        },

        deleteObjectFromArray: function(arr, property, id) {
            return arr.filter(function (o) { return o[property] !== id; });
        },

        getObjectFromDateInArray: function(arr, property, date) {
            var result = arr.filter(function (o) { return moment(o[property]).isSame(date,"day"); });
            return result ? result[0] : null;
        },

        getPeriodFromDateInArray: function (arr, date) {
            var resultFiltered = arr.filter(function (o) { return moment(date).isBetween(o["start"],o["end"]); });
            return resultFiltered ? resultFiltered[0] : null;
        }
    }
});