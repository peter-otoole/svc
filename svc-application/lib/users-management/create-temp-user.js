/**
 * Social Visual Communication, Copyright � Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 01/04/2016
 *
 * Modules sends an email with registering details and enters the temporary details into the database.
 */
"use strict"

const dataStore = require( "../data-storage" )
const codes     = require( "../codes" )
const utils     = require( "../utils" )

/**
 * Takes an email address and sends sign up details to that address; stores the pass phrase for the user creation in
 * the database as a temporary user.
 *
 * @param {string} email - valid email address
 * @param {function} callback - callback function taking result and error
 */
module.exports = function createTempUser( email, callback ) {

	var log          = utils.getSessionLogger( __filename, createTempUser )
	var passPhrase   = utils.generateUUID() + utils.generateUUID()
	var creationTime = new Date().getTime()

	// send email
	// TODO add email sending here.

	// create db entry
	dataStore.createTempUser( email, passPhrase, creationTime, ( error, result ) => {

		var res = {}

		if ( error ) {

			log.warn ( { error, result }, "Unable to create user" )
			res = {
				code:    codes.code.HTTP_INTERNAL_SERVER_ERROR,
				message: codes.code.HTTP_INTERNAL_SERVER_ERROR
			}
		}
		else {

			log.info ( { result }, "Temporary user created successfully" )
			res = {
				code:                     codes.code.HTTP_CREATED,
				message:                  codes.message.CREATED,
				//TODO remove stubbed response - will be sent over email in production
				STUBBED_MESSAGE_RESPONSE: result
			}
		}

		return callback( error, res )
	} )
}