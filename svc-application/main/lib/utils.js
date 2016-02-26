/**
 * Social Visual Communication, Copyright © Peter O'Toole All Rights Reserved
 * 
 * @author Peter O'Toole peterjotoole@outlook.com
 * 
 * @version 0.0.1
 * @since 10/14/2014
 * 
 * 
 * utils.js - A high level module specifically designed to provide basic utilities for SVC
 * 
 * Exports include Logger, validator, sanitizer, etc
 * 
 */

/**
 * Global Variables including scripts and other functional settings 
 */

var validator;
var passwordHash;

/**
 * init(): loads required scripts and initializes variables 
 * 
 * @return if the require was successful or not
 * 
 */
var init = function( ) {

	var logger = logger( "utils.init" );

	logger.info( "requiring all necissary scripts" );

	try{

		validator = require( "validator" );
		passwordHash = require( "password-hash" );
		return true;
	}catch( error ){

		logger.error( "Failed to load scripts: " + error, 5 );
		return false;
	}
};

/**
 * logger():  curried function for logging, at the beginning of a function, create an new instance of the logger and pass it function name, 
 * you can then access the separate parts of the logger with the function name always included.
 * 
 * @param fun - name of the function/module using the logger
 * @param message - the message you want to log
 * @param level - an arbitrary integer specifying the severity of the error
 * 
 * @return record - an object containing two separate loggers
 * 
 */
var logger = function( fun ) {

	var record = {

	    info: function( message ) {

		    console.log( fun + "() - " + message );
	    },

	    error: function( message, level ) {

		    if( level ){
			    console.error( fun + "() - Level - " + level + " - Error - " + message );
		    }else{
			    console.error( fun + "() - Error - " + message );
		    }
	    }
	};

	return record;
};

exports.logger = logger;

/**
 * generateRandomCharString(): take an integer length and generates a string of random characters that length, character set is currently set as [A-Za-z0-9]
 * Added/remove characters to change possibles
 * 
 * @param length - the length of the string you want to generate
 * 
 * @return randomString - a string of random characters
 * 
 */
exports.generateRandomCharString = function( length ) {

	var charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var randomString = "";

	for( var i = 0; i < length; i++ ){

		var position = Math.floor( Math.random( ) * charSet.length );
		randomString += charSet.substring( position, position + 1 );
	}

	return randomString;
};

/**
 * validateString(): takes a string and trims it, then checks if the string is in the correct range
 * 
 * @param suspect - A suspect value which needs to be validated
 * @param maxLength - An optional max length for the suspects string length
 * 
 * @returns either a valid string or false. Note: the valid string is validated and trimmed
 */
exports.validateString = function( suspect, maxLength ) {

	var logger = logger( "utils.validateString" );

	if( init( ) ){

		logger.info( "Attempting to validate that the suspect string (" + suspect + ") is a string" );

		if( suspect ){

			suspect = validator.trim( suspect );
			suspect = suspect.toString( );

			if( maxLength ){

				if( suspect.length <= maxLength && suspect.length > 0 ){
					logger.info( "Suspect is valid - returning suspect" );
					return suspect;
				}else{
					logger.error( "Suspect is outside correct length range - returning false", 1 );
					return false;
				}

			}else{
				if( suspect.length > 0 ){
					logger.info( "Suspect is valid - returning suspect" );
					return suspect;
				}else{
					logger.error( "Suspect is outside correct length range - returning false", 1 );
					return false;
				}
			}
		}else{

			logger.error( "Suspect is not defined - returning false", 1 );
			return false;
		}
	}else{

		logger.error( "Failed to initialize - returning false", 5 );
		return false;
	}
};

/**
 * validateNumber(): takes a string and trims it, then checks if the string is a number
 * 
 * @param suspect - A suspect value which needs to be validated
 * 
 * @returns either a valid number or false. Note: the number is validated and trimmed, converted to an integer
 */
