<?php

use Illuminate\Database\Eloquent\Model as Model;

/**
* \class        Roles model.php "Backend/model.php
* \brief        Keeping the different roles an user can have
* \details		corresponding to the role an user has. He can be : Administrateur,Planificateur or Enseignant
*/
class Roles extends Model {
    public $timestamps = false;
    protected $casts = [
        'priority' => 'int',
    ];
    public function user() {
        return $this->belongsToMany('Users', 'users_matieres', 'id_Roles', 'id_Users');
    }
}
