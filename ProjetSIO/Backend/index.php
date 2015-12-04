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
$app = new \Slim\Slim();
require_once 'model.php';
require_once 'planificateur.php';
require_once 'function.php';
require_once 'admin.php';
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$app->run();
?>