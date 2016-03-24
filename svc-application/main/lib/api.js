/**
 * Social Visual Communication, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 * api.js - Modules handles all API requests
 *
 * Supports:
 * [0] - GET "/" - Load index page
 * [1] - GET "/resources/:folder/:file" - Generically loads resources from main project
 */
"use strict"

const express       = require( "express" )
const cls           = require( "continuation-local-storage" )
const utils         = require( "./utils.js" )
const codes         = require( "./codes.js" )
const constants     = require( "./constants.js" )
const accountManage = require( "./account-management.js" )
const graphicManage = require( "./graphic-management.js" )

/*
 Sets up api listening
 */
function register( callback ) {

	var log = utils.getSessionLogger( __filename, register )

	log.info( "Registering middleware" )

	var app    = express()
	var router = express.Router()

	// Create base routes
	router.get( "/", routeHome )
	router.get( "/resources/:folder/:file", manageResources )

	// Add a logger instance to the request
	app.use( attachLogger )
	app.use( traceRequests )

	app.set( "views", constants.root_dir + "\\views\\base" )
	app.set( "view engine", "jade" )

	// Create additional routes
	var accountRoutes = accountManage.retrieveRoutes()
	var graphicRoutes = graphicManage.retrieveRoutes()

	// Add/Register routes
	app.use( "/api/", accountRoutes )
	app.use( "/graphic/", graphicRoutes )
	app.use( router )

	// Set app to listen on ports
	log.info(
			{
				http_port:  constants.runtime_conf.server.http_port,
				https_port: constants.runtime_conf.server.https_port
			},
			"Listening on ports" )
	app.listen( constants.runtime_conf.server.http_port )
	app.listen( constants.runtime_conf.server.https_port )

	callback()
}

// Expose the initialise function
module.exports.register = register

/*
 Adds an instance of the bunyan logger to the request to be used throughout the application
 */
function attachLogger( request, response, next ) {

	var logger = utils.getLogger()

	// Add all sub function calls to the namespace
	cls.getNamespace( constants.namespace ).run (
			function () {

				// look up the session and attach the logger
				var session = cls.getNamespace( constants.namespace )
				session.set ( "logger", logger )

				next()
			}
	)
}

/*
 Logs all incoming requests and the respons sent
 */
function traceRequests( request, response, next ) {

	var log       = utils.getSessionLogger( __filename, traceRequests )
	var startTime = new Date()


	log.info( {
		          request_body:   request.body,
		          request_params: request.params,
		          request_path:   request.path
	          }, "Request received" )

	response.on( 'close', function () {
		console.log( 'close' )
	} )

	response.on( 'end', function () {
		console.log( 'end' )
	} )

	response.on( 'header', function () {
		console.log( 'header' )
		console.log( response.statusCode )
	} )

	response.tSend = function ( status, value ) {

		log.info ( {
			           response_status:  status,
			           response_value:   value,
			           request_duration: (new Date() - startTime) / 1000
		           }, "Sending response" )

		response.send( status, value )
	}

	response.tSendFile = function ( fileName ) {

		log.info ( {
			           response_file:    fileName,
			           request_duration: (new Date() - startTime) / 1000
		           }, "Sending response" )

		response.sendFile( fileName )
	}

	next()
}

// Root -> loads index page
function routeHome( request, response ) {

	var log = utils.getSessionLogger( __filename, routeHome )

	log.debug ( "Root file requested" )

	response.render( "index", {
		email:        "",
		key:          "",
		resValDialog: ""
	} )
}

// Resources -> resolves the gives resource
function manageResources( request, response ) {

	var log    = utils.getSessionLogger( __filename, manageResources )
	var folder = request.params.folder
	var file   = request.params.file

	log.debug( { folder: folder, file: file }, "Resource requested" )

	if ( folder === "imgs" ) {
		response.setHeader( "Content-Type", "image/png" )
	} else if ( folder === "css" ) {
		response.setHeader( "Content-Type", "text/css" )
	} else if ( folder === "js" ) {
		response.setHeader( "Content-Type", "text/javascript" )
	}

	log.trace( "Sending file" )

	response.tSendFile( constants.root_dir + "/resources/" + folder + "/" + file )
}