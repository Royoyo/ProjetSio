/*
Les directives permettent de créer ses propres balises htmls avec des règles bien précises.
*/



/*
Les filtres permettent de créer des filtres uniques pour le plugin smarttable
*/

//Ce filtre récupère chaque instance unique d'une valeur dans un tableau
// Cela permet d'avoir un dropdown comme filtre avec tous les choix possibles selon les données du tableau ( C'est dynamique! O_O ) 
webApp.filter('unique', function() {
    return function (array, champ) {
        var o = {}, i, l = array.length, r = [];
        for(i=0; i<l;i+=1) {
            o[array[i][champ]] = array[i];
        }
        for(i in o) {
            r.push(o[i]);
        }
        return r;
    };
  })