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

const dataStore      = require( "./dataStorage.js" )
const cleanTempUsers = require( "./maintenance/clean_temp_users.js" )
const async          = require( "async" )
const api            = require( "./api.js" )
const utils          = require( "./utils.js" )

function initialise( callback ) {

	var log = utils.getSessionLogger( __filename, initialise )

	log.info ( "Starting SVC server." )

	async.waterfall(
			[
				function ( wCallback ) {

					dataStore.connect ( function ( error ) {

						wCallback( error )

					} )
				},
				function ( wCallback ) {

					cleanTempUsers()

					wCallback()
				},
				function ( wCallback ) {

					api.register ( function ( error ) {

						wCallback( error )

					} )
			}
			],
			callback
	)
}

module.exports = initialise