<?php

use Illuminate\Database\Eloquent\Model as Model;

/**
* \class        Indisponibilite model.php "Backend/model.php
* \brief        corresponding to the unusable hours in the teacher's schedule
*/
class Indisponibilite extends Model {
    public $timestamps = false;

    public function user() {
        return $this->belongsTo('Users', 'id_Users');
    }
}
