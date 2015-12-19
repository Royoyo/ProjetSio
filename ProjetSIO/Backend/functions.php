<?php

/**
 * \file        function.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.0
 * \date        12/04/2015
 * \brief       functions and variables used in the backend
 *
 * \details     this file contains all the functions and some global variables for the backend
 */

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
* 				\b function
* \brief 		Get the role the user must have and save it in #$authenticateWithRole variable
* \param[in] 	$role_required is a string wich is the title of the role the user must have
* \return 		a boolean with the state \a  True or an error code 
*/
$authenticateWithRole = function ($role_required){ 
    return function () use ( $role_required ) {
        $app = \Slim\Slim::getInstance();
        try{
            session_start();
        } catch(Exception $e) {}		///< We try to open the users session
        if (!isset($_SESSION['id'])) {	///< If the session ID isn't recognized, error 401 is sent
            $app->halt(401);	
        } else {						///< In this case, we check if the user id is correctly associated with his role, if not, error 401 is sent
            $id = $_SESSION['id'];
            $user = Users::where('id', $id)->with('roles')->firstOrFail();	///<	Matching the current role to the users id
            foreach($user->roles as $role) {
                if ($role['role'] == $role_required) { ///< Testing if the role is the role the user must have
                    return True;
                }
            }
            $app->halt(401);
        }
    };
};

?>