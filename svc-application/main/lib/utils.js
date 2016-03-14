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

const constants     = require( "./common.js" )
const bunyan        = require( "bunyan" )
const uuid          = require( "node-uuid" )
const is            = require( "is" )
const emailValidate = require( "email-validator" )
const crypto        = require( 'crypto' )
var utils           = {}


/**
 * logger():  exposes bunyan logger via the utils file
 */
utils.logger = bunyan.createLogger(
		{
			name:   "SVC",
			stream: process.stdout,
			level:  "info"
		}
)

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