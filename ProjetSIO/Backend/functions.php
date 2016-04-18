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
/*$transport = Swift_SmtpTransport::newInstance('localhost', 25);

/// Create Mailer with our Transport.
$mailer = Swift_Mailer::newInstance($transport);*/

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
* \param[in] 	$role_required is a string wich is the title of the role the user must havege
* \return 		a boolean with the state \a  True or an error code 
*/
require_once 'vendor/swiftmailer/swiftmailer/lib/swift_required.php';

function generatePassword() {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $count = mb_strlen($chars);

    for ($i = 0, $result = ''; $i < 8; $i++) {
        $index = rand(0, $count - 1);
        $result .= mb_substr($chars, $index, 1);
    }

    return $result;
}

// Create Transport
$transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, 'ssl')
    ->setUsername('test.ifide@gmail.com')
    ->setPassword('operations123');

// Create Mailer with our Transport.
$mailer = Swift_Mailer::newInstance($transport);

$app->get('/test-email', function() use ($app, $mailer){

    // Here I'm fetching my email template from my template directory.

    // Setting all needed info and passing in my email template.
    $message = Swift_Message::newInstance('Wonderful Subject')
                    ->setFrom(array('test.ifide@gmail.com' => 'Me'))
                    ->setTo(array('test.ifide@gmail.com' => 'AlsoMe'))
                    ->setBody('COUCOUSAMARCHE')
                    ->setContentType("text/html");

    // Send the message
    try {
        $results = $mailer->send($message);
    }catch(Exception $e) {
        $results = $e;
    }

    // Print the results, 1 = message sent!
    print($results);

});

$authenticateWithRole = function ($role_required){ 
    return function () use ($role_required ) {
        $app = \Slim\Slim::getInstance();
        try{
            session_start();
        } catch(Exception $e) {

		}		///< We try to open the users session
        if (!isset($_SESSION['id'])) {	///< If the session ID isn't recognized, error 401 is sent
            $app->halt(401);	
        } else {						///< In this case, we check if the user id is correctly associated with his role, if not, error 401 is sent
            $id = $_SESSION['id'];
            $role = Roles::where('role', $role_required);
            $user = Users::where('id', $id)->with('roles')->firstOrFail();	///<	Matching the current role to the users id
            foreach($user->roles as $role) {
                if ($role['priority'] <=  $role->priority)
                    return True;
            }
            $app->halt(401);
        }
    };
};



function getDateList($week, $year) {
    $date = array();
    for($day=1; $day<=5; $day++)
    {
        array_push($date, date('Y-m-d', strtotime($year . "W" . $week . $day)));
    }
    return $date;
}


function getStartAndEndDate($week, $year) {
    $date = new DateTime();
    $date->setISODate($year,$week);
    $return[0] = $date->format('Y-m-d'); 
    $return[1] = $date->add(new DateInterval('P6D'))->format('Y-m-d'); 
    return $return;
}

function getStartEndByYear($current_next) {
    if ($current_next == 'current') {
        if (date('Y-m-d', strtotime("now")) >= date('Y-m-d', strtotime("first day of august"))) {
            $date['start'] = date('Y-m-d', strtotime("first day of august"));
            $date['end'] = date('Y-m-d', strtotime("last day of july next year"));
        } else {
            $date['start'] = date('Y-m-d', strtotime("first day of august last year"));
            $date['end'] = date('Y-m-d', strtotime("last day of july"));
        }
    } else {
        if (date('Y-m-d', strtotime("now")) >= date('Y-m-d', strtotime("first day of august"))) {
            $date['start'] = date('Y-m-d', strtotime("first day of august next year"));
            $date['end'] = date('Y-m-d', strtotime("last day of july +2 years"));
        } else {
            $date['start'] = date('Y-m-d', strtotime("first day of august"));
            $date['end'] = date('Y-m-d', strtotime("last day of july next year"));
        }
    }
    return $date;
}
?>