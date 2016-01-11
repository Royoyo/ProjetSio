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
    $cours_obj = Cours::with('user', 'matiere', 'classes')->select('id', 'start', 'end')->where(function($q) use($start) {
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

//Enseignants

$app->get('/plan/enseignant', $authenticateWithRole('planificateur'), function() use ($app) {
    $users = Users::whereHas('roles', function($q) {
        $q->where('role', 'enseignant');
    })->with('matieres')->get();
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
        $app->response->setBody(json_encode($e));
    }
});

//Classes

$app->get('/plan/classes', $authenticateWithRole('planificateur'), function() use ($app) {
    $classes = Classes::with('user')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classes));
});

$app->get('/plan/classes/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $classe = Classes::where('id', $id)->with('user')->select('id', 'dateDebut', 'dateFin', 'nom')->firstOrFail();
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
        $classe->id_users = $data['user']['id'];
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
        $classe->push();

         
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});
?>