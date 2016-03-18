/**
 * Social Visual Communication, Copyright Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 * common.js - Contains constants for the application
 */
"use strict"

module.exports = {
	MAILER_FROM:           "no-reply@svc.com",
	HASH_ALGORITHM:        "sha256",
	root_dir:              "",
	namespace:             "session",
	unknown_file_name:     "unknown",
	unknown_function_name: "unknown",
	runtime_conf:          require( "../configuration/configuration" ),
	session_log_file:      "/application_logs/" + new Date().getTime() + ".log",
	log_console_level:     "trace",
	log_file_level:        "info",
	log_app_name:          "svc",
	log_rotation:          "rotating-file",
	log_rotation_scheme:   "1d",
	log_files_kept:        20,
	start_art:             "\n\n******************************************************************************\n\n"
	                       + "    Starting Social Visual Communication application \n\n"
	                       + "******************************************************************************\n",
	start_complete_art:    "\n\n******************************************************************************\n\n"
	                       + "    Application successfully started. \n\n"
	                       + "******************************************************************************\n"
}