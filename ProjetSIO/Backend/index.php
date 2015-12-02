<?php

/**
 * \file        index.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.0
 * \date        11/19/2015
 * \brief       backend index
 *
 * \details     this file contains the index for the backend
 */

require 'vendor/autoload.php';
require_once 'model.php';
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
$app = new \Slim\Slim();
/// Create Transport
$transport = Swift_SmtpTransport::newInstance('localhost', 25);

/// Create Mailer with our Transport.
$mailer = Swift_Mailer::newInstance($transport);

/*
// Send email
$app->get('/send_inscription_mail/:id', function($id) use ($app, $mailer){
    // Get user & mail
    $user = Users::where('id', $id)->with('roles')->firstOrFail();
    // Here I'm fetching my email template from my template directory.
    $welcomeEmail = "SAMARCHE";
    // Setting all needed info and passing in my email template.
    $message = Swift_Message::newInstance('Votre compte a été créer')
                    ->setFrom(array('spielmann.romain@orange.fr' => 'Ifide SupFormation'))
                    ->setTo(array($user->email => $user->lastName . ' ' . $user->firstName))
                    ->setBody($welcomeEmail)
                    ->setContentType("text/html");

    // Send the message
    $results = $mailer->send($message);

    // Print the results, 1 = message sent!
    print($message);
});  
*/

/**
* Authentication
*/
$authenticateWithRole = function ($role_required){
    return function () use ( $role_required ) {
        $app = \Slim\Slim::getInstance();
        try{
            session_start();
        } catch(Exception $e) {}		/// We are trying to open the users session
        if (!isset($_SESSION['id'])) {	/// If the session ID isn't recognized, error 401 is sent
            $app->halt(401);	
        } else {						/// In this case, we check if the user id is correctly associated with his role, if not, error 401 is sent
            $id = $_SESSION['id'];
            $user = Users::where('id', $id)->with('roles')->firstOrFail();	///	Matching the current role to the users id
            foreach($user->roles as $role) {
                if ($role['role'] == $role_required) { /// Testing if the role is the role the user must have
                    return True;
                }
            }
            $app->halt(401);
        }
    };
};

/**
* Login
*/
$app->post('/login', function () use ($app) {
    try {
        try{	/// If the session is already on, then session_start will return an error signal
            session_start();
        } catch(Exception $e) {

        }
        $json = $app->request->getBody(); /// getBody get the request sent by the log in form
        $data = json_decode($json, true);
        $token = uniqid(rand(), true);
        if (isset($data)) {
            if (!isset($_SESSION['id'])) { /// if the user isn't logged in, this test will match the user's data corresponding to the user's id 
                $username = $data['name'];
                $password = $data['password'];
                $user_obj = Users::whereRaw('login = ? and password = ?', [$username, $password])->with('roles')->firstOrFail();
                $_SESSION['id'] = $user_obj->id;
                $_SESSION['token'] = $token;
            } else {	/// if the user is already logged in, the previous assignement is already done, we can skip it
                $id = $_SESSION['id'];
                $user_obj = Users::where('id', $id)->with('roles')->firstOrFail();
            } 
            if (isset($user_obj)){			/* à tester sans le if */
                $user_obj->connected = true;
                $user_obj->save();	/// to keep the online status in the database
                $temp_home = array();
                $role_array = array();
                foreach($user_obj->roles as $role) {
                    array_push($temp_home, $role['home']);
                    array_push($role_array, $role['role']);
                }
				/// The 7 next line match the user with their roles to their role homepage
                if(in_array('administration', $temp_home)) {
                    $user_home = 'administration';
                } else if(in_array('planification', $temp_home)) {
                    $user_home = 'planification';
                } else if(in_array('enseignement', $temp_home)) {
                    $user_home = 'enseignement';
                }
    
                $user_json = array(	/// stock all the user's information's in the user_json variable
                    "name"=>$user_obj->login,
                    "firstName"=>$user_obj->firstName,
                    "lastName"=>$user_obj->lastName,
                    "roles"=>$role_array,
                    "token"=>$token,
                    "home"=>$user_home,
                    "id"=>$user_obj->id,
                    );
                $app->response->headers->set('Content-Type', 'application/json');
                $app->response->setBody(json_encode($user_json));
				/// The last lines are the errors cases
            } else {
                $app->response->headers->set('Content-Type', 'text/html');
                $app->response->setBody(false);
            }
        } else {
            $app->response->headers->set('Content-Type', 'text/html');
            $app->response->setBody(false);
        }
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'text/html');
        $app->response->setBody($e);
    }
});

/** 
* Administrateur
*/

$app->get('/admin/personnes', $authenticateWithRole('administrateur'), function () use ($app) {
    $users = Users::with('roles')->select('id', 'login', 'firstName', 'lastName', 'email', 'enabled', 'connected')->get();
    /// Sending them as JSON then it is readable by AngularJS
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/admin/personnes/:id', $authenticateWithRole('administrateur'), function($id) use ($app) {
    $personne = Users::where('id', $id)->with('roles')->select('id', 'login', 'firstName', 'lastName', 'email', 'enabled')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($personne));
});

$app->post('/admin/personnes', $authenticateWithRole('administrateur'), function() use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $user = new Users(array(
                'login' => $data['login'],
                'password' => '',
                'firstName' => $data['firstName'],
                'lastName' => $data['lastName'],
                'email' => $data['email'],
        ));
        $user->enabled = 1;
        $user->connected = 0;
        $user->save();
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

$app->put('/admin/personnes/:id', $authenticateWithRole('administrateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $personne = Users::where('id', $id)->with('roles')->firstOrFail();
        $personne->firstName = $data['firstName'];
        $personne->lastName = $data['lastName'];
        $personne->email = $data['email'];
        $personne->save();
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

$app->delete('/admin/personnes/:id', $authenticateWithRole('administrateur'), function($id) use ($app) {
    try{
        $personne = Users::where('id', $id)->with('roles')->firstOrFail();
        $personne->enabled = false;
        $personne->save();
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

/** 
* Planificateur
*/
$app->get('/plan/cours/',  function () use ($app) {
    $start = $_GET['start'];
    $end = $_GET['end'];
    $cours_obj = Cours::with('user', 'matiere', 'classes')->where('dateDebut', '<=', $start)->orWhere('dateFin', '>=', $end)->get();
    $title = '';
    $cours = array();
    foreach($cours_obj as $cour) {
        $title .= $cour->matiere['nom'];
        $title .= '<br>';
        $title .= $cour->user['lastName'];
        $title .= ' ';
        $title .= $cour->user['firstName'];
        $title .= '<br>';
        foreach($cour->classes as $classe) {
            $title .= $classe['nom'];
            $title .= '/';
        }
        array_push($cours, 
            "user", $cour->user,
            "matiere", $cour->matiere,
            "classes", $cour->classes,
            "title", $title
        );
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});

$app->get('/plan/cours/:id', $authenticateWithRole('planificateur'), function ($id) use ($app) {
    $cours = Cours::where('id', $id)->with('user', 'matiere', 'classes')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});

$app->get('/plan/enseignant', $authenticateWithRole('planificateur'), function() use ($app) {
    $users = Users::whereHas('roles', function($q) {
        $q->where('role', 'enseignant');
    })->with('matieres')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/plan/classes/', $authenticateWithRole('planificateur'), function() use ($app) {
    $classes = Classes::all();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classes));
});

$app->run();
?>