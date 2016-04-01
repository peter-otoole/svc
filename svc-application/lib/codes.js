/**
 * Social Visual Communication, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 * code.js - Module containing response messages and codes
 */
"use strict"

exports.code = {
	HTTP_OK:                    200,
	HTTP_CREATED:               201,
	HTTP_ACCEPTED:              202,
	HTTP_NO_CONTENT:            204,
	HTTP_BAD_REQUEST:           400,
	HTTP_ACCESS_DENIED:         401,
	HTTP_FORBIDDEN:             403,
	HTTP_NOT_FOUND:             404,
	HTTP_METHOD_NOT_ALLOWED:    405,
	HTTP_UNPROCESSABLE_REQUEST: 422,
	HTTP_INTERNAL_SERVER_ERROR: 500
}

exports.message = {

	OK:                    "SVC - Okay",
	CREATED:               "SVC - Requested resource was created",
	ACCEPTED:              "SVC - Accepted",
	BAD_REQUEST:           "SVC - The request was not formed correctly",
	INCORRECT_INPUT:       "SVC - Request was well formed but values were not as expected",
	ACCESS_DENIED:         "SVC - Requests access token is not valid",
	FORBIDDEN:             "SVC - You do not have a correct access token to perform this request",
	ACCOUNT_NOT_FOUND:     "SVC - Account was not found",
	IMAGE_NOT_FOUND:       "SVC - The image you are looking for was not found",
	METHOD_NOT_ALLOWED:    "SVC - The request was not allowed for unspecific reasons",
	INTERNAL_SERVER_ERROR: "SVC - An unknown internal server error has occurred"
}