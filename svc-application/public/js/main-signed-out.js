var allowRegistration = true;

$ ( document )
        .ready (
                function( ) {

	                $ ( "#banner_logo-img" ).click ( function( ) {

		                location.reload ( false );
	                } );
	                $ ( "#banner_title" ).click ( function( ) {

		                location.reload ( false );
	                } );

	                $ ( "#replaceable-small" ).fadeTo ( 400, 0.0, function( ) {

		                $ ( "#replaceable-small" ).load ( "/html/sign-in.html", function( ) {

			                $ ( "#sign-in_register-button" ).click ( function( ) {

				                loadRegister ( );
			                } );
			                $ ( "#sign-in_sign-in-button" ).click ( function( ) {

				                signIn ( );
			                } );
			                $ ( "#sign-in_forgot-password" ).click ( function( ) {

				                forgottenPassword ( );
			                } );
		                } );
		                setTimeout ( function( ) {

			                $ ( "#replaceable-small" ).fadeTo ( 400, 1.0 );
		                }, 400 );
	                } );

	                setTimeout (
	                        function( ) {

		                        if ( $ ( "#dialog-to-open" ).html ( ) === "activation-confirmed" ) {

			                        $ ( ".dialog-window" ).html ( $ ( "#dialog-window-registration-active" ).html ( ) );
			                        $ ( ".dialog-window" ).css ( "visibility", "visible" );
			                        $ ( ".dialog-window" ).css ( "opacity", "0" );
			                        $ ( ".dialog-window" ).fadeTo ( 400, 1.0 );
			                        $ ( ".dialog-window-backdrop" ).click ( function( ) {

				                        $ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				                        setTimeout ( function( ) {

					                        $ ( ".dialog-window" ).css ( "visibility", "hidden" );
				                        }, 400 );
			                        } );
			                        $ ( ".dialog-window-top-exit" ).click ( function( ) {

				                        $ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				                        setTimeout ( function( ) {

					                        $ ( ".dialog-window" ).css ( "visibility", "hidden" );
				                        }, 400 );
			                        } );
			                        $ ( "#dialog-window-close-button" ).click ( function( ) {

				                        $ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				                        setTimeout ( function( ) {

					                        $ ( ".dialog-window" ).css ( "visibility", "hidden" );
				                        }, 400 );
			                        } );
		                        }else if ( $ ( "#dialog-to-open" ).html ( ) === "activation-failed" ) {

			                        $ ( ".dialog-window" ).html (
			                                $ ( "#dialog-window-registration-active-failed" ).html ( ) );
			                        $ ( ".dialog-window" ).css ( "visibility", "visible" );
			                        $ ( ".dialog-window" ).css ( "opacity", "0" );
			                        $ ( ".dialog-window" ).fadeTo ( 400, 1.0 );
			                        $ ( ".dialog-window-backdrop" ).click ( function( ) {

				                        $ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				                        setTimeout ( function( ) {

					                        $ ( ".dialog-window" ).css ( "visibility", "hidden" );
				                        }, 400 );
			                        } );
			                        $ ( ".dialog-window-top-exit" ).click ( function( ) {

				                        $ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				                        setTimeout ( function( ) {

					                        $ ( ".dialog-window" ).css ( "visibility", "hidden" );
				                        }, 400 );
			                        } );
			                        $ ( "#dialog-window-close-button" ).click ( function( ) {

				                        $ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				                        setTimeout ( function( ) {

					                        $ ( ".dialog-window" ).css ( "visibility", "hidden" );
				                        }, 400 );
			                        } );
		                        }else if ( $ ( "#dialog-to-open" ).html ( ) === "reset-password" ) {

			                        $ ( ".dialog-window" ).html (
			                                $ ( "#dialog-window-reset-password-original" ).html ( ) );
			                        $ ( ".dialog-window" ).css ( "visibility", "visible" );
			                        $ ( ".dialog-window" ).css ( "opacity", "0" );
			                        $ ( ".dialog-window" ).fadeTo ( 400, 1.0 );
			                        $ ( "#dialog-window-submit-button" )
			                                .click (
			                                        function( ) {

				                                        var email = $ ( "#emailaddress" ) [ 0 ].innerHTML, keyval = $ ( "#key" ) [ 0 ].innerHTML;

				                                        if ( ( $ ( "#newPassword" ).val ( ) === $ ( "#cPassword" )
				                                                .val ( ) )
				                                                && ( $.trim ( $ ( "#newPassword" ).val ( ).length ) > 7 ) ) {

					                                        $
					                                                .post ( "/setnewpassword/", {
					                                                    password: $ ( "#newPassword" ).val ( ),
					                                                    key: keyval,
					                                                    emailAddress: email
					                                                } )
					                                                .done (
					                                                        function( ) {

						                                                        $ ( ".dialog-window" )
						                                                                .html (
						                                                                        $ (
						                                                                                "#dialog-window-reset-password-success" )
						                                                                                .html ( ) );
						                                                        $ ( ".dialog-window" ).css (
						                                                                "visibility", "visible" );
						                                                        $ ( ".dialog-window" ).css ( "opacity",
						                                                                "0" );
						                                                        $ ( ".dialog-window" ).fadeTo ( 400,
						                                                                1.0 );
						                                                        $ ( ".dialog-window-backdrop" )
						                                                                .click (
						                                                                        function( ) {

							                                                                        $ (
							                                                                                ".dialog-window" )
							                                                                                .fadeTo (
							                                                                                        400,
							                                                                                        0.0 );
							                                                                        setTimeout (
							                                                                                function( ) {

								                                                                                $ (
								                                                                                        ".dialog-window" )
								                                                                                        .css (
								                                                                                                "visibility",
								                                                                                                "hidden" );
							                                                                                }, 400 );
						                                                                        } );
						                                                        $ ( ".dialog-window-top-exit" )
						                                                                .click (
						                                                                        function( ) {

							                                                                        $ (
							                                                                                ".dialog-window" )
							                                                                                .fadeTo (
							                                                                                        400,
							                                                                                        0.0 );
							                                                                        setTimeout (
							                                                                                function( ) {

								                                                                                $ (
								                                                                                        ".dialog-window" )
								                                                                                        .css (
								                                                                                                "visibility",
								                                                                                                "hidden" );
							                                                                                }, 400 );
						                                                                        } );
						                                                        $ ( "#dialog-window-close-button" )
						                                                                .click (
						                                                                        function( ) {

							                                                                        $ (
							                                                                                ".dialog-window" )
							                                                                                .fadeTo (
							                                                                                        400,
							                                                                                        0.0 );
							                                                                        setTimeout (
							                                                                                function( ) {

								                                                                                $ (
								                                                                                        ".dialog-window" )
								                                                                                        .css (
								                                                                                                "visibility",
								                                                                                                "hidden" );
							                                                                                }, 400 );
						                                                                        } );
					                                                        } )
					                                                .fail (
					                                                        function( ) {

						                                                        $ ( ".dialog-window" )
						                                                                .html (
						                                                                        $ (
						                                                                                "#dialog-window-reset-password-failed" )
						                                                                                .html ( ) );
						                                                        $ ( ".dialog-window" ).css (
						                                                                "visibility", "visible" );
						                                                        $ ( ".dialog-window" ).css ( "opacity",
						                                                                "0" );
						                                                        $ ( ".dialog-window" ).fadeTo ( 400,
						                                                                1.0 );
						                                                        $ ( ".dialog-window-backdrop" )
						                                                                .click (
						                                                                        function( ) {

							                                                                        $ (
							                                                                                ".dialog-window" )
							                                                                                .fadeTo (
							                                                                                        400,
							                                                                                        0.0 );
							                                                                        setTimeout (
							                                                                                function( ) {

								                                                                                $ (
								                                                                                        ".dialog-window" )
								                                                                                        .css (
								                                                                                                "visibility",
								                                                                                                "hidden" );
							                                                                                }, 400 );
						                                                                        } );
						                                                        $ ( ".dialog-window-top-exit" )
						                                                                .click (
						                                                                        function( ) {

							                                                                        $ (
							                                                                                ".dialog-window" )
							                                                                                .fadeTo (
							                                                                                        400,
							                                                                                        0.0 );
							                                                                        setTimeout (
							                                                                                function( ) {

								                                                                                $ (
								                                                                                        ".dialog-window" )
								                                                                                        .css (
								                                                                                                "visibility",
								                                                                                                "hidden" );
							                                                                                }, 400 );
						                                                                        } );
						                                                        $ ( "#dialog-window-close-button" )
						                                                                .click (
						                                                                        function( ) {

							                                                                        $ (
							                                                                                ".dialog-window" )
							                                                                                .fadeTo (
							                                                                                        400,
							                                                                                        0.0 );
							                                                                        setTimeout (
							                                                                                function( ) {

								                                                                                $ (
								                                                                                        ".dialog-window" )
								                                                                                        .css (
								                                                                                                "visibility",
								                                                                                                "hidden" );
							                                                                                }, 400 );
						                                                                        } );
					                                                        } );
				                                        }else {

					                                        $ ( "#newPassword" ).effect ( "highlight", {
						                                        color: "rgba(255,0,0,0.1);"
					                                        }, 500 );
					                                        $ ( "#cPassword" ).effect ( "highlight", {
						                                        color: "rgba(255,0,0,0.1);"
					                                        }, 500 );
				                                        }
			                                        } );
		                        }
	                        }, 600 );
                } );

