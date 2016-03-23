/**
 * Social Visual Communication, Copyright � Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 *
 * graphicManagement.js - Main business logic for handling graphics
 *
 */
"use strict"

const express = require( "express" )

function retrieveRoutes() {

	var router = express.Router()

	router.get ( "/placeholder", placeholder )

	return router
}


module.exports.retrieveRoutes = retrieveRoutes


function placeholder( request, response ) {

	response.status( 200 ).send( "Stubbed API" )
}