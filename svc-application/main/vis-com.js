/**
 * Social Visual Communication, Copyright � Peter O'Toole All Rights Reserved
 *
 * @author Peter O'Toole peterjotoole@outlook.com
 *
 * @version 0.0.1
 * @since 10/14/2014
 *
 *
 * vis-com.js - Configuration loaded
 *
 */
"use strict"


console.log ( "\n********************************************************************************" );
var express              = require( "express" ), app = express();
var validator            = require( "validator" );
var passwordHash         = require( "password-hash" );
var user                 = "";
var REGULAR_PORT         = 80;
var SOCKET_PORT          = 8080;
var currentWebAddress    = "127.0.0.1:" + REGULAR_PORT;
var currentGroupSessions = new Array();

/***********************************************************************************************************************
 *
 *                                    Socket i.o.
 *
 ***********************************************************************************************************************
 */

var io = require( "socket.io" ).listen ( SOCKET_PORT, {
	log: false
} );

var chat = io.of ( "/communication/" ).on ( "connection", function ( socket ) {

	socket.emit ( "accepted", "ok" );
	socket.on ( "init", function ( data ) {

		findUserBySession( data.userSession, function ( err, res ) {

			if ( err ) {
				console.log ( "Initalising a User in Group Session: Failed, DB Error!" );
				socket.emit ( "user-added", "failed" );
			} else {
				var groupIndex = getIndexOfGroupSession( data.groupSession );
				if ( validator.isNumeric ( groupIndex ) ) {
					currentGroupSessions [ groupIndex ].addUser ( res.result [ 0 ].id, data.userSession, socket );
					console.log ( "Initalising a User in Group Session: Success" );
					socket.emit ( "user-added", "ok" );
				} else {
					console.log ( "Initalising a User in Group Session: Failed, could not find group!" );
					socket.emit ( "user-added", "failed" );
				}
			}
		} );
	} );

	socket.on ( "send-group-message", function ( data ) {

		var groupIndex = getIndexOfGroupSession( data.groupSession );
		if ( validator.isNumeric ( groupIndex ) ) {
			var sockets = currentGroupSessions [ groupIndex ].getOtherMembers ( data.sessionID );
			for ( var i = 0; i < sockets.length; i++ ) {
				console.log ( "Emitting to User..." );
				sockets [ i ].emit ( "draw-this", {
					drawingInstruction: data.drawingInstruction
				} );
			}
		} else {
			console.log ( "Send Group Message: Group Not Found!" );
		}
	} );

	socket.on ( "group-update-layers", function ( data ) {

		var groupIndex = getIndexOfGroupSession( data.groupSession );
		if ( validator.isNumeric ( groupIndex ) ) {
			var sockets = currentGroupSessions [ groupIndex ].getOtherMembers ( data.sessionID );
			for ( var i = 0; i < sockets.length; i++ ) {
				console.log ( "Emitting to User..." );
				sockets [ i ].emit ( "update-layer", {
					drawingInstruction: data.drawingInstruction
				} );
			}
		} else {
			console.log ( "Group Update Layer: Group Not Found!" );
		}
	} );

	socket.on ( "group-clear-canvas", function ( data ) {

		var groupIndex = getIndexOfGroupSession( data.groupSession );
		if ( validator.isNumeric ( groupIndex ) ) {
			var sockets = currentGroupSessions [ groupIndex ].getOtherMembers ( data.sessionID );
			for ( var i = 0; i < sockets.length; i++ ) {
				console.log ( "Emitting to User..." );
				sockets [ i ].emit ( "clear-canvas", "" );
			}
		} else {
			console.log ( "Group Clear Canvas: Group Not Found!" );
		}
	} );

	socket.on ( "get-full-drawing", function ( data ) {

		var groupIndex = getIndexOfGroupSession( data.groupSession );
		console.log ( "Getting Full Drawing: " + groupIndex );
		if ( validator.isNumeric ( groupIndex ) ) {
			if ( currentGroupSessions [ groupIndex ].users.length > 1 ) {
				var primarySocket = currentGroupSessions [ groupIndex ].users [ 0 ].socketConnection;
				primarySocket.emit ( "request-full-drawing", "" );
				primarySocket.on ( "get-full-drawing", function ( data ) {

					socket.emit ( "draw-full-drawing", {
						data: data
					} );
				} );
			} else {
				console.log ( "Getting Full Drawing: This user is the first in the group, nothing to be shared" );
			}
		} else {
			console.log ( "Getting Full Drawing: Group Not Found - Group Index not a number." );
		}
	} );

} );

/***************************************************************************************************************************************************************
 * ** *** ** Initialise Server *** ** *** ************************************************************************************
 */

    // setting up DB connection
var MSSQLConnector = require( "node-mssql-connector" );
var MSSQLClient    = new MSSQLConnector( {
	settings:   {
		max:               20,
		min:               0,
		idleTimeoutMillis: 1000
	},
	connection: {
		userName: "msdb1531",
		password: "msdb1531PE",
		server:   "LUGH3.it.nuigalway.ie",
		options:  {
			database: "msdb1531"
		}
	}
} );
var mailer         = require( "express-mailer" );
// setting up emailer
mailer.extend ( app, {
	from:             "no-reply@SVC.com",
	host:             "smtp.gmail.com",
	secureConnection: true,
	port:             465,
	transportMethod:  "SMTP",
	auth:             {
		user: "svc.no.reply@gmail.com",
		pass: "willowstick"
	}
} );
// Setting up jade renderer
app.set ( "views", "/views/emails/" );
app.engine ( ".html", require( "jade" ).__express );
app.set ( "view engine", "jade" );
// adding session tracking
app.use ( express.cookieParser () );
app.use ( express.session ( {
	                            secret: "jRwRWkZy2YnPJzFL6wG72F3w2BZ6gZBZm2KB5bC14jsnkri5QX0maS99H8ItgTF4"
                            } ) );
app.use ( express.bodyParser () );
console.log ( "\nRemoved all sessions from Database!" );
console.log ( "\nServer running at " + currentWebAddress );
console.log ( "Server fully started" );
console.log ( "\n********************************************************************************" );

/*********************************************************************************************
 *
 *                                Regular GET/POST Request
 *
 *********************************************************************************************
 */

	// Root -> loads index page
