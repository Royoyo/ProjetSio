webApp.factory("initializers", function(matieresService, classesService, enseignantsService) {

    function planification() {
        matieresService.updateList();
        classesService.updateList();
        enseignantsService.updateList();
    }

    return {
        planification: planification
    }
});