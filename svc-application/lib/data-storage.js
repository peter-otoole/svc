/**
 * Social Visual Communication, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 * dataStorage.js - Module to handle database connection and data base management
 */
"use strict"

const constants      = require( "./constants.js" )
const utils          = require( "./utils.js" )
const mysql          = require( 'mysql' )
const connectionConf = {
	host:     constants.runtime_conf.database.host,
	port:     constants.runtime_conf.database.port,
	user:     constants.runtime_conf.database.user,
	password: constants.runtime_conf.database.password,
	database: constants.runtime_conf.database.name
}


var connection = mysql.createConnection( connectionConf )

/**
 * requests connection to database, gets an error if connection fails
 *
 * @param {function} callback
 */
module.exports.connect = function connect( callback ) {

	var log = utils.getSessionLogger( __filename, connect )

	log.info( connectionConf, "Attempting to connect to the database" )
	connection.connect( callback )
}


/**
 * Inserts a temporary user into the database
 *
 * @param {string} email - valid email address
 * @param {string} passPhrase - 72 character random string
 * @param {number} creationTime - JS timestamp
 * @param {function} callback - takes error or null
 */
module.exports.createTempUser = function createTempUser( email, passPhrase, creationTime, callback ) {

	var log = utils.getSessionLogger( __filename, createTempUser )

	// Run assertions on received data
	utils.is.always.email( email )
	utils.is.always.string( passPhrase )
	utils.is.always.number( creationTime )


	// Write the prepared statement
	var id    = utils.generateUUID
	var query = {
		sql:     "INSERT INTO user_temp(id,email,passphrase,creationtime) VALUES(?,?,?,now())",
		timeout: constants.default_database_timeout
	}
	var data  = [ id, email, passPhrase, creationTime.toString() ]


	// Query database to insert a new entry
	log.debug( { query, data }, "Attempting to add a new temporary user" )
	connection.query( query, data, error => {

		if ( error ) {

			log.error ( error, "Database insertion failed" )
		} else {

			log.debug( "Temporary user inserted into the database" )
		}

		callback( error )
	} )
}


/**
 * Finds a user based on email address and removes the entry
 *
 * @param {string} email - valid email address
 * @param {function} callback - takes error or null
 */
module.exports.removeTempUser = function removeTempUser( email, callback ) {

	var log = utils.getSessionLogger( __filename, removeTempUser )

	// Run assertions on received data
	utils.is.always.email( email )


	// Write the prepared statement
	var query = {
		sql:     "DELETE FROM user_temp WHERE email = ? limit 1",
		timeout: constants.default_database_timeout
	}
	var data  = [ email ]


	// Query database to insert a new entry
	log.debug( { query, data }, "Attempting to remove the temporary user based on email" )
	connection.query( query, data, error => {

		if ( error ) {

			log.error ( error, "Database deletion failed" )
		} else {

			log.debug( "Temporary user removed from the database" )
		}

		callback( error )
	} )
}


/**
 * Finds all temp users which are older than 1 day (controlled by constants.max_temp_user_age) and removes them from the database
 *
 * @param {function} callback - takes error or null
 */
module.exports.removeTempUserOnAge = function removeTempUserOnAge( callback ) {

	var log = utils.getSessionLogger( __filename, removeTempUserOnAge )


	// Write the prepared statement
	var query = {
		sql:     "DELETE FROM user_temp WHERE creationtime < date_sub(now(), ?)",
		timeout: constants.default_database_timeout
	}
	var data  = [ constants.max_temp_user_age ]


	// Query database to insert a new entry
	log.debug( { query, data }, "Attempting to remove all temporary user past max age" )
	connection.query( query, data, ( error, rows ) => {

		if ( error ) {

			log.error ( error, "Database deletion failed" )
		} else {

			log.debug( rows, "Temporary users removed from the database" )
		}

		callback( error, rows )
	} )
}


/**
 * Inserts a user into the database
 *
 * @param {string} fName - User's first name, should be less than 100 chars
 * @param {string} lName - User's last name, should be less than 100 chars
 * @param {string} email - valid email address, should be less that 255 chars
 * @param {number} dob - JS unix ms time
 * @param {string} password - user password hashed
 * @param {string} salt - password salt
 * @param {function} callback - takes error or null
 */
module.exports.createUser = function createUser( fName, lName, email, dob, password, salt, callback ) {

	var log = utils.getSessionLogger( __filename, createUser )

	// Run assertions on received data
	utils.is.always.email( email )
	utils.is.always.string( fName )
	utils.is.always.string( lName )
	utils.is.always.number( dob )
	utils.is.always.string( password )
	utils.is.always.string( salt )


	// Write the prepared statement
	var id    = utils.generateUUID
	var query = {
		sql:     "INSERT INTO user(id,fname,lname,email,dob,password,salt,creation) VALUES(?,?,?,?,?,?,?,now())",
		timeout: constants.default_database_timeout
	}
	var data  = [ id, fName, lName, email, dob, password, salt ]


	// Query database to insert a new entry
	log.debug( { query, data }, "Attempting to add a user to the database" )
	connection.query( query, data, ( error, rows ) => {

		if ( error ) {

			log.error ( error, "Database insertion failed" )
		} else {

			log.debug( rows, "User inserted into the database" )
		}

		callback( error, rows )
	} )
}