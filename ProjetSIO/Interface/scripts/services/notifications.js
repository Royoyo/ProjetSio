webApp.factory("notifService", function (toastr) {

    function saving() {
        toastr.clear();
        toastr.info("Sauvegarde en cours...");
    };

    function saved() {
        toastr.clear();
        toastr.success("Sauvegarde terminée!");
    };

    function deleting() {
        toastr.clear();
        toastr.info("Suppression en cours...");
    };

    function deleted() {
        toastr.clear();
        toastr.success("Suppression terminée!");
    };

    function error(message) {
        toastr.clear();
        toastr.error(message,"Erreur");
    };

    return {
        saving: saving,
        saved: saved,
        deleting: deleting,
        deleted: deleted,
        error: error
    }
});