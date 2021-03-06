/**
 * Social Visual Communication, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 16/03/2016
 *
 *
 * app.js - Runner script, starts the application by calling the initialise script in lib.
 *
 */
"use strict"

var constants      = require( "./lib/constants" )
constants.root_dir = __dirname
const utils        = require( "./lib/utils" )
const cls          = require( "continuation-local-storage" )
var logger         = utils.getLogger()
var log            = logger.child ( { origin: "app.startup" } )
const initialise   = require( "./lib/initialise" )


log.info ( constants.start_art )


// Create namespace - calling the initialise startup within the cls call stack
cls.createNamespace( constants.namespace )
cls.getNamespace( constants.namespace ).run ( function () {

	// Attach logger to startup sequence
	var session = cls.getNamespace( constants.namespace )
	session.set( "logger", logger )

	// Run the application startup
	initialise( function ( error ) {

		if ( error ) {

			log.fatal( { error }, "Failed to start application due to error" )
			process.exit( 1 )
		}
		else {

			log.info( constants.start_complete_art )
		}
	} )
} )