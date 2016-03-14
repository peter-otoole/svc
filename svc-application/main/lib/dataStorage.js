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

const common           = require( "./common.js" );
const sql              = require( "mssql" );
const connectionConfig = {
	user:     common.DATA_BASE_USER,
	password: common.DATA_BASE_PASSWORD,
	server:   common.DATA_BASE_SERVER,
	database: common.DATA_BASE,
	pool:     {
		max:               common.DATA_BASE_MAX,
		min:               common.DATA_BASE_MIN,
		idleTimeoutMillis: common.DATA_BASE_IDEL
	}
}

var database = {}

/**
 * requests connection to database, gets an error if connection fails
 *
 * @param {function} callback
 */
database.connect = function connect( callback ) {

	sql.connect( connectionConfig ).then( callback ).catch( callback );
}



module.exports = database;