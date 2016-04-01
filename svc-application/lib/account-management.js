/**
 * Social Visual Communication, Copyright � Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 * accountManagement.js - Modules contains all business logic for account management. User registration, management and removal
 */
"use strict"

const express        = require( "express" )
const utils          = require( "./utils" )
const codes          = require( "./codes" )
const createTempUser = require( "./users-management/create-temp-user" )


function retrieveRoutes() {

	var router = express.Router()

	router.post ( "/create-temp-user", createTemporaryUser )

	return router
}


module.exports.retrieveRoutes = retrieveRoutes


function createTemporaryUser( request, response ) {

	var log = utils.getSessionLogger( __filename, createTemporaryUser )

	var email = request.body.email

	log.debug( { email }, "Received request to create a temporary user" )

	if ( !utils.is.email( email ) ) {

		log.warn( { email }, "Email address is not valid" )

		var res = {
			code:    codes.code.HTTP_UNPROCESSABLE_REQUEST,
			message: codes.message.INCORRECT_INPUT
		}

		return response.status( res.code ).send ( res )
	}


	createTempUser( email, ( error, result ) => {

		if ( error ) {

			log.warn( { error, result }, "Failed to create temporary user" )
		} else {

			log.trace ( { result }, "Temporary user created" )
		}

		response.status( result.code ).send( result )
	} )
}