app.get ( "/", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err || !( res.rowcount === 1 ) ) {
				response.render ( "../base/index.html", {
					email:        "",
					key:          "",
					resValDialog: ""
				} );
				request.session.destroy ();
			} else {
				response.sendfile ( "./views/base/home.html" );
			}
		} );
	} else {
		response.render ( "../base/index.html", {
			email:        "",
			key:          "",
			resValDialog: ""
		} );
	}
} );

// public drawing
app.get ( "/public-drawing/:dynimg", function ( request, response ) {

	var imgurl = request.params.dynimg;
	loadPublicImg( imgurl, function ( err, res ) {

		if ( err || !( res.rowcount === 1 ) ) {
			response.redirect ( "/" );
		} else {
			response.render ( "../base/public-drawing.html", {
				imgData: res.result [ 0 ].data
			} );
		}
	} );
} );

// Sign-in -> validate the email address and password, return home page with session ID
app.post ( "/sign-in/", function ( request, response ) {

	var email = validator.trim ( request.body.emailAddress ), password = validator.trim ( request.body.password );
	// input validation; reject login if violated.
	if ( validator.isEmail ( email ) && validator.isLength ( password, 8, 32 ) ) {
		// query Database
		getUserByEmailAddress( email, function ( err, res ) {

			// if email address not found or multi found, reject the login
			if ( err || !( res.rowcount === 1 ) ) {
				console.log ( "Login Rejected: err or row count not 1" );
				response.send ( 403, "failed" );
			} else {
				// if the passwords are equal, return ok with session ID, if not, reject login attempt
				if ( passwordHash.verify ( password, res.result [ 0 ].password ) && ( res.result [ 0 ].active ) ) {

					addSession( request.sessionID, res.result [ 0 ].id, function ( sessErr, sessRes ) {

						if ( sessErr ) {
							console.log ( "Login Rejected: DB Query Error" );
							response.send ( 403, "failed" );
						} else {
							// Remove Later --------
							console.log ( "Login Accepted: " + res.result [ 0 ].fname );
							request.session.authorized = true;
							response.send ( 200, "ok" );
						}
					} );
				} else {
					console.log ( "Login Rejected: account not active or passwords are not equal." );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Login Rejected: input validation violated!" );
		response.send ( 403, "failed" );
	}
} );

// sign-up -> validate input params, persist to database and return sign-in page.
app
		.post (
				"/register/",
				function ( request, response ) {

					var fname                                    = validator.trim (
							request.body.fName ), lname          = validator.trim (
							request.body.lName ), email          = validator
							.trim ( request.body.eAddress ), dob = new Date( validator.trim (
							request.body.DOB ) ), password       = validator
							.trim ( request.body.Password );

					// Input Validation
					if ( validator.isLength ( fname, 1, 32 ) && validator.isLength ( lname, 1, 32 )
							&& validator.isEmail ( email ) && validator.isNumeric ( dob.valueOf () )
							&& validator.isLength ( password, 8, 32 ) ) {

						var key = generateRandomCharString( 64 );

						addUser( fname, lname, email, dob, passwordHash.generate ( password ), key,
						         function ( err, res ) {

							         if ( err ) {
								         console.log ( "Registration Failed!" );
								         response.send ( 403, "failed" );
							         } else {
								         console.log ( "Registration Success!" );
								         app.mailer.send ( "confirm-registration", {
									         to:      email,
									         subject: "SVC: Confirm Registration",
									         link:    "http://" + currentWebAddress + "/activate/" + email + "/" + key
								         }, function ( err ) {

									         if ( err ) {
										         console.log ( err );
									         }
								         } );
								         response.send ( 200, "ok" );
							         }
						         } );
					} else {
						console.log ( "Registration Failed! (Broken input validation)" );
						response.send ( 403, "failed" );
					}
				} );

// sign-out -> Invalidates user sessions and returns home page
app.post ( "/sign-out/", function ( request, response ) {

	console.log ( "User logged out." );
	request.session.authorized = false;
	request.session.destroy ();
	removeSession( request.sessionID, function ( err, res ) {

		response.send ( 200, "ok" );
	} );
} );

// Home page -> (Get) loads home page if user logged in, if not, load base index page
app.get ( "/home/", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err || !( res.rowcount === 1 ) ) {
				response.render ( "../base/index.html", {
					email:        "",
					key:          "",
					resValDialog: ""
				} );
				request.session.destroy ();
			} else {
				response.sendfile ( "./views/base/home.html" );
			}
		} );
	} else {
		response.render ( "../base/index.html", {
			email:        "",
			key:          "",
			resValDialog: ""
		} );
	}
} );

// Home page -> (POST) loads home page if user logged in, if not, load base index page
app.post ( "/home/", function ( request, response ) {

	console.log ( "User clicked for home." );
	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				response.redirect ( "/" );
			} else {
				response.sendfile ( "./views/base/home.html" );
			}
		} );
	} else {
		response.redirect ( "/" );
	}
} );

// Resources -> resolves the gives resource
app.get ( "/resources/:dynfolder/:dynfile", function ( request, response ) {

	var folder = request.params.dynfolder, file = request.params.dynfile;

	console.log ( "Resoruces requested @ /resources/" + folder + "/" + file );

	if ( folder === "imgs" ) {
		response.setHeader ( "Content-Type", "image/png" );
	} else if ( folder === "css" ) {
		response.setHeader ( "Content-Type", "text/css" );
	} else if ( folder === "js" ) {
		response.setHeader ( "Content-Type", "text/javascript" );
	}

	response.sendfile ( "./resources/" + folder + "/" + file );
} );

// Sign In -> loads extra html segments
app.get ( "/html/sign-in.html", function ( request, response ) {

	response.sendfile ( "./views/extra/sign-in.html" );
} );

// Register -> loads extra html segments
app.get ( "/html/register.html", function ( request, response ) {

	response.sendfile ( "./views/extra/register.html" );
} );

// Private Drawing -> loads extra html segments if user is signed in, if not they are redirected
app.get ( "/html/private-drawing.html", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				response.send ( 403, "redirect" );
			} else {
				response.sendfile ( "./views/extra/private-drawing.html" );
			}
		} );
	} else {
		response.send ( 403, "redirect" );
	}
} );

