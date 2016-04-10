webApp.factory("themes", function ($rootScope, $state, notifService, Restangular, Session) {    
    
    $rootScope.themes = {
        "cerulean" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css",
        "cosmo" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cosmo/bootstrap.min.css",
        "cyborg" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cyborg/bootstrap.min.css",
        "darkly" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/darkly/bootstrap.min.css",
        "flatly" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/flatly/bootstrap.min.css"
    }

    
    
    function select(choice){
        notifService.saving();
        Restangular.all("theme").post({ theme: choice}).then(function(){
            notifService.saved();
            $rootScope.theme = choice;
        },function(){
            notifService.error("OH NO!");
        });
    }
    
    return {
        select:select
    };
});