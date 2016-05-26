<?php

use Illuminate\Database\Eloquent\Model as Model;

/**
* \class        Matieres model.php "Backend/model.php
* \brief        corresponding to the lesson's subject f.e. : mathematics, english
*/
class Matieres extends Model {
    public $timestamps = false;

    public function user() {
        return $this->belongsToMany('Users', 'users_matieres', 'id_Matieres', 'id_Users');
    }
    public function cours() {
        return $this->hasMany('Cours', 'id_Matieres');
    }
}