// Group Drawing -> loads extra html segments if user is signed in, if not they are redirected
app.get ( "/html/group-drawing.html", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				response.send ( 403, "redirect" );
			} else {
				response.sendfile ( "./views/extra/group-drawing.html" );
			}
		} );
	} else {
		response.send ( 403, "redirect" );
	}
} );

// Home -> loads extra html segments if user is signed in, if not they are redirected
app.get ( "/html/home.html", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err || !( res.rowcount === 1 ) ) {
				response.send ( 403, "redirect" );
			} else {
				response.render ( "../extra/home.html", {
					userName: res.result [ 0 ].fname
				} );
			}
		} );
	} else {
		response.send ( 403, "redirect" );
	}
} );

// Allows users to save their drawing, work in both group and single session
app.post ( "/save-drawing/", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Save Drawing: Failed, User not signed in." );
				response.send ( 403, "redirect" );
			} else {
				var data = request.body.data, name = request.body.name, publ = request.body.publicShare;
				var publicShare;
				if ( publ === "true" ) {
					publicShare = true;
				} else {
					publicShare = false;
				}
				saveNewDrawing( name, data, publicShare, res.result [ 0 ].id, function ( saveErr, saveRes ) {

					if ( saveErr ) {
						console.log ( "Save Drawing: Failed, DB Query failed!" );
						response.send ( 403, "failed" );
					} else {
						console.log ( "Save Drawing: Success!" );
						response.send ( 200, {
							id: saveRes.result [ 0 ].id
						} );
					}
				} );
			}
		} );
	} else {
		console.log ( "Save Drawing: Failed, User not signed in." );
		response.send ( 403, "redirect" );
	}
} );

app
		.post (
				"/save-pre-existing-drawing/",
				function ( request, response ) {

					if ( request.session.authorized ) {
						findUserBySession(
								request.sessionID,
								function ( err, res ) {

									if ( err ) {
										console.log ( "Save Drawing: Failed, User not signed in." );
										response.send ( 403, "redirect" );
									} else {
										var data = request.body.data, id = request.body.id, name = request.body.name, publ = request.body.publicShare;
										var publicShare;
										if ( publ === "true" ) {
											publicShare = true;
										} else {
											publicShare = false;
										}
										saveExistingDrawing( name, data, id, publicShare, res.result [ 0 ].id,
										                     function ( saveErr, saveRes ) {

											                     if ( saveErr ) {
												                     console.log (
														                     "Save Drawing: Failed, DB Query failed!" );
												                     response.send ( 403, "failed" );
											                     } else {
												                     console.log ( "Save Drawing: Success!" );
												                     response.send ( 200, "ok" );
											                     }
										                     } );
									}
								} );
					} else {
						console.log ( "Save Drawing: Failed, User not signed in." );
						response.send ( 403, "redirect" );
					}
				} );

app.post ( "/get-random-drawing/", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Get Random Drawing: Failed, User not signed in." );
				response.send ( 403, "redirect" );
			} else {
				getRandomDrawing( function ( randErr, randRes ) {

					if ( randErr ) {
						console.log ( "Get Random Drawing: Failed, DB Query failed!" );
						response.send ( 403, "failed" );
					} else {
						console.log ( "Get Random Drawing: Success!" );
						response.send ( 200, {
							name:  randRes.result [ 0 ].name,
							date:  randRes.result [ 0 ].creationdate,
							owner: randRes.result [ 0 ].ownerid,
							data:  randRes.result [ 0 ].data
						} );
					}
				} );
			}
		} );
	} else {
		console.log ( "Get Random Drawing: Failed, User not signed in." );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/get-my-drawing/", function ( request, response ) {

	var drawingID = request.body.id;

	if ( request.session.authorized ) {
		if ( validator.isNumeric ( drawingID ) ) {
			findUserBySession( request.sessionID, function ( err, res ) {

				if ( err ) {
					console.log ( "Get Drawing: Failed, User not signed in." );
					response.send ( 403, "redirect" );
				} else {
					getUserDrawing( res.result [ 0 ].id, parseInt( drawingID ), function ( drawingErr, drawingRes,
					                                                                       index ) {

						if ( drawingErr ) {
							console.log ( "Get Drawing: Failed, DB Query failed!" );
							response.send ( 403, "failed" );
						} else {
							if ( validator.isNumeric ( index ) ) {
								console.log ( "Get Drawing: Success!" );
								response.send ( 200, {
									present: true,
									id:      drawingRes.result [ index ].id,
									name:    drawingRes.result [ index ].name,
									date:    drawingRes.result [ index ].creationdate,
									owner:   drawingRes.result [ index ].ownerid,
									data:    drawingRes.result [ index ].data,
									shared:  drawingRes.result [ index ].pubshare
								} );
							} else {
								console.log ( "Get Drawing: No Drawings found!" );
								response.send ( 200, {
									present: false
								} );
							}
						}
					} );
				}
			} );
		} else {
			console.log ( "Get Drawing: Failed, Input violation!" );
			response.send ( 403, "failed" );
		}
	} else {
		console.log ( "Get Drawing: Failed, User not signed in." );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/share-drawing-publicly/", function ( request, response ) {

	var imgData = request.body.data;
	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Share Drawing Publicly: Failed, User not signed in." );
				response.send ( 403, "redirect" );
			} else {
				var urlExtension = generateRandomCharString( 64 );
				addPublicDrawing( urlExtension, imgData, function ( drawingErr, drawingRes ) {

					if ( drawingErr ) {
						console.dir ( drawingErr );
						console.log ( "Share Drawing Publicly: Failed, DB Query failed!" );
						response.send ( 403, "failed" );
					} else {
						console.log ( "Share Drawing Publicly: Success!" );
						response.send ( 200, {
							url: "/public-drawing/" + drawingRes.result [ 0 ].url
						} );
					}
				} );
			}
		} );
	} else {
		console.log ( "Share Drawing Publicly: Failed, User not signed in." );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/delete-my-drawing/", function ( request, response ) {

	var drawingID = request.body.id;
	if ( request.session.authorized ) {
		if ( validator.isNumeric ( drawingID ) ) {
			findUserBySession( request.sessionID, function ( err, res ) {

				if ( err ) {
					console.log ( "Delete Drawing: Failed, User not signed in." );
					response.send ( 403, "redirect" );
				} else {
					removeDrawing( res.result [ 0 ].id, parseInt( drawingID ), function ( drawingErr, drawingRes ) {

						if ( drawingErr ) {
							console.log ( "Delete Drawing: Failed, DB Query error!" );
							response.send ( 403, "failed" );
						} else {
							console.log ( "Delete Drawing: Success!" );
							response.send ( 200, "ok" );
						}
					} );
				}
			} );
		} else {
			console.log ( "Delete Drawing: Failed, Input violation!" );
			response.send ( 403, "failed" );
		}
	} else {
		console.log ( "Delete Drawing: Failed, User not signed in." );
		response.send ( 403, "redirect" );
	}
} );

