/**
 * Social Visual Communication, Copyright � Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 01/04/2016
 *
 * Modules attempts create a user provided a temporary user already exists in the database
 */
"use strict"

const dataStore = require( "../data-storage" )
const codes     = require( "../codes" )
const utils     = require( "../utils" )

/**
 * Takes user details and creates a user provided there is a temporary user already available
 *
 *
 * @param {string} fName - user first name
 * @param {string} lName - user last name
 * @param {string} email - valid email address
 * @param {string} dob - users date of birth
 * @param {string} password - user chosen password
 * @param {string} passPhrase - server generated pass phrase to allow user creation
 * @param {function} callback - callback function taking result and error
 */
module.exports = function createUser( fName, lName, email, dob, password, passPhrase, callback ) {

	var log            = utils.getSessionLogger( __filename, createUser )
	var salt           = utils.generateUUID() + utils.generateUUID()
	var hashedPassword = utils.generateHash( password, salt )


	// Ensure there is a temporary user already
	// TODO check temporary user here


	// create db entry
	dataStore.createUser( fName, lName, email, dob, hashedPassword, salt, ( error, result ) => {

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


module.exports.validate = function(){}
module.exports.logic = function(){}