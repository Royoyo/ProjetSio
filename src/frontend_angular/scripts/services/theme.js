webApp.factory("themes", function ($rootScope, $state, notifService, Restangular) {    
    
    $rootScope.themes = {
        "cerulean" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css",
        "cosmo" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cosmo/bootstrap.min.css",
        "cyborg" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cyborg/bootstrap.min.css",
        "darkly" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/darkly/bootstrap.min.css",
        "flatly": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/flatly/bootstrap.min.css",
        "journal": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/journal/bootstrap.min.css",
        "lumen": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css",
        "paper": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/paper/bootstrap.min.css",
        "readable": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/readable/bootstrap.min.css",
        "sandstone": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/sandstone/bootstrap.min.css",
        "simplex": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/simplex/bootstrap.min.css",
        "slate": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/slate/bootstrap.min.css",
        "spacelab": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/spacelab/bootstrap.min.css",
        "superhero": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/superhero/bootstrap.min.css",
        "united": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/united/bootstrap.min.css",
        "yeti": "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/yeti/bootstrap.min.css"
    }   
    
    function select(choice){
        notifService.saving();
        Restangular.all("theme").post({ theme: choice}).then(function(){
            notifService.saved();
            $rootScope.theme = choice;
        },function(){
            notifService.error("Votre choix n'a pas été sauvegardé");
        });
    }
    
    return {
        select:select
    };
});