app.get ( "/activate/:dynemail/:dyncode", function ( request, response ) {

	var activationCode = request.params.dyncode, emailaddress = request.params.dynemail;
	activateUserAccount( emailaddress, activationCode, function ( err, res ) {

		if ( err ) {
			console.log ( "Error Activating user account: " + res );
			response.render ( "../base/index.html", {
				email:        "",
				key:          "",
				resValDialog: "activation-failed"
			} );
		} else {
			console.log ( "User activates their account with email address: " + emailaddress + "; and code: "
			              + activationCode );
			response.render ( "../base/index.html", {
				email:        "",
				key:          "",
				resValDialog: "activation-confirmed"
			} );
		}
	} );
} );

app.get ( "/reset-password-page/:dynemail/:dynkey", function ( request, response ) {

	var key = request.params.dynkey;
	email   = request.params.dynemail;
	if ( validator.isEmail ( email ) && validator.isLength ( key, 60, 66 ) ) {
		console.log ( "Rendered 'reset-password-page'." );
		response.render ( "../base/index.html", {
			email:        email,
			key:          key,
			resValDialog: "reset-password"
		} );
	} else {
		console.log ( "Failed to render 'reset-password-page': Input vialation!" );
		response.redirect ( "/" );
	}
} );

app.post ( "/resetpassword/", function ( request, response ) {

	var email = validator.trim ( request.body.emailAddress ).toLowerCase (), key = generateRandomCharString( 64 );
	if ( validator.isEmail ( email ) ) {
		setTempPassword( email, key, function ( err, res ) {

			if ( err ) {
				console.log ( "Error setting temp password: DB Query error" );
				response.send ( 403, "failed" );
			} else {
				app.mailer.send ( "reset-password", {
					to:      email,
					subject: "SVC: Reset Password",
					link:    "http://" + currentWebAddress + "/reset-password-page/" + email + "/" + key
				}, function ( err ) {

					if ( err ) {
						console.log ( err );
					}
				} );
				console.log ( "Email sent" );
				response.send ( 200, "ok" );
			}
		} );
	} else {
		console.log ( "Error setting temp password: Input vialation!" );
		response.send ( 403, "failed" );
	}
} );

app
		.post (
				"/setnewpassword/",
				function ( request, response ) {

					var email = validator.trim ( request.body.emailAddress )
							.toLowerCase (), newPass = request.body.password, key = request.body.key;
					if ( validator.isEmail ( email ) && validator.isLength ( newPass, 8, 32 )
							&& validator.isLength ( key, 60, 66 ) ) {
						resetPassword( email, key, passwordHash.generate ( newPass ), function ( err, res ) {

							if ( err ) {
								console.log ( "Failed setting new password: DB Query error " );
								response.send ( 403, "failed" );

							} else {
								console.log ( "Password reset" );
								response.send ( 200, "ok" );
							}
						} );
					} else {
						console.log ( "Failed setting new password: Input vialation" );
						response.send ( 403, "failed" );
					}
				} );

app
		.post (
				"/extend-friend-request/",
				function ( request, response ) {

					var email = validator.trim ( request.body.friendemail ).toLowerCase ();
					if ( request.session.authorized ) {
						findUserBySession(
								request.sessionID,
								function ( err, res ) {

									if ( err ) {
										console.log ( "Failed extending request: User not logged in!" );
										response.send ( 403, "redirect" );
									} else {
										if ( !( email === res.result [ 0 ].emailaddress ) ) {
											if ( validator.isEmail ( email ) ) {
												getUserByEmailAddress(
														email,
														function ( emailErr, emailRes ) {

															if ( emailErr || !( emailRes.rowcount === 1 ) ) {
																console
																		.log ( "Failed extending request: Cannot find user in database!" );
																response.send ( 403, "failed" );
															} else {
																addMessage(
																		"friend-request",
																		"Sent you a friend request",
																		res.result [ 0 ].id,
																		emailRes.result [ 0 ].id,
																		function ( MessErr, MessRes ) {

																			if ( MessErr ) {
																				console
																						.log (
																								"Failed extending request: Cannot insert into database!" );
																				response.send ( 403, "failed" );
																			} else {
																				console
																						.log ( "Success extending request to: "
																						       + email );
																				response.send ( 200, "ok" );
																			}
																		} );
															}
														} );
											} else {
												console.log ( "Failed extending request: Input vialation" );
												response.send ( 403, "failed" );
											}
										} else {
											console
													.log ( "Failed extending request: Cannot become friends with yourself!" );
											response.send ( 403, "failed" );
										}
									}
								} );
					} else {
						console.log ( "Failed extending request: User not logged in!" );
						response.send ( 403, "redirect" );
					}
				} );

