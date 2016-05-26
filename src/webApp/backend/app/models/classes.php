<?php

use Illuminate\Database\Eloquent\Model as Model;

/**
* \class        Classes model.php "Backend/model.php
* \brief        corresponding to the classes
* \details		corresponding to the "classes". A "classe" is composed by many students
*/
class Classes extends Model {
    public $timestamps = false;

    public function user() {
        return $this->belongsTo('Users', 'id_Users')->select("firstName", "lastName", "id");
    }
    
    public function cours() {
        return $this->belongsToMany('Cours', 'cours_classes', 'id_Classes', 'id_Cours');
    }
}
