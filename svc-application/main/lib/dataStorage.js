/**
 * Social Visual Communication, Copyright � Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 * dataStorage.js - Module to handle database connection and data base management
 */
"use strict"

const constants      = require( "./constants.js" );
const utils          = require( "./utils.js" )
const mysql          = require( 'mysql' );
const connectionConf = {
	host:     constants.runtime_conf.database.host,
	port:     constants.runtime_conf.database.port,
	user:     constants.runtime_conf.database.user,
	password: constants.runtime_conf.database.password,
	database: constants.runtime_conf.database.name
}


const default_timeout = 10 * 1000;

var connection = mysql.createConnection( connectionConf );

var database = {}

/**
 * requests connection to database, gets an error if connection fails
 *
 * @param {function} callback
 */
database.connect = function connect( callback ) {

	var log = utils.getSessionLogger( __filename, connect )

	log.info( connectionConf, "Attempting to connect to the database" )
	connection.connect( callback );
}


/**
 * Inserts a temporary user into the database
 *
 * @param {string} email - valid email address
 * @param {string} passPhrase - 72 character random string
 * @param {number} creationTime - JS timestamp
 * @param {function} callback - takes error or null
 */
database.createTempUser = function createTempUser( email, passPhrase, creationTime, callback ) {

	var log = utils.getSessionLogger( __filename, createTempUser )

	// Run assertions on received data
	utils.is.always.email( email )
	utils.is.always.string( passPhrase )
	utils.is.always.number( creationTime )


	// Write the prepared statement
	var id    = utils.generateUUID
	var query = {
		sql:     "INSERT INTO user_temp(id,email,passphrase,creationtime) VALUES(?,?,?,?)",
		timeout: default_timeout
	}
	var data  = [ id, email, passPhrase, creationTime.toString() ]


	// Query database to insert a new entry
	log.debug( { query, data }, "Attempting to add a new temporary user" )
	connection.query( query, data, function ( error, results, fields ) {

		if ( error ) {

			log.error ( error, "Database insertion failed" )
			callback( error )
		} else {

			log.debug( "Temporary user inserted into the database" )
			callback()
		}
	} )
}


module.exports = database;