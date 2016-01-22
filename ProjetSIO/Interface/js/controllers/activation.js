webApp.controller('ActivationController',
	function($scope, serviceActivation, id, token) {
    
    $scope.user = {};
    $scope.user.id = id;
    $scope.activation = {};
    
    serviceActivation.Activation(id,token).then(function(bool){
        if (bool == 1)
            $scope.activation.message = "Votre compte a bien été activé";
        else
            $scope.activation.message = "Il y a eu un problème lors de l'activation";
    },function(){
        $scope.activation.message = "Il y a eu un problème lors de l'activation";
    });
    
    $scope.submit = function(user){
        serviceActivation.SetFirstPassword(user).then(function(bool){
            if (bool == 1)
                $scope.creationMdp = true;
                $scope.form.message = "Le mot de passe a été créé correctement, vous pouvez vous connectez avec le lien en haut à droite"
        })
    }
});