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
 * Expects to be used as middleware, expects email address to be set in the body
 */
module.exports.validate = function validateTemporaryUser( request, response, next ) {

	var log = utils.getSessionLogger( __filename, validateTemporaryUser )

	if ( !request.body || !request.body.email || !utils.is.email( request.body.email ) ) {

		log.warn( "Email address is not valid" )

		response.status( codes.code.HTTP_UNPROCESSABLE_REQUEST )
			.send ( {
				        code:    codes.code.HTTP_UNPROCESSABLE_REQUEST,
				        message: codes.message.INCORRECT_INPUT
			        } )
	} else {

		request.body.email = request.body.email.toLowerCase()
		return next()
	}
}


/**
 * Expects to be used as middleware, expects email address to be set in the body
 */
module.exports.logic = function createTemporaryUser( request, response ) {

	var log          = utils.getSessionLogger( __filename, createTemporaryUser )
	var passPhrase   = utils.generateUUID() + utils.generateUUID()
	var creationTime = new Date().getTime()
	var email        = request.body.email

	log.debug( { email }, "Received request to create a temporary user" )

	var sendEmail = new Promise( ( resolve, reject ) => {

		// send email
		// TODO add email sending here.

		resolve()
	} )

	var updateDataStore = new Promise( ( resolve, reject ) => {

		// create db entry
		dataStore.createTempUser( email, passPhrase, creationTime, ( error, result ) => {

			if ( error ) {

				log.error( error, "Temporary user creation error" )

				reject( {
					        code:    codes.code.HTTP_INTERNAL_SERVER_ERROR,
					        message: codes.message.INTERNAL_SERVER_ERROR
				        } )
			}
			else {

				resolve( {
					         code:            codes.code.HTTP_CREATED,
					         message:         codes.message.CREATED,
					         //TODO remove stubbed response - will be sent over email in production
					         ACTIVATION_CODE: passPhrase
				         } )
			}
		} )
	} )

	Promise.all( [ sendEmail, updateDataStore ] ).then( result => {

		log.info( result, "Temporary user created successfully" )
		response.status( result[ 1 ].code ).send( result[ 1 ] )
	}, result => {

		log.error( "Failed to create temporary user" )
		response.status( result[ 1 ].code ).send( result[ 1 ] )
	} )
}