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

const initialise = require( "./lib/initialise.js" )

// Load runtime configuration and merge with constants
var constants              = require( "./lib/constants.js" )
const runtimeConfiguration = require( "./configuration/configuration.json" )
constants.runtime_conf     = runtimeConfiguration
constants.root_dir         = __dirname


// Printing application startup message
var startUpArt = "\n\n******************************************************************************\n\n"
	+ "    Starting Social Visual Communication application \n\n"
	+ "******************************************************************************\n"
console.log( startUpArt )


// Calling the initialise startup message
initialise( function ( error ) {

	if ( error ) {

		console.error( "\n\nFailed to start application due to error -", error )
		process.exit( 1 )
	}
	else {

		var startUpCompleteArt = "\n\n******************************************************************************\n\n"
			+ "    Application successfully started. \n\n"
			+ "******************************************************************************\n"

		console.log( startUpCompleteArt )
	}
} )