var loadRegister = function( ) {

	$ ( "#replaceable-small" ).fadeTo ( 400, 0.0, function( ) {

		$ ( "#replaceable-small" ).load ( "html/register.html", function( ) {

			allowRegistration = true;
			$ ( "#register_sign-up-button" ).click ( function( ) {

				if ( allowRegistration ) {
					allowRegistration = false;
					signUp ( );
				}
			} );
			$ ( "#register_cancel-button" ).click ( function( ) {

				$ ( "#replaceable-small" ).fadeTo ( 400, 0.0, function( ) {

					$ ( "#replaceable-small" ).load ( "/html/sign-in.html", function( ) {

						$ ( "#sign-in_register-button" ).click ( function( ) {

							loadRegister ( );
						} );
						$ ( "#sign-in_sign-in-button" ).click ( function( ) {

							signIn ( );
						} );
						$ ( "#sign-in_forgot-password" ).click ( function( ) {

							forgottenPassword ( );
						} );
					} );
					setTimeout ( function( ) {

						$ ( "#replaceable-small" ).fadeTo ( 400, 1.0 );
					}, 400 );
				} );
			} );
		} );
		setTimeout ( function( ) {

			$ ( "#replaceable-small" ).fadeTo ( 400, 1.0 );
		}, 400 );
	} );
};

