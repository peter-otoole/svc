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
			name:     constants.log_app_name,
			streams:  [
				{
					level:  constants.log_console_level,
					stream: process.stdout
				},
				{
					type:   constants.log_rotation,
					level:  constants.log_file_level,
					path:   constants.root_dir + constants.session_log_file,
					period: constants.log_rotation_scheme,
					count:  constants.log_files_kept
				}
			],
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
	var origin = utils.is.string( fileName )
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

		logger = cls.getNamespace( constants.namespace ).get ( "logger" )

		if ( !logger || !utils.is.function( logger.child ) ) {

			throw new Error( "Logger is not a valid bunyan instance" )
		}

	} catch ( error ) {

		logger = utils.getLogger()
		logger.error ( error, "Failed to get an error off the stack, using a new one" )
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
utils.is.email = emailValidate.validate


/**
 * @param {string} suspect - A suspect value which needs to be validated
 *
 * Throws an exception if the value is not an email address
 */
utils.is.always.email = function ( suspect ) {

	if ( !emailValidate.validate ( suspect ) ) {

		throw new Error( "Not a valid email address" )
	}
}


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
	var hash = crypto.createHash( constants.hash_algorithm )
	hash.update( suspect + constants.runtime_conf.app_secret )

	// compare value and hash
	return hash === hashedPassword
}

/**
 * Uses cryto to create a hash of the passed password, should be correct password string
 *
 * @param {string} suspect - plain text password
 * @returns {string} hashedPassword
 */
utils.generateHash = function generateHash( suspect, salt ) {

	// validate inputs
	is.always.string( suspect )

	// generate hash of the suspect
	var hash = crypto.createHash( constants.hash_algorithm )
	hash.update( suspect + constants.runtime_conf.app_secret )

	return hash
}

module.exports = utils