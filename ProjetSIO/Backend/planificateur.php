<?php

/**
 * \file        planificateur.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.0
 * \date        12/04/2015
 * \brief       "planificateur" routes
 *
 * \details     this file contains all the routes for "planificateur" role
 */
 
 //TO DO : revoir la logique appliquée au date
 

//Cours
$app->get('/plan/cours/', $authenticateWithRole('planificateur'),  function () use ($app) {
    $start = $_GET['start'];
    $end = $_GET['end'];
    $cours_obj = Cours::with('user', 'matiere', 'classes')->where(function($q) use($start) {
        $q->where('start', '>=', $start);
    })->where(function($q) use($end) {
        $q->where('start', '<=', $end);
    })->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours_obj));
});

$app->get('/plan/cours/:id', $authenticateWithRole('planificateur'), function ($id) use ($app) {
    $cours_obj = Cours::with('user', 'matiere', 'classes')->where('id', $id)->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours_obj));
});

$app->get('/plan/cours/classe/:id', $authenticateWithRole('planificateur'), function ($id) use ($app) {
    $classe = Classes::where('id', $id)->with('cours')->get();;
    $cours = Cours::whereHas('classes', function($q) use($id) {
        $q->where('id', $id);
    })->get();;
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});


$app->post('/plan/cours/', $authenticateWithRole('enseignant'), function () use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $cours = new Cours;
        $cours->start = $data['start'];
        $cours->end = $data['end'];
        $cours->id_Matieres = $data['matiere']['id'];
        if (array_key_exists('user', $data))
            $cours->id_Users = $data['user']['id'];
        $cours->save();

        $newClasses = [];
        foreach($data['classes'] as $classe) {
            array_push($newClasses, $classe['id']);
        }
        
        $cours->classes()->sync($newClasses);
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

$app->put('/plan/cours/:id', $authenticateWithRole('planificateur'), function ($id) use ($app) {
    try {
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $cours = Cours::with('user', 'matiere', 'classes')->where('id', $id)->firstOrFail();
        $cours->start = $data['start'];
        $cours->end = $data['end'];
        $cours->id_Matieres = $data['matiere']['id'];
        if (array_key_exists('user', $data))
            $cours->id_Users = $data['user']['id'];
        $cours->save();

        $newClasses = [];
        foreach($data['classes'] as $classe) {
            array_push($newClasses, $classe['id']);
        }
        
        $cours->classes()->sync($newClasses);
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

$app->delete('/plan/cours/:id', $authenticateWithRole('planificateur'),  function ($id) use ($app) {
        $cours = Cours::with('user', 'matiere', 'classes')->where('id', $id)->firstOrFail();
        $cours->classes()->detach();
        $cours->delete();
        $app->response->setBody(true);
});

//Enseignants
$app->get('/plan/enseignant', $authenticateWithRole('planificateur'), function() use ($app) {
    $users = Users::whereHas('roles', function($q) {
        $q->where('role', 'enseignant');
    })->with('matieres', 'indisponibilite')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/plan/enseignant/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $personne = Users::where('id', $id)->where('enabled', 1)->with('matieres')->select('id', 'firstName', 'lastName')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($personne));
});

$app->put('/plan/enseignant/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $personne = Users::where('id', $id)->with('matieres')->firstOrFail();

        //sync matieres
        $newMatieres = [];
        foreach($data['matieres'] as $matiere){
            array_push($newMatieres, $matiere['id']);
        }        
        $personne->matieres()->sync($newMatieres);
        
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

//Classes

$app->get('/plan/classes', $authenticateWithRole('planificateur'), function() use ($app) {
    $classes = Classes::with('user')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classes));
});

$app->get('/plan/classes/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $classe = Classes::where('id', $id)->with('user')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classe));
});

$app->put('/plan/classes/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $classe = Classes::where('id', $id)->firstOrFail();

        $classe->nom = $data['nom'];
        $classe->dateDebut = $data['dateDebut'];
        $classe->dateFin = $data['dateFin'];
        //TO DO : enregistrer le prof principal
        $classe->id_Users = $data['user']['id'];
        $classe->save();

        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

$app->post('/plan/classes', $authenticateWithRole('planificateur'), function() use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        
        $classe = new Classes;
        $classe->nom = $data['nom'];
        $classe->dateDebut = $data['dateDebut'];
        $classe->dateFin = $data['dateFin'];
        $classe->id_Users = $data['user']['id'];
        $classe->save();

         
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

//Matières

$app->get('/plan/matieres', $authenticateWithRole('planificateur'), function() use ($app) {
    $classes = Matieres::with('user')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classes));
});

$app->get('/plan/matieres/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $classe = Matieres::where('id', $id)->with('user')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classe));
});

$app->put('/plan/matieres/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $matiere = Matieres::where('id', $id)->firstOrFail();

        $matiere->code = $data['code'];
        $matiere->nom = $data['nom'];
        $matiere->save();

        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

$app->post('/plan/matieres', $authenticateWithRole('planificateur'), function() use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        
        $matiere = new Matieres;
        
        $matiere->code = $data['code'];
        $matiere->nom = $data['nom'];
        $matiere->save();

         
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

$app->delete('/plan/matieres/:id', $authenticateWithRole('planificateur'),  function ($id) use ($app) {
    try {
        $matiere = Matieres::where('id', $id)->firstOrFail();
        $matiere->delete();

        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});
?>