/**
 * Social Visual Communication, Copyright � Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 * accountManagement.js - Modules contains all business logic for account management. User registration, management and removal
 */
"use strict"

const express        = require( "express" )
const createTempUser = require( "./../users-management/create-temp-user" )
const createUser = require( "./../users-management/create-user" )


module.exports.retrieveRoutes = function retrieveRoutes() {

	var router = express.Router()

	router.post ( "/create-temp-user", createTempUser.validate, createTempUser.logic )
	router.post ( "/create-user", createUser.validate, createUser.logic )

	return router
}