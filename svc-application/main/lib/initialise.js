/**
 * Social Visual Communication, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 *
 * initialise.js - Main script responsible for initializing and maintenance of the server
 *
 * Exports include startManager,
 *
 */
"use strict"

const constants = require( "./constants.js" )
const dataStore = require( "./dataStorage.js" )
const express   = require( "express" )
const async     = require( "async" );
const api       = require( "./api.js" )
const utils     = require( "./utils.js" )

var log = utils.logger.child( { req_id: utils.generateUUID () }, true )

function initialise( callback ) {

	log.info ( "Starting SVC server." )

	async.waterfall(
			[
				dataStore.connect,
				api.register
			],
			function ( error ) {

				if ( error ) {

					log.error( { error }, "Failed to start SVC server" )
				} else {

					log.info( "Server started without issue" )
				}

				callback( error )
			}
	);
}

module.exports = initialise