var forgottenPassword = function( ) {

	$ ( ".dialog-window" ).html ( $ ( "#dialog-window-html-original" ).html ( ) );
	$ ( ".dialog-window" ).css ( "visibility", "visible" );
	$ ( ".dialog-window" ).css ( "opacity", "0" );
	$ ( ".dialog-window" ).fadeTo ( 400, 1.0 );
	$ ( ".dialog-window-backdrop" ).click ( function( ) {

		$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
		setTimeout ( function( ) {

			$ ( ".dialog-window" ).css ( "visibility", "hidden" );
		}, 400 );
	} );
	$ ( ".dialog-window-top-exit" ).click ( function( ) {

		$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
		setTimeout ( function( ) {

			$ ( ".dialog-window" ).css ( "visibility", "hidden" );
		}, 400 );
	} );
	$ ( "#dialog-window-close-button" ).click ( function( ) {

		$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
		setTimeout ( function( ) {

			$ ( ".dialog-window" ).css ( "visibility", "hidden" );
		}, 400 );
	} );
	$ ( "#dialog-window-submit-button" ).click ( function( ) {

		if ( isValidEmailAddress ( $.trim ( $ ( "#reset-pass-emailAddress" ).val ( ) ) ) ) {
			$.post ( "/resetpassword/", {
				emailAddress: $ ( "#reset-pass-emailAddress" ).val ( )
			} ).done ( function( ) {

				$ ( ".dialog-window" ).html ( $ ( "#dialog-window-html-success" ).html ( ) );
				$ ( ".dialog-window-top-exit" ).click ( function( ) {

					$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
					setTimeout ( function( ) {

						$ ( ".dialog-window" ).css ( "visibility", "hidden" );
					}, 400 );
				} );
				$ ( "#dialog-window-close-button" ).click ( function( ) {

					$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
					setTimeout ( function( ) {

						$ ( ".dialog-window" ).css ( "visibility", "hidden" );
					}, 400 );
				} );
				$ ( ".dialog-window-backdrop" ).click ( function( ) {

					$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
					setTimeout ( function( ) {

						$ ( ".dialog-window" ).css ( "visibility", "hidden" );
					}, 400 );
				} );
			} ).fail ( function( ) {

				$ ( ".dialog-window" ).html ( $ ( "#dialog-window-html-failure" ).html ( ) );
				$ ( ".dialog-window-top-exit" ).click ( function( ) {

					$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
					setTimeout ( function( ) {

						$ ( ".dialog-window" ).css ( "visibility", "hidden" );
					}, 400 );
				} );
				$ ( "#dialog-window-close-button" ).click ( function( ) {

					$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
					setTimeout ( function( ) {

						$ ( ".dialog-window" ).css ( "visibility", "hidden" );
					}, 400 );
				} );
				$ ( ".dialog-window-backdrop" ).click ( function( ) {

					$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
					setTimeout ( function( ) {

						$ ( ".dialog-window" ).css ( "visibility", "hidden" );
					}, 400 );
				} );
			} );
		}else {
			$ ( "#reset-pass-emailAddress" ).effect ( "highlight", {
				color: "#FF0000"
			}, 500 );
		}
	} );
};

