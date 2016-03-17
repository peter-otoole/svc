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

module.exports = database;