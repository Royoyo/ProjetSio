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
    $cours_obj = Cours::with('user', 'matiere', 'classes')->whereRaw('DATE(start) >= CURDATE() and id_Users = ? and assignationSent = 1',[$_SESSION['id']])->get();
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
	//Suppression des indispos dans le passé à chaque requete ( à gérer autrement plus tard)
	Indisponibilite::whereRaw('DATE(end) < CURDATE() and id_Users = ?',[$_SESSION['id']])->delete();

    $indispos = Indisponibilite::where('id_Users', $_SESSION['id'])->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($indispos));
});

$app->post('/ens/indispo', $authenticateWithRole('enseignant'),  function () use ($app) {
    $json = $app->request->getBody();
    $data = json_decode($json, true);   
    $indispo = new Indisponibilite;
    $indispo->start = new DateTime($data['start']);
    $indispo->end = new DateTime($data['end']);
    $indispo->id_Users = $_SESSION['id'];

	$duration = date_diff($indispo['start'],$indispo['end'],true);

	//Si indispo d'une journée -> suppression de l'indispo précédente
	if($duration->d < 2){
		 Indisponibilite::whereRaw('DATE(start) = DATE(?) and id_Users = ?', [$data['start'], $_SESSION['id']])->delete();
		 //$oldIndispo = Indisponibilite::where([
		 //                                       ['id_Users',$data['user']['id']],
		 //                                       ['DATE(start)',$data['start']->format('Y-m-d')]])->firstOrFail();
   
	//Si indispo de plus d'une journée -> période
	} else {
		//TO DO : Rajouter cas collision entre deux périodes
		Indisponibilite::whereRaw('DATE(start) BETWEEN DATE(?) and DATE(?) and id_Users = ?', [$data['start'],$data['end'], $_SESSION['id']])->delete();
	}

    $indispo->save();

    $app->response->setBody(true);
});

$app->delete('/ens/indispo/:id', $authenticateWithRole('enseignant'),  function ($id) use ($app) {
    try {
        $indispo = Indisponibilite::where('id_Users', $_SESSION['id'])->where('id', $id)->delete();

        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

//Lien Ical public pour les applications calendriers des professeurs
$app->get('/ical/:id',  function ($id) use ($app) {
	try {
		$cours = Cours::with('user', 'matiere', 'classes')->whereRaw('DATE(start) >= CURDATE() and id_Users = ? and assignationSent = 1',[$id])->get();
		$events = [];

		$i = 0;
		foreach($cours as $cour){
			//Pansement pour problème timezone
			$start = new dateTime($cour->start);
			$start->sub(new DateInterval('PT02H'));
			$end = new dateTime($cour->end);
			$end->sub(new DateInterval('PT02H'));
			$eventParams = array(
				'start' => $start,
				'end' => $end,
				'summary' => "Cours de " . $cour->matiere->nom . " à Ifide Supformation.");
			$events[$i] = new CalendarEvent($eventParams);
			$i++;
		}

		$calParams= array(
			'events' => $events
			);

		$calendar = new Calendar($calParams);
		$app->response->headers->set('Content-Type', 'text/calendar');
		$calendar->generateDownload();

	} catch(Exception $e) {
		$app->response->setStatus(400);
		$app->response->setBody($e);
	}
});

?>