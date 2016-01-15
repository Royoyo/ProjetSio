<?php

/**
 * \file        enseignant.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.0
 * \date        12/04/2015
 * \brief       "enseignant" routes
 *
 * \details     this file contains all the routes for "enseignant" role
 */
 
 
//Cours
$app->get('/ens/cours', $authenticateWithRole('enseignant'),  function () use ($app) {
    $cours_obj = Cours::with('user', 'matiere', 'classes')->where('id_Users', $_SESSION['id'])->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours_obj));
});

$app->get('/ens/cours/:id', $authenticateWithRole('enseignant'),  function ($id) use ($app) {
    $cours_obj = Cours::with('matiere', 'classes')->select('id', 'start', 'end')->where('id', $id)->get();
    $cours = array();
    foreach($cours_obj as $cour) {
        array_push($cours,
            "cours", $cour,
            "matiere", $cour->matiere,
            "classes", $cour->classes
        );
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});

//Indisponibilités
$app->get('/ens/indispo', $authenticateWithRole('enseignant'),  function () use ($app) {
    $indispo = Indisponibilite::where('id_Users', $_SESSION['id'])->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($indispo));
});

$app->post('/ens/indispo/', $authenticateWithRole('enseignant'),  function () use ($app) {
    $json = $app->request->getBody();
    $data = json_decode($json, true);
    
    $indispo = new Indisponibilite;
    $indispo->dateDebut = $data['dateDebut'];
    $indispo->dateFin = $data['dateFin'];
    $indispo->id_Users = $_SESSION['id'];
    $indispo->save();
          
    $app->response->setBody(true);
});

$app->delete('/ens/indispo/:id', $authenticateWithRole('enseignant'),  function ($id) use ($app) {
    try {
        $indispo = Indisponibilite::where('id_Users', $_SESSION['id'])->where('id', $id)->firstOrFail();
        $indispo->delete();

        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

?>