/**
 * Social Visual Communication, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 24/03/2016
 *
 * clean_temp_users.js - Module to repeatedly remove all temporary users which have passed their expiry
 */
"use strict"

const dataStore = require( "../dataStorage" )
const constants = require( "../constants" )
const utils     = require( "../utils" )

module.exports = function removeUserSchedule() {

	var log = utils.getSessionLogger( __filename, removeUserSchedule )

	log.info( { schedule: constants.temp_user_removal_schedule },
	          "Setting up scheduler to remove temporary users which have passed expiry" )

	setInterval( function () {

		log.debug( "Starting scheduled task to remove temporary users which have passed expiry" )

		dataStore.removeTempUserOnAge( error => {

			log.info( error, "Schedule to remove users completed" )
		} )
	}, constants.temp_user_removal_schedule )
}