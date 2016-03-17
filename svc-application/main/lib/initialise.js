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

function initialise( callback ) {

	var log = utils.getSessionLogger( __filename, initialise )

	log.info ( "Starting SVC server." )

	async.waterfall(
			[
				function ( callback ) {

					dataStore.connect ( function ( error ) {

						callback( error )

					} )
				},
				function ( callback ) {

					api.register ( function ( error ) {

						callback( error )

					} )
			}
			],
			callback
	);
}

module.exports = initialise