exports.validateNumber = function( suspect ) {

	var logger = logger( "utils.validateNumber" );

	if( init( ) ){

		logger.info( "Attempting to validate that the suspect string (" + suspect + ") is a number " );

		if( suspect ){

			suspect = validator.trim( suspect );
			suspect = parseInt( suspect );

			if( typeof suspect === "number" && !isNaN( suspect ) ){

				logger.info( "Suspect is a number, returning parsed number" );
				return suspect;
			}else{

				logger.error( "Suspect is not a number - returning false", 1 );
				return false;
			}
		}else{

			logger.error( "Suspect is not defined - returning false", 1 );
			return false;
		}
	}else{

		logger.error( "Failed to initialize - returning false", 5 );
		return false;
	}
};

/**
 * validateEmail(): takes a string, trims it and then checks if the string is a valid email address
 * 
 * @param suspect - A suspect value which needs to be validated
 * 
 * @returns either a valid email address or false. Note: the email address is validated and trimmed
 */
exports.validateEmail = function( suspect ) {

	var logger = logger( "utils.validateEmail" );

	if( init( ) ){

		logger.info( "Attempting to validate that the suspect string (" + suspect + ") is an email address" );

		if( suspect ){

			suspect = validator.trim( suspect );

			if( typeof suspect === "string" && validator.isEmail( suspect ) ){

				logger.info( "Suspect is a valid email address, returning email address as a string" );
				return suspect;
			}else{

				logger.error( "Suspect is not a number - returning false", 1 );
				return false;
			}
		}else{

			logger.error( "Suspect is not defined - returning false", 1 );
			return false;
		}
	}else{

		logger.error( "Failed to initialize - returning false", 5 );
		return false;
	}
};

/**
 * validateObject(): takes any type and attempts to create an object
 * 
 * @param suspect - A suspect value which needs to be validated
 * 
 * @returns either a valid object or false. Note: the returned value will be rendered as an object if it is.
 */
exports.validateObject = function( suspect ) {

	var logger = logger( "utils.validateObject" );

	if( init( ) ){

		logger.info( "Attempting to validate that the suspect value (" + suspect + ") is an object" );

		if( suspect ){

			if( typeof suspect === "object" ){

				logger.info( "Suspect is a valid object, returning object" );
				return suspect;
			}else{

				suspect = validator.trim( suspect.toString( ) );

				try{

					suspect = JSON.parse( suspect );
					logger.info( "Suspect is a valid object, returning object" );
					return suspect;
				}catch( error ){

					logger.error( "Suspect is not an object - returning false", 1 );
					return false;
				}
			}
		}else{

			logger.error( "Suspect is not defined - returning false", 1 );
			return false;
		}
	}else{

		logger.error( "Failed to initialize - returning false", 5 );
		return false;
	}
};

/**
 * matchingPassword(): Takes a string password and hashes it, then checks if the 2 are equal 
 * 
 * @param suspect - plain text password
 * @param hashedPassword - hashed password(ideally from database)
 * 
 * @returns true or false depending if the 2 passwords are the same or not 
 */
exports.matchingPassword = function( suspect, hashedPassword ) {

	var logger = logger( "utils.matchingPassword" );

	if( init( ) ){

		if( suspect && hashedPassword ){

			suspect = validator.trim( suspect );
			suspect = suspect.toString( );

			if( passwordHash.verify( suspect, hashedPassword ) ){

				logger.info( "Passwords are the same, returning true" );
				return true;

			}else{

				logger.error( "Passwords are not the same - returning false", 1 );
				return false;
			}
		}else{
			logger.error( "Either Suspect or Hashed Password is not defined - returning false", 1 );
			return false;
		}
	}else{

		logger.error( "Failed to initialize - returning false", 5 );
		return false;
	}
};

/**
 * generateHash(): Takes a string password and hashes it, then returns the hashed password
 * 
 * @param password - plain text password
 * 
 * @returns either a hashed password or false if it fails
 */
exports.generateHash = function( password ) {

	var logger = logger( "utils.generateHash" );
	var hashedPassword;

	if( init( ) ){

		if( password && password.length > 0 ){

			try{

				logger.info( "Trying to generate password hash" );
				hashedPassword = passwordHash.generate( password );
			}catch( error ){

				logger.error( "Could not generate a password hash", 2 );
				hashedPassword = false;
			}

			return hashedPassword;

		}else{
			logger.error( "Either Suspect or Hashed Password is not defined - returning false", 1 );
			return false;
		}
	}else{

		logger.error( "Failed to initialize - returning false", 5 );
		return false;
	}
};