app.post ( "/friend-request-response/", function ( request, response ) {

	var messageID = request.body.id, email = request.body.email, accept = request.body.accept;
	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Setting friend response: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				if ( validator.isNumeric ( messageID ) && validator.isEmail ( email ) ) {
					if ( res.result [ 0 ].id ) {
						if ( accept ) {
							setFriendResponse( email, res.result [ 0 ].id, function ( resErr, responseRes ) {

								if ( resErr ) {
									console.log ( "Setting friend response: Failed, DB query failed!" );
									response.send ( 403, "failed" );
								} else {
									console.log ( "Setting friend response: Accept - Successful!" );
									response.send ( 200, "ok" );
								}
							} );
						} else {
							console.log ( "Setting friend response: Decline - Successful!" );
							response.send ( 200, "ok" );
						}
					} else {
						console.log ( "Setting friend response: Failed, User ID not defined!" );
						response.send ( 403, "failed" );
					}
				} else {
					console.log ( "Setting friend response, Input Violation!" );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Setting friend response: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/get-friends-list/", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Get friends list: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				if ( res.result [ 0 ].id ) {
					getAllFriends( res.result [ 0 ].id, function ( friendErr, friendRes ) {

						if ( friendErr ) {
							console.log ( "Get friends list: Failed, DB query failed!" );
							response.send ( 403, "failed" );
						} else {
							console.log ( "Get friends list: Successful!" );
							response.send ( 200, friendRes.result );
						}
					} );
				} else {
					console.log ( "Get friends list: Failed, User ID not defined!" );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Get friends list: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/send-message-to-friend/", function ( request, response ) {

	var friendsID = request.body.friendID, message = request.body.message;
	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Send Message: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				if ( validator.isNumeric ( friendsID ) && validator.isLength ( message, 0, 2000 ) ) {
					if ( res.result [ 0 ].id ) {
						addMessage( "message", message, res.result [ 0 ].id, friendsID, function ( messErr, messRes ) {

							if ( messErr ) {
								console.log ( "Send Message: Failed, DB query failed!" );
								response.send ( 403, "failed" );
							} else {
								console.log ( "Send Message: Successful!" );
								response.send ( 200, "ok" );
							}
						} );
					} else {
						console.log ( "Send Message: Failed, User ID not defined!" );
						response.send ( 403, "failed" );
					}
				} else {
					console.log ( "Send Message: Failed, Input vialation" );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Send Message: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/get-updates/", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err || !( res.rowcount === 1 ) ) {
				console.log ( "Get Updates: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				if ( res.result [ 0 ].id ) {
					getAllUpdates( res.result [ 0 ].id, function ( updatesErr, updatesRes ) {

						if ( updatesErr ) {
							console.log ( "Get Updates: Failed, DB query failed!" );
							response.send ( 403, "failed" );
						} else {
							console.log ( "Get Updates: Successful!" );
							response.send ( 200, updatesRes.result );
						}
					} );
				} else {
					console.log ( "Get Updates: Failed, User ID not defined!" );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Get Updates: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/get-my-session-id/", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "User requested Session ID: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				console.log ( "User requested Session ID: Successful!" );
				response.send ( 200, {
					session: request.sessionID
				} );
			}
		} );
	} else {
		console.log ( "User requested Session ID: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/updates-set-seen/", function ( request, response ) {

	var messageID = request.body.id, email = request.body.email;
	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Set seen: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				if ( validator.isNumeric ( messageID ) && validator.isEmail ( email ) ) {
					if ( res.result [ 0 ].id ) {
						setMessageSeen( messageID, email, res.result [ 0 ].id, function ( messErr, messRes ) {

							if ( messErr ) {
								console.log ( "Set seen: Failed, DB query failed!" );
								response.send ( 403, "failed" );
							} else {
								console.log ( "Set seen: Successful!" );
								response.send ( 200, "ok" );
							}
						} );
					} else {
						console.log ( "Set seen: Failed, User ID not defined!" );
						response.send ( 403, "failed" );
					}
				} else {
					console.log ( "Set seen: Failed, Input Violation!" );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Set seen: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/start-group-session/", function ( request, response ) {

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Start Group Session: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				var groupSessionID   = generateRandomCharString( 32 );
				var tempGroupSession = new groupSessions();
				tempGroupSession.init ( groupSessionID );
				currentGroupSessions.push ( tempGroupSession );
				console.log ( "Group Session Started by: " + res.result [ 0 ].fname + " " + res.result [ 0 ].lname );
				response.send ( 200, groupSessionID );
			}
		} );
	} else {
		console.log ( "Start Group Session: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/invite-friend-to-group/", function ( request, response ) {

	var friendsID = request.body.friendID, groupSession = request.body.groupSession;
	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Invite friend to Group: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				if ( validator.isNumeric ( friendsID ) && validator.isLength ( groupSession, 31, 33 ) ) {
					if ( res.result [ 0 ].id ) {
						if ( isValidGroupSession( groupSession ) ) {
							addMessage( "groupinvite", groupSession, res.result [ 0 ].id, friendsID,
							            function ( messErr, messRes ) {

								            if ( messErr ) {
									            console.log ( "Invite friend to Group: Failed, DB query failed!" );
									            response.send ( 403, "failed" );
								            } else {
									            console.log ( "Invite friend to Group: Successful!" );
									            response.send ( 200, "ok" );
								            }
							            } );
						} else {
							console.log ( "Invite friend to Group: Failed, Not A valid Session!" );
							response.send ( 403, "failed" );
						}
					} else {
						console.log ( "Invite friend to Group: Failed, User ID not defined!" );
						response.send ( 403, "failed" );
					}
				} else {
					console.log ( "Invite friend to Group: Failed, Input vialation" );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Invite friend to Group: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/join-group-session/", function ( request, response ) {

	var session = request.body.groupSessionID;

	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Join Group Session: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				var index = getIndexOfGroupSession( session );
				if ( validator.isNumeric ( index ) ) {
					currentGroupSessions [ index ].addUser ( res.result [ 0 ].id, request.sessionID );
					console.log ( "Join Group Session: " + res.result [ 0 ].fname + " " + res.result [ 0 ].lname );
					response.send ( 200, "ok" );
				} else {
					console.log ( "Join Group Session: Failed, Not a valid group session!" );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Join Group Session: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}
} );

app.post ( "/leave-group-session/", function ( request, response ) {

	var session = request.body.session;
	if ( request.session.authorized ) {
		findUserBySession( request.sessionID, function ( err, res ) {

			if ( err ) {
				console.log ( "Leave Group Session: Failed, Not logged in!" );
				response.send ( 403, "redirect" );
			} else {
				var index = getIndexOfGroupSession( session );
				if ( validator.isNumeric ( index ) ) {

					currentGroupSessions [ index ].removeUser ( res.result [ 0 ].id );
					checkToRemoveSession( session );

					console.log ( "Leave Group Session: " + res.result [ 0 ].fname + " " + res.result [ 0 ].lname
					              + ", Succsessfully left." );
					response.send ( 200, "ok" );

				} else {
					console.log ( "Leave Group Session: Failed, Not a valid group session!" );
					response.send ( 403, "failed" );
				}
			}
		} );
	} else {
		console.log ( "Leave Group Session: Failed, Not logged in!" );
		response.send ( 403, "redirect" );
	}

} );

app.get ( "/print-sessions/", function ( request, response ) {

	console.dir ( currentGroupSessions );
	response.send ( 200, "ok" );
} );

app.get ( "/ru3/", function ( request, response ) {

	removeSpecifiedUserData( 3, function ( err, res ) {

		if ( err ) {
			console.log ( "Remove User 3: Failed!" );
			console.dir ( err );
			response.send ( 200, "failed" );
		} else {
			console.log ( "Remove User 3: Success!" );
			response.send ( 200, "ok" );
		}

	} );
} );

app.get ( "/rrs/", function ( request, response ) {

	removeAllSessions( function ( err, res ) {

		if ( err ) {
			console.log ( "Remove Regular Sessions: Failed!" );
			console.dir ( err );
			response.send ( 200, "failed" );
		} else {
			console.log ( "Remove Regular Sessions: Success!" );
			response.send ( 200, "ok" );
		}

	} );
} );

app.listen ( REGULAR_PORT );

/***************************************************************************************************************************************************************
 * ** *** ** Database Queries *** ** *** ************************************************************************************
 */

var removeSpecifiedUserData = function ( userID, callback ) {

	var removeUserData = MSSQLClient.query ( "DELETE FROM drawings WHERE ownerid = @id;"
	                                         + "DELETE FROM friends WHERE uid = @id;" +
	                                         "DELETE FROM friends WHERE fid = @id;"
	                                         + "DELETE FROM messages WHERE sender = @id;" +
	                                         "DELETE FROM messages WHERE receiver = @id;"
	                                         + "DELETE FROM regularsessions WHERE userid = @id;" +
	                                         "DELETE FROM users WHERE id = @id;" );
	removeUserData.param ( "id", "Int", userID );
	removeUserData.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var findUserBySession = function ( sessionID, callback ) {

	var findUserWithSession = MSSQLClient
			.query (
					"SELECT users.id,users.fname,users.lname,users.emailaddress,users.dob,users.active FROM users INNER JOIN regularsessions ON users.id = regularsessions.userid WHERE sessionid = @session" );
	findUserWithSession.param ( "session", "VarChar", sessionID );
	findUserWithSession.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var removeSession = function ( sessionID, callback ) {

	var removeSess = MSSQLClient.query ( "DELETE FROM regularsessions WHERE sessionid = @session" );
	removeSess.param ( "session", "VarChar", sessionID );
	removeSess.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var removeAllSessions = function ( callback ) {

	var removeAllSess = MSSQLClient.query ( "DELETE FROM regularsessions" );
	removeAllSess.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var addSession = function ( sessionID, userID, callback ) {

	var getNewID = MSSQLClient.query ( "SELECT MAX(id) as id FROM regularsessions" );
	getNewID
			.exec ( function ( err, res ) {

				if ( err ) {
					callback( err, res );
				} else {
					var id         = res.result [ 0 ].id;
					var addSession = MSSQLClient
							.query (
									"IF EXISTS (SELECT * FROM regularsessions WHERE userid = @user) BEGIN select 'false' as value; END ELSE BEGIN insert into regularsessions(id,sessionid,userid) values(@id,@session,@user); select 'true' as value; END" );
					addSession.param ( "id", "Int", id + 1 );
					addSession.param ( "session", "VarChar", sessionID );
					addSession.param ( "user", "Int", userID );
					addSession.exec ( function ( err, res ) {

						if ( err || res.result [ 0 ].value === "false" ) {
							callback( true, res );
						} else {
							callback( false, res );
						}
					} );
				}
			} );
};

var setFriendResponse = function ( sendersEmail, receiversID, callback ) {

	getUserByEmailAddress(
			sendersEmail,
			function ( err, res ) {

				if ( err ) {
					callback( true, "" );
				} else {
					var sendersID   = res.result [ 0 ].id;
					var setMessSeen = MSSQLClient
							.query (
									"IF EXISTS (SELECT * FROM friends WHERE uid = @uid AND fid = @fid) BEGIN select 'true' as value; END ELSE BEGIN insert into friends(uid, fid) values(@uid,@fid); insert into friends(uid, fid) values(@fid,@uid); select 'true' as value; END" );
					setMessSeen.param ( "uid", "Int", sendersID );
					setMessSeen.param ( "fid", "Int", receiversID );
					setMessSeen.exec ( function ( err, res ) {

						callback( err, res );
					} );
					callback( false, "" );
				}
			} );
};

var setMessageSeen = function ( messageID, sendersEmail, receiversID, callback ) {

	getUserByEmailAddress( sendersEmail, function ( err, res ) {

		if ( err ) {
			callback( true, "" );
		} else {
			var sendersID   = res.result [ 0 ].id;
			var setMessSeen = MSSQLClient
					.query ( "UPDATE messages SET seen=@seen WHERE id=@id AND sender=@sender AND receiver=@receive;" );
			setMessSeen.param ( "id", "Int", messageID );
			setMessSeen.param ( "sender", "Int", sendersID );
			setMessSeen.param ( "receive", "Int", receiversID );
			setMessSeen.param ( "seen", "Bit", true );
			setMessSeen.exec ( function ( err, res ) {

				callback( err, res );
			} );
		}
	} );
};

var getAllUpdates = function ( id, callback ) {

	var getUpdates = MSSQLClient
			.query (
					"SELECT users.fname, users.lname, users.emailaddress, messages.id, messages.messagetype, messages.messagetext, messages.seen, messages.creationdate FROM users INNER JOIN messages ON users.id = messages.sender WHERE messages.receiver = @id ORDER BY id DESC" );
	getUpdates.param ( "id", "Int", id );
	getUpdates.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var getAllFriends = function ( id, callback ) {

	var getFriendIDs = MSSQLClient
			.query (
					"SELECT users.id,users.emailaddress,users.fname,users.lname FROM users INNER JOIN friends ON users.id = friends.fid WHERE friends.uid = @id" );
	getFriendIDs.param ( "id", "Int", id );
	getFriendIDs.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var addMessage = function ( type, text, sender, receiver, callback ) {

	var ensureIDsAreRegistered = MSSQLClient
			.query (
					"IF EXISTS (SELECT * FROM [dbo].[users] WHERE id = @idone) BEGIN IF EXISTS (SELECT * FROM [dbo].[users] WHERE id = @idtwo)	BEGIN select 'true' as value END ELSE BEGIN	select 'false' as value END END ELSE BEGIN select 'false' as value END" );
	ensureIDsAreRegistered.param ( "idone", "Int", sender );
	ensureIDsAreRegistered.param ( "idtwo", "Int", receiver );
	ensureIDsAreRegistered
			.exec ( function ( err, res ) {

				if ( res.result [ 0 ].value === "true" ) {
					var getNewID = MSSQLClient.query ( "SELECT MAX(id) as id FROM messages" );
					getNewID
							.exec ( function ( err, res ) {

								if ( err ) {
									callback( err, res );
								} else {
									var id = res.result [ 0 ].id;
									var addMess = MSSQLClient
											.query (
													"insert into messages(id,seen,messagetype,creationdate,messagetext,sender,receiver)"
													+ "values(@id,@seen,@type,GETDATE(),@text,@sender,@receiver);" );
									addMess.param ( "id", "Int", id + 1 );
									addMess.param ( "seen", "Bit", false );
									addMess.param ( "type", "VarChar", type );
									addMess.param ( "text", "VarChar", text );
									addMess.param ( "sender", "Int", sender );
									addMess.param ( "receiver", "Int", receiver );
									addMess.exec ( function ( err, res ) {

										callback( err, res );
									} );
								}
							} );
				} else {
					callback( true, res );
				}
			} );
};

var resetPassword = function ( email, key, password, callback ) {

	var getID = MSSQLClient.query ( "SELECT id FROM users WHERE emailaddress=@emailadd AND password=@keyval;" );
	getID.param ( "emailadd", "VarChar", email.toLowerCase () );
	getID.param ( "keyval", "VarChar", key );
	getID.exec ( function ( err, res ) {

		if ( !( err ) && ( res.rowcount === 1 ) ) {
			if ( validator.isNumeric ( res.result [ 0 ].id ) ) {
				var updatePassword = MSSQLClient.query ( "UPDATE users SET password=@pass WHERE id=@id;" );
				updatePassword.param ( "id", "VarChar", res.result [ 0 ].id );
				updatePassword.param ( "pass", "VarChar", password );
				updatePassword.exec ( function ( err, res ) {

					callback( err, res );
				} );
			} else {
				callback( true, res );
			}
		} else {
			callback( true, res );
		}
	} );
};

var setTempPassword = function ( email, tempPass, callback ) {

	getUserByEmailAddress( email, function ( err, res ) {

		if ( res.rowcount === 1 ) {
			var query = MSSQLClient.query ( "UPDATE users SET password=@pass WHERE emailaddress=@email;" );
			query.param ( "email", "VarChar", email.toLowerCase () );
			query.param ( "pass", "VarChar", tempPass );
			query.exec ( function ( err, res ) {

				callback( err, res );
			} );
		} else {
			callback( true, res );
		}
	} );
};

var getUserByID = function ( id, callback ) {

	var query = MSSQLClient.query ( "SELECT id, fname, lname, emailaddress, dob, password FROM users WHERE id = @id" );
	query.param ( "id", "Int", id );
	query.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var getUserByEmailAddress = function ( emailAddress, callback ) {

	var query = MSSQLClient
			.query (
					"SELECT id, fname, lname, emailaddress, dob, password, active, activatationkey FROM users WHERE emailaddress = @email" );
	query.param ( "email", "VarChar", emailAddress.toLowerCase () );
	query.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var activateUserAccount = function ( emailAddress, key, callback ) {

	getUserByEmailAddress( emailAddress, function ( err, res ) {

		if ( err ) {
			callback( err, res );
			console.log ( "Error activating User Account: " + err );
		} else if ( !( res.result [ 0 ].active ) && ( res.result [ 0 ].activatationkey === key ) ) {

			var query = MSSQLClient.query ( "UPDATE users SET active=@active WHERE emailaddress=@email;" );
			query.param ( "email", "VarChar", emailAddress.toLowerCase () );
			query.param ( "active", "Bit", true );
			query.exec ( function ( err, res ) {

				callback( err, res );
			} );
		}
	} );
};

var addUser = function ( fName, lName, emailAddress, dob, password, key, callback ) {

	var addingUser = MSSQLClient
			.query (
					"IF EXISTS (SELECT id FROM users WHERE emailaddress=@email) BEGIN select 'false' as value; END ELSE BEGIN insert into users(id,fname,lname,emailaddress,dob,active,activatationkey, password) values((SELECT MAX(id) FROM users)+1,@fname,@lname,@email,@dob,@active,@actkey,@pass); select 'true' as value; END" );
	addingUser.param ( "fname", "VarChar", fName );
	addingUser.param ( "lname", "VarChar", lName );
	addingUser.param ( "email", "VarChar", emailAddress.toLowerCase () );
	addingUser.param ( "dob", "DateTime", dob );
	addingUser.param ( "active", "Bit", false );
	addingUser.param ( "actkey", "VarChar", key );
	addingUser.param ( "pass", "VarChar", password );
	addingUser.exec ( function ( err, res ) {

		if ( err || res.result [ 0 ].value === "false" ) {
			callback( true, res );
		} else {
			callback( false, res );
		}
	} );
};

var saveNewDrawing = function ( name, data, publiclyshared, ownerID, callback ) {

	var addingDrawing = MSSQLClient.query ( "insert into drawings(id,name,creationdate,data,pubshare,ownerid) "
	                                        +
	                                        "values((SELECT MAX(id) FROM drawings)+1,@name,GETDATE(),@data,@shared,@ownerID);"
	                                        + "(SELECT MAX(id) as id FROM drawings)" );
	addingDrawing.param ( "name", "VarChar", name );
	addingDrawing.param ( "data", "VarChar", data );
	addingDrawing.param ( "shared", "Bit", publiclyshared );
	addingDrawing.param ( "ownerID", "Int", ownerID );
	addingDrawing.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var saveExistingDrawing = function ( name, data, id, publiclyshared, ownerID, callback ) {

	var addingDrawing = MSSQLClient
			.query (
					"IF EXISTS (SELECT * FROM drawings WHERE id = @id) BEGIN UPDATE drawings SET data=@data, pubshare=@shared WHERE id = @id; select 'true' as value; END ELSE BEGIN insert into drawings(id,name,creationdate,data,pubshare,ownerid) values((SELECT MAX(id) FROM drawings)+1,@name,GETDATE(),@data,@shared,@ownerID); select 'true' as value; END" );
	addingDrawing.param ( "id", "Int", id );
	addingDrawing.param ( "name", "VarChar", name );
	addingDrawing.param ( "data", "VarChar", data );
	addingDrawing.param ( "shared", "Bit", publiclyshared );
	addingDrawing.param ( "ownerID", "Int", ownerID );
	addingDrawing.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var getUserDrawing = function ( id, drawingID, callback ) {

	var numberOfDrawings = MSSQLClient
			.query ( "SELECT id,name,creationdate,data,pubshare,ownerid FROM drawings WHERE ownerid=@id;" );
	numberOfDrawings.param ( "id", "Int", id );
	numberOfDrawings.exec ( function ( err, res ) {

		var length = res.result.length;
		var index  = Math.abs ( drawingID ) % Math.abs ( length );
		callback( err, res, index );
	} );
};

var removeDrawing = function ( id, drawingID, callback ) {

	var numberOfDrawings = MSSQLClient.query ( "DELETE FROM drawings WHERE ownerid=@id AND id=@did;" );
	numberOfDrawings.param ( "id", "Int", id );
	numberOfDrawings.param ( "did", "Int", drawingID );
	numberOfDrawings.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var getRandomDrawing = function ( callback ) {

	var getPublicIDs = MSSQLClient.query ( "SELECT id FROM drawings WHERE pubshare=1;" );
	getPublicIDs.exec ( function ( err, res ) {

		var length         = res.result.length;
		var index          = Math.floor ( Math.random () * ( ( length - 1 ) - 0 + 1 ) + 0 );
		var id             = res.result [ index ].id;
		var getDrawingData = MSSQLClient
				.query ( "SELECT id,name,creationdate,data,pubshare,ownerid FROM drawings WHERE id=@id" );
		getDrawingData.param ( "id", "Int", id );
		getDrawingData.exec ( function ( err, res ) {

			callback( err, res );
		} );
	} );
};

var addPublicDrawing = function ( url, data, callback ) {

	var addingDrawing = MSSQLClient
			.query (
					"IF EXISTS (SELECT * FROM publicdrawing WHERE data = @data) BEGIN SELECT url FROM publicdrawing WHERE data = @data; END ELSE BEGIN INSERT INTO publicdrawing(id,url,data) VALUES((SELECT MAX(id) FROM publicdrawing)+1,@url,@data); SELECT url FROM publicdrawing WHERE data = @data; END" );
	addingDrawing.param ( "url", "VarChar", url );
	addingDrawing.param ( "data", "VarChar", data );
	addingDrawing.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

var loadPublicImg = function ( url, callback ) {

	var getPublicDrawing = MSSQLClient.query ( "SELECT data FROM publicdrawing WHERE url=@url;" );
	getPublicDrawing.param ( "url", "VarChar", url );
	getPublicDrawing.exec ( function ( err, res ) {

		callback( err, res );
	} );
};

/***************************************************************************************************************************************************************
 * ** *** ** Helper Function *** ** *** ************************************************************************************
 */

var generateRandomCharString = function ( len ) {

	var charSet      = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var randomString = "";

	for ( var i = 0; i < len; i++ ) {

		var randomPoz = Math.floor ( Math.random () * charSet.length );
		randomString += charSet.substring ( randomPoz, randomPoz + 1 );
	}

	return randomString;
};

removeAllSessions( function ( err, res ) {

} );

var groupSessions = function () {

	this.sessionID;
	this.users;

	this.init = function ( sessID ) {

		this.sessionID = sessID;
		this.users     = new Array();
	};

	this.addUser = function ( memberID, memberSession, memberSocket ) {

		var newUser = new userObject();
		newUser.init ( memberID, memberSession, memberSocket );
		this.users.push ( newUser );
	};

	this.getOtherMembers = function ( sessionID ) {

		var socketList = new Array();
		for ( var i = 0; i < this.users.length; i++ ) {
			if ( !( this.users [ i ].session === sessionID ) ) {
				socketList.push ( this.users [ i ].socketConnection );
			}
		}
		return socketList;
	};

	this.removeUser = function ( memberID ) {

		var idIndex = -1;
		for ( var i = 0; i < this.users.length; i++ ) {
			if ( this.users [ i ].ID === memberID ) {
				idIndex = i;
			}
		}
		if ( idIndex > -1 ) {
			this.users.splice ( idIndex, 1 );
		}
	};
};

var userObject = function () {

	this.ID;
	this.session;
	this.socketConnection;

	this.init = function ( id, session, socket ) {

		this.ID               = id;
		this.session          = session;
		this.socketConnection = socket;
	};
};

var checkToRemoveSession = function ( sessionID ) {

	var index = getIndexOfGroupSession( sessionID );

	if ( validator.isNumeric ( index ) ) {

		if ( currentGroupSessions [ index ].users.length === 0 ) {
			currentGroupSessions.splice ( index, 1 );
			console.log ( "Closing group session: None left in it." );
		}
	}
};

var isValidGroupSession = function ( sessionID ) {

	var found = false;

	for ( var i = 0; i < currentGroupSessions.length; i++ ) {

		if ( currentGroupSessions [ i ].sessionID === sessionID ) {
			found = true;
		}
	}

	return found;
};

var getIndexOfGroupSession = function ( sessionID ) {

	var index = false;

	for ( var i = 0; i < currentGroupSessions.length; i++ ) {

		if ( currentGroupSessions [ i ].sessionID === sessionID ) {
			index = i;
		}
	}

	return index;
};
