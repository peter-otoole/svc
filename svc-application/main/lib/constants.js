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
	mailer_from:                "no-reply@svc.com",
	hash_algorithm:             "sha256",
	root_dir:                   "",
	namespace:                  "session",
	unknown_file_name:          "unknown",
	unknown_function_name:      "unknown",
	runtime_conf:               require( "../configuration/configuration" ),
	session_log_file:           "/application_logs/" + new Date().getTime() + ".log",
	log_console_level:          "trace",
	log_file_level:             "info",
	log_app_name:               "svc",
	log_rotation:               "rotating-file",
	log_rotation_scheme:        "1d",
	log_files_kept:             20,
	default_database_timeout:   10 * 1000,
	max_temp_user_age:          "24 hours",
	temp_user_removal_schedule: 10 * 60 * 1000,
	start_art:                  "\n\n******************************************************************************\n\n"
	                            + "    Starting Social Visual Communication application \n\n"
	                            + "******************************************************************************\n",
	start_complete_art:         "\n\n******************************************************************************\n\n"
	                            + "    Application successfully started. \n\n"
	                            + "******************************************************************************\n"
}