var signIn = function( ) {

	$.post ( "/sign-in/", {
	    emailAddress: $ ( "#emailAddress" ).val ( ),
	    password: $ ( "#password" ).val ( )
	} ).done ( function( ) {

		$ ( "#replaceable-small" ).fadeTo ( 400, 0.0, function( ) {

			location = "/";
		} );

	} ).fail ( function( ) {

		$ ( "#sign-in-table_failed-text" ).css ( "visibility", "visible" );
		$ ( "#sign-in-table_failed-text" ).effect ( "highlight", {
			color: "#FF0000"
		}, 500 );
	} );
};

var signUp = function( ) {

	var proceed = true;

	if ( !( $.trim ( $ ( "#fName" ).val ( ).length ) > 0 ) ) {
		$ ( "#fName" ).effect ( "highlight", {
			color: "rgba(255,0,0,0.1);"
		}, 500 );
		proceed = false;
	}

	if ( !( $.trim ( $ ( "#lName" ).val ( ).length ) > 0 ) ) {
		$ ( "#lName" ).effect ( "highlight", {
			color: "rgba(255,0,0,0.1);"
		}, 500 );
		proceed = false;
	}

	if ( !isValidEmailAddress ( $.trim ( $ ( "#eAddress" ).val ( ) ) ) ) {
		$ ( "#eAddress" ).effect ( "highlight", {
			color: "rgba(255,0,0,0.1);"
		}, 500 );
		proceed = false;
	}

	if ( !$.isNumeric ( new Date ( $ ( "#DOB" ).val ( ) ).getTime ( ) ) ) {
		$ ( "#DOB" ).effect ( "highlight", {
			color: "rgba(255,0,0,0.1);"
		}, 500 );
		proceed = false;
	}

	if ( !( $ ( "#oPassword" ).val ( ) === $ ( "#cPassword" ).val ( ) )
	        || !( $.trim ( $ ( "#oPassword" ).val ( ).length ) > 7 ) ) {
		$ ( "#oPassword" ).effect ( "highlight", {
			color: "rgba(255,0,0,0.1);"
		}, 500 );
		$ ( "#cPassword" ).effect ( "highlight", {
			color: "rgba(255,0,0,0.1);"
		}, 500 );
		proceed = false;
	}

	if ( proceed ) {
		$.post ( "/register/", {
		    fName: $ ( "#fName" ).val ( ),
		    lName: $ ( "#lName" ).val ( ),
		    eAddress: $ ( "#eAddress" ).val ( ),
		    DOB: $ ( "#DOB" ).val ( ),
		    Password: $ ( "#oPassword" ).val ( )
		} ).done ( function( ) {

			$ ( ".dialog-window" ).html ( $ ( "#dialog-window-registration-success" ).html ( ) );
			$ ( ".dialog-window" ).css ( "visibility", "visible" );
			$ ( ".dialog-window" ).css ( "opacity", "0" );
			$ ( ".dialog-window" ).fadeTo ( 400, 1.0 );
			$ ( ".dialog-window-backdrop" ).click ( function( ) {

				$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				setTimeout ( function( ) {

					$ ( ".dialog-window" ).css ( "visibility", "hidden" );
				}, 400 );
			} );
			$ ( ".dialog-window-top-exit" ).click ( function( ) {

				$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				setTimeout ( function( ) {

					$ ( ".dialog-window" ).css ( "visibility", "hidden" );
				}, 400 );
			} );
			$ ( "#dialog-window-close-button" ).click ( function( ) {

				$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
				setTimeout ( function( ) {

					$ ( ".dialog-window" ).css ( "visibility", "hidden" );
				}, 400 );
			} );
			$ ( "#replaceable-small" ).fadeTo ( 400, 0.0, function( ) {

				$ ( "#replaceable-small" ).load ( "/html/sign-in.html", function( ) {

					$ ( "#sign-in_register-button" ).click ( function( ) {

						loadRegister ( );
					} );
					$ ( "#sign-in_sign-in-button" ).click ( function( ) {

						signIn ( );
					} );
					$ ( "#sign-in_forgot-password" ).click ( function( ) {

						forgottenPassword ( );
					} );
				} );
				setTimeout ( function( ) {

					$ ( "#replaceable-small" ).fadeTo ( 400, 1.0 );
				}, 400 );
			} );
		} ).fail ( function( ) {

			allowRegistration = true;
			$ ( "#register-table_failed-text" ).css ( 'visibility', 'visible' );
			$ ( "#register-table_failed-text" ).effect ( "highlight", {
				color: "rgba(255,0,0,0.75);"
			}, 500 );
		} );
	}else {
		allowRegistration = true;
	}
};

var isValidEmailAddress = function( emailAddress ) {

	var pattern = new RegExp (
	        /^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i );
	return pattern.test ( emailAddress );
};
