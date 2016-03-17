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
const utils         = require( "./utils.js" )
const codes         = require( "./codes.js" )
const constants     = require( "./constants.js" )
const accountManage = require( "./accountManagement.js" )
const graphicManage = require( "./graphicManagement.js" )

/*
 Sets up api listening
 */
function register( callback ) {

	var app    = express()
	var router = express.Router()

	// Create base routes
	router.get( "/", routeHome )
	router.get( "/resources/:folder/:file", manageResources )

	// Add a logger instance to the request
	app.use( attachLogger )

	// Create additional routes
	var accountRoutes = accountManage.retrieveRoutes()
	var graphicRoutes = graphicManage.retrieveRoutes()

	// Add/Register routes
	app.use( "/api/", accountRoutes )
	app.use( "/graphic/", graphicRoutes )
	app.use( router );

	// Set app to listen on ports
	app.listen( constants.runtime_conf.server.http_port, callback )
}

// Expose the initialise function
module.exports.register = register

/*
 Adds an instance of the bunyan logger to the request to be used throughout the application
 */
function attachLogger( request, response, next ) {

	request.log = utils.logger.child( { req_id: utils.generateUUID () }, true )

	next()
}

// Root -> loads index page
function routeHome( request, response ) {

	if ( request.session.authorized ) {

		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err || !( res.rowcount === 1 ) ) {

				response.render( "../base/index.html", {
					email:        "",
					key:          "",
					resValDialog: ""
				} );
				request.session.destroy();
			} else {

				response.sendfile( "./views/base/home.html" );
			}
		} );
	} else {

		response.render( "../base/index.html", {
			email:        "",
			key:          "",
			resValDialog: ""
		} );
	}
}

// Resources -> resolves the gives resource
function manageResources( request, response ) {

	var log = request.log;

	var folder = request.params.folder, file = request.params.file;

	log.info( { folder: folder, file: file }, "Resource requested @ '/resources/" + folder + "/" + file + "'" );

	if ( folder === "imgs" ) {
		response.setHeader( "Content-Type", "image/png" );
	} else if ( folder === "css" ) {
		response.setHeader( "Content-Type", "text/css" );
	} else if ( folder === "js" ) {
		response.setHeader( "Content-Type", "text/javascript" );
	}

	response.sendFile( constants.root_dir + "/resources/" + folder + "/" + file );
}