/**
 * Social Visual Communication, Copyright © Peter O'Toole All Rights Reserved
 * 
 * @author Peter O'Toole peterjotoole@outlook.com
 * 
 * @version 0.0.1
 * @since 10/14/2014
 * 
 * 
 * dataStorage.js - Module to handle database connection and data base management
 * 
 * 
 */

var MSSQL;
var common;

var init = function( ) {

	common = require( "./common.js" );
	var MSSQLConnector = require( "node-mssql-connector" );

	var MSSQL = new MSSQLConnector( {
	    settings: {
	        max: common.DATA_BASE_MAX,
	        min: common.DATA_BASE_MIN,
	        idleTimeoutMillis: common.DATA_BASE_IDEL
	    },
	    connection: {
	        userName: common.DATA_BASE_USER,
	        password: common.DATA_BASE_PASSWORD,
	        server: common.DATA_BASE_SERVER,
	        options: {
		        database: common.DATA_BASE
	        }
	    }
	} );

};
