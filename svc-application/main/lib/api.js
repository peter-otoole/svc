/**
 * Social Visual Communication, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 *
 * api.js - Modules handles all API requests
 *
 * Supports:
 * [0] - GET "/" - Load index page
 * [1] - GET "/resources/:dynfolder/:dynfile" - Generically loads resources from main project
 */
"use strict"


/*
 Initialise packages, require necessary modules and scripts.
 */
const express       = require( "express" );
const utils         = require( "./utils.js" );
const codes         = reuqire( "./codes.js" );
const constants     = require( "./common.js" );
const accountManage = require( "./accountManagement.js" );
const graphicManage = require( "./graphicManagement.js" );
var app             = express();

// Root -> loads index page
app.get( "/", function ( request, response ) {

	if ( request.session.authorized ) {

		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err || !( res.rowcount === 1 ) ) {

				response.render( "../base/index.html", {
					email:        "",
					key:          "",
					resValDialog: ""
				} );
				request.session.destroy();
			} else {

				response.sendfile( "./views/base/home.html" );
			}
		} );
	} else {

		response.render( "../base/index.html", {
			email:        "",
			key:          "",
			resValDialog: ""
		} );
	}
} );

// Resources -> resolves the gives resource
app.get( "/resources/:dynfolder/:dynfile", function ( request, response ) {

	var folder = request.params.dynfolder, file = request.params.dynfile;

	console.log( "Resoruces requested @ /resources/" + folder + "/" + file );

	if ( folder === "imgs" ) {
		response.setHeader( "Content-Type", "image/png" );
	} else if ( folder === "css" ) {
		response.setHeader( "Content-Type", "text/css" );
	} else if ( folder === "js" ) {
		response.setHeader( "Content-Type", "text/javascript" );
	}

	response.sendfile( "./resources/" + folder + "/" + file );
} );

app.listen( common.HTTP_PORT );
