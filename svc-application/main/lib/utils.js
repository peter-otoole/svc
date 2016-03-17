/**
 * SVC, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 * utils.js - A high level module specifically designed to provide basic utilities for SVC
 *
 * Exports include Logger, validators, type checking, password hashing, etc
 */
"use strict"

const constants     = require( "./constants.js" )
const bunyan        = require( "bunyan" )
const uuid          = require( "node-uuid" )
const is            = require( "is" )
const emailValidate = require( "email-validator" )
const cls           = require( "continuation-local-storage" )
const crypto        = require( "crypto" )
const path          = require( "path" )
var utils           = {}


/**
 * exposes an instance of the bunyan logger
 *
 * @returns bunyan instance
 *
 * */
utils.getLogger = function getLogger() {

	return bunyan.createLogger(
		{
			name:     "SVC",
			stream:   process.stdout,
			level:    "trace",
			trace_id: utils.generateUUID()
		}
	)
}


/**
 * Locates the logger on session or generates a new one based on a file/function name
 *
 * @param {string} fileName - the origin file, use "__filename"
 * @param {string,function} functionName - either a string value or function reference
 * @returns {XMLList} childLogger - bunyan child logger
 */
utils.getSessionLogger = function getSessionLogger( fileName, functionName ) {

	var logger

	// Process the log origin based on the passed parameters
	var origin = ( utils.is.string( fileName ) )
			? path.basename( fileName, ".js" )
			: constants.unknown_file_name

	origin += "."

	if ( utils.is.function( functionName ) ) {

		origin += functionName.name
	} else if ( utils.is.string ( functionName ) ) {

		origin += functionName
	} else {

		origin += constants.unknown_function_name
	}

	// Attempt to get the logger off the stack namespace || get a new one
	try {

		logger = cls.getNamespace( contains.namespace ).get ( "logger" )

		if ( !logger || !utils.is.function( logger.child ) ) {

			logger = utils.getLogger()
		}

	} catch ( error ) {

		logger = utils.getLogger()
	}

	// Return a child instance of the logger based on the origin
	return logger.child ( { origin } )
}

/**
 * Generates a UUID, not cryptographically random but random
 *
 * @return {string} UUID - a string of random characters
 *
 */
utils.generateUUID = uuid.v4

/**
 * exposes the
 *
 */
utils.is = is

/**
 * @param {string} suspect - A suspect value which needs to be validated
 *
 * @returns {boolean} either a valid email address or false.
 */
utils.validateEmail = emailValidate.validate


/**
 * Takes a string password and hashes it, then checks if the two are equal
 *
 * @param {string} hashedPassword - hashed password(ideally from database)
 * @param {string} suspect - plain text password
 *
 * @returns {boolean} equal - Are passwords equal
 */
utils.matchingPassword = function matchingPassword( hashedPassword, suspect ) {

	// validate inputs
	is.always.string( hashedPassword )
	is.always.string( suspect )

	// generate hash of the suspect
	var hash = crypto.createHash( constants.HASH_ALGORITHM );
	hash.update( suspect + constants.SECRET )

	// compare value and hash
	return hash === hashedPassword
}

/**
 * Uses cryto to create a hash of the passed password, should be correct password string
 *
 * @param {string} suspect - plain text password
 * @returns {string} hashedPassword
 */
utils.generateHash = function generateHash( suspect ) {

	// validate inputs
	is.always.string( suspect )

	// generate hash of the suspect
	var hash = crypto.createHash( constants.HASH_ALGORITHM );
	hash.update( suspect + constants.SECRET )

	return hash
}

module.exports = utils