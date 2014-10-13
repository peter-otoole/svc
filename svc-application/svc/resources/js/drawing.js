var canvasHandle = "", phantomCanvasHandle = "", canContext = "", phantomContext = "", currentDrawing = "", currShapeHandle = "", currShapeSelected = "", scrollRecent = false, isMouseDown = false, isGroupSession = false;

var attachEvents = function( ) {

	var sx = 0, sy = 0, quadStage = 1, berzierStage = 1;

	document.onmousedown = function( event ) {

		sx = event.clientX - ( $ ( "#canvas-holder" ).offset ( ).left + 10 );
		sy = event.clientY - ( $ ( "#canvas-holder" ).offset ( ).top + 10 );

		if ( sx >= 0 && sx <= 700 && sy >= 0 && sy <= 700 ) {

			if ( currShapeSelected === "rectangle" ) {
				currShapeHandle = new rectangleShape ( );
				currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), $ ( "#color-filled" ).is ( ":checked" ),
				        hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
			}else if ( currShapeSelected === "triangle" ) {
				currShapeHandle = new triangleShape ( );
				currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), $ ( "#color-filled" ).is ( ":checked" ),
				        hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
			}else if ( currShapeSelected === "arrow" ) {
				currShapeHandle = new arrowShape ( );
				currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), $ ( "#color-filled" ).is ( ":checked" ),
				        hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
			}else if ( currShapeSelected === "circle" ) {
				currShapeHandle = new circleShape ( );
				currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), $ ( "#color-filled" ).is ( ":checked" ),
				        hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
			}else if ( currShapeSelected === "straightline" ) {
				currShapeHandle = new straightLineShape ( );
				currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), hex2rgb ( $ ( "#color-color" ).val ( ), ( $ (
				        "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
			}else if ( currShapeSelected === "quadraticcurve" ) {
				if ( quadStage === 1 ) {
					currShapeHandle = new quadraticCurveShape ( );
					currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), hex2rgb ( $ ( "#color-color" ).val ( ),
					        ( $ ( "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
				}
			}else if ( currShapeSelected === "berziercurved" ) {
				if ( berzierStage === 1 ) {
					currShapeHandle = new berzierCurveShape ( );
					currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), hex2rgb ( $ ( "#color-color" ).val ( ),
					        ( $ ( "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
				}
			}else if ( currShapeSelected === "pencil" ) {
				currShapeHandle = new pencilShape ( );
				currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), hex2rgb ( $ ( "#color-color" ).val ( ), ( $ (
				        "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
			}else if ( currShapeSelected === "serazer" ) {
				currShapeHandle = new erazeSquareShape ( );
				currShapeHandle.initialise ( parseInt ( $ ( "#line-width" ).val ( ) ), sx, sy );
				recordShape ( currShapeHandle );
			}else if ( currShapeSelected === "cerazer" ) {
				currShapeHandle = new erazeCircleShape ( );
				currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), hex2rgb ( $ ( "#color-color" ).val ( ), ( $ (
				        "#color-opacity" ).val ( ) / 100 ) ), sx, sy );
			}else if ( currShapeSelected === "stext" ) {
				currShapeHandle = new textShape ( );
				currShapeHandle.initialise ( $ ( "#line-width" ).val ( ), $ ( "#font-selector" ).find ( ":selected" )
				        .val ( ), hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ),
				        sx, sy );
				if ( $ ( "#text-value" ).val ( ) === "" ) {
					currShapeHandle.setText ( "Enter text..." );
				}else {
					currShapeHandle.setText ( $ ( "#text-value" ).val ( ) );
				}
			}
		}
		clearCanvas ( phantomContext );
		isMouseDown = true;
	};

	document.onmouseup = function( event ) {

		var x = event.clientX - ( $ ( "#canvas-holder" ).offset ( ).left + 10 ), y = event.clientY
		        - ( $ ( "#canvas-holder" ).offset ( ).top + 10 );

		if ( x >= 0 && x <= 700 && y >= 0 && y <= 700 ) {

			if ( currShapeSelected === "rectangle" ) {
				currShapeHandle.setEndPoints ( x, y );
				recordShape ( currShapeHandle );
				clearCanvas ( phantomContext );
			}else if ( currShapeSelected === "triangle" ) {
				currShapeHandle.setEndPoints ( x, y );
				recordShape ( currShapeHandle );
				clearCanvas ( phantomContext );
			}else if ( currShapeSelected === "arrow" ) {
				currShapeHandle.setEndPoints ( x, y );
				recordShape ( currShapeHandle );
				clearCanvas ( phantomContext );
			}else if ( currShapeSelected === "circle" ) {
				currShapeHandle.setEndPoints ( x, y );
				recordShape ( currShapeHandle );
				clearCanvas ( phantomContext );
			}else if ( currShapeSelected === "straightline" ) {
				currShapeHandle.setEndPoints ( x, y );
				recordShape ( currShapeHandle );
				clearCanvas ( phantomContext );
			}else if ( currShapeSelected === "quadraticcurve" ) {
				if ( quadStage === 1 ) {
					currShapeHandle.setEndPoints ( x, y );
					quadStage = 2;
				}else if ( quadStage === 2 ) {
					currShapeHandle.setControlPoints ( x, y );
					recordShape ( currShapeHandle );
					quadStage = 1;
					clearCanvas ( phantomContext );
				}
			}else if ( currShapeSelected === "berziercurved" ) {
				if ( berzierStage === 1 ) {
					currShapeHandle.setEndPoints ( x, y );
					berzierStage = 2;
				}else if ( berzierStage === 2 ) {
					currShapeHandle.setControlPoints1 ( x, y );
					berzierStage = 3;
				}else if ( berzierStage === 3 ) {
					currShapeHandle.setControlPoints2 ( x, y );
					recordShape ( currShapeHandle );
					berzierStage = 1;
					clearCanvas ( phantomContext );
				}
			}else if ( currShapeSelected === "pencil" ) {
				recordShape ( currShapeHandle );
				clearCanvas ( phantomContext );
			}else if ( currShapeSelected === "cerazer" ) {
				recordShape ( currShapeHandle );
				clearCanvas ( phantomContext );
			}else if ( currShapeSelected === "stext" ) {

				recordShape ( currShapeHandle );
				clearCanvas ( phantomContext );
			}
		}
		isMouseDown = false;
	};

	document.onmousemove = function( event ) {

		var x = event.clientX - ( $ ( "#canvas-holder" ).offset ( ).left + 10 ), y = event.clientY
		        - ( $ ( "#canvas-holder" ).offset ( ).top + 10 ), erazerCircleColour;

		if ( x >= 0 && x <= 700 && y >= 0 && y <= 700 ) {
			if ( currShapeSelected === "stext" ) {
				clearCanvas ( phantomContext );
				var text;
				if ( $ ( "#text-value" ).val ( ) === "" ) {
					text = "Enter text....";
				}else {
					text = $ ( "#text-value" ).val ( );
				}
				drawText ( phantomContext, x, y, text, $ ( "#line-width" ).val ( ), $ ( "#font-selector" ).find (
				        ":selected" ).val ( ), hex2rgb ( $ ( "#color-color" ).val ( ),
				        ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
			}else if ( currShapeSelected === "cerazer" ) {

				var c = canContext.getImageData ( x, y, 1, 1 ).data;
				var color = ( c [ 0 ] + c [ 1 ] + c [ 2 ] + c [ 3 ] + c [ 4 ] + c [ 5 ] + c [ 6 ] + c [ 7 ] ) / 8;
				if ( color < 120 ) {
					if ( color === 0 ) {
						erazerCircleColour = "#000000";
					}else {
						erazerCircleColour = "#FFFFFF";
					}
				}else {
					erazerCircleColour = "#000000";
				}
				clearCanvas ( phantomContext );
				drawSimpleCircle ( phantomContext, x, y,
				        ( $ ( "#line-width" ).val ( ) - $ ( "#line-width" ).val ( ) / 20 ) / 2, $ ( "#line-width" )
				                .val ( ) / 20, false, hex2rgb ( erazerCircleColour, 1 ) );
			}
			if ( currShapeSelected === "serazer" ) {
				var c = canContext.getImageData ( x, y, 1, 1 ).data;
				var color = ( c [ 0 ] + c [ 1 ] + c [ 2 ] + c [ 3 ] + c [ 4 ] + c [ 5 ] + c [ 6 ] + c [ 7 ] ) / 8;
				if ( color < 120 ) {
					if ( color === 0 ) {
						erazerCircleColour = "#000000";
					}else {
						erazerCircleColour = "#FFFFFF";
					}
				}else {
					erazerCircleColour = "#000000";
				}
				clearCanvas ( phantomContext );
				drawRectangle ( phantomContext, x, y, x + parseInt ( $ ( "#line-width" ).val ( ) ), y
				        + parseInt ( $ ( "#line-width" ).val ( ) ), $ ( "#line-width" ).val ( ) / 20, false, hex2rgb (
				        erazerCircleColour, 1 ) );
			}
		}

		if ( x >= 0 && x <= 700 && y >= 0 && y <= 700 && isMouseDown ) {

			if ( currShapeSelected === "rectangle" ) {
				clearCanvas ( phantomContext );
				drawRectangle ( phantomContext, sx, sy, x, y, $ ( "#line-width" ).val ( ), $ ( "#color-filled" ).is (
				        ":checked" ), hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
			}else if ( currShapeSelected === "triangle" ) {
				clearCanvas ( phantomContext );
				drawTriangle ( phantomContext, sx, sy, x, y, $ ( "#line-width" ).val ( ), $ ( "#color-filled" ).is (
				        ":checked" ), hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
			}else if ( currShapeSelected === "arrow" ) {
				clearCanvas ( phantomContext );
				drawArrow ( phantomContext, sx, sy, x, y, $ ( "#line-width" ).val ( ), $ ( "#color-filled" ).is (
				        ":checked" ), hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
			}else if ( currShapeSelected === "circle" ) {
				clearCanvas ( phantomContext );
				drawCircle ( phantomContext, sx, sy, x, y, $ ( "#line-width" ).val ( ), $ ( "#color-filled" ).is (
				        ":checked" ), hex2rgb ( $ ( "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
			}else if ( currShapeSelected === "straightline" ) {
				clearCanvas ( phantomContext );
				drawStraightLine ( phantomContext, sx, sy, x, y, $ ( "#line-width" ).val ( ), hex2rgb ( $ (
				        "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
			}else if ( currShapeSelected === "quadraticcurve" ) {
				if ( quadStage === 1 ) {
					clearCanvas ( phantomContext );
					drawStraightLine ( phantomContext, sx, sy, x, y, $ ( "#line-width" ).val ( ), hex2rgb ( $ (
					        "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
				}else if ( quadStage === 2 ) {
					clearCanvas ( phantomContext );
					drawQuadraticCurve ( phantomContext, currShapeHandle.sx, currShapeHandle.sy, x, y,
					        currShapeHandle.fx, currShapeHandle.fy, $ ( "#line-width" ).val ( ), hex2rgb ( $ (
					                "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
				}
			}else if ( currShapeSelected === "berziercurved" ) {
				if ( berzierStage === 1 ) {
					clearCanvas ( phantomContext );
					drawStraightLine ( phantomContext, sx, sy, x, y, $ ( "#line-width" ).val ( ), hex2rgb ( $ (
					        "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
				}else if ( berzierStage === 2 ) {
					clearCanvas ( phantomContext );
					drawQuadraticCurve ( phantomContext, currShapeHandle.sx, currShapeHandle.sy, x, y,
					        currShapeHandle.fx, currShapeHandle.fy, $ ( "#line-width" ).val ( ), hex2rgb ( $ (
					                "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
				}else if ( berzierStage === 3 ) {
					clearCanvas ( phantomContext );
					drawBerzierCurve ( phantomContext, currShapeHandle.sx, currShapeHandle.sy, currShapeHandle.c1x,
					        currShapeHandle.c1y, x, y, currShapeHandle.fx, currShapeHandle.fy, $ ( "#line-width" )
					                .val ( ), hex2rgb ( $ ( "#color-color" ).val ( ),
					                ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
				}
			}else if ( currShapeSelected === "pencil" ) {
				clearCanvas ( phantomContext );
				drawPencil ( phantomContext, currShapeHandle, x, y, $ ( "#line-width" ).val ( ), hex2rgb ( $ (
				        "#color-color" ).val ( ), ( $ ( "#color-opacity" ).val ( ) / 100 ) ) );
			}else if ( currShapeSelected === "cerazer" ) {
				clearCanvas ( phantomContext );
				erazeCircle ( canContext, currShapeHandle, x, y, $ ( "#line-width" ).val ( ) );
				drawSimpleCircle ( phantomContext, x, y,
				        ( $ ( "#line-width" ).val ( ) - $ ( "#line-width" ).val ( ) / 20 ) / 2, $ ( "#line-width" )
				                .val ( ) / 20, false, hex2rgb ( erazerCircleColour, 1 ) );
			}
		}
	};
	addToolSelectionListeners ( );
};

var saveToServer = function( ) {

	if ( currentDrawing.getJSON ( ) === undefined ) {
		$ ( "#save-drawing" ).effect ( "highlight", {
			color: "#00FF00"
		}, 500 );
	}else {
		if ( currentDrawing.id ) {
			$.post ( "/save-pre-existing-drawing/", {
			    data: JSON.stringify ( currentDrawing.getJSON ( ) ),
			    name: currentDrawing.getName ( ),
			    id: currentDrawing.id,
			    publicShare: $ ( "#share-publicly-allowed" ).is ( ":checked" )
			} ).done ( function( ) {

				$ ( "#save-drawing" ).effect ( "highlight", {
					color: "#00FF00"
				}, 500 );
			} ).fail ( function( ) {

				$ ( "#save-drawing" ).effect ( "highlight", {
					color: "#FF0000"
				}, 500 );
			} );
		}else {
			$.post ( "/save-drawing/", {
			    data: JSON.stringify ( currentDrawing.getJSON ( ) ),
			    name: currentDrawing.getName ( ),
			    publicShare: $ ( "#share-publicly-allowed" ).is ( ":checked" )
			} ).done ( function( data ) {

				currentDrawing.id = data.id;
				$ ( "#save-drawing" ).effect ( "highlight", {
					color: "#00FF00"
				}, 500 );
			} ).fail ( function( ) {

				$ ( "#save-drawing" ).effect ( "highlight", {
					color: "#FF0000"
				}, 500 );
			} );
		}
	}
};

var clearDrawingData = function( ) {

	if ( isGroupSession ) {
		connection.emit ( "group-clear-canvas", {
		    groupSession: groupSessionID,
		    sessionID: mySessionID
		} );
		$ ( "#messages-content-view" ).html ( "" );
	}

	currentDrawing = new drawingInstructions ( );
	currentDrawing.initialise ( );
	canContext.clearRect ( 0, 0, 700, 700 );
	phantomContext.clearRect ( 0, 0, 700, 700 );
};

var clearDrawingDataFromServer = function( ) {

	currentDrawing = new drawingInstructions ( );
	currentDrawing.initialise ( );
	canContext.clearRect ( 0, 0, 700, 700 );
	phantomContext.clearRect ( 0, 0, 700, 700 );
	if ( isGroupSession ) {
		$ ( "#messages-content-view" ).html ( "" );
	}
};

var addToolSelectionListeners = function( ) {

	$ ( "#save-drawing" ).click ( function( ) {

		saveToServer ( );
	} );

	$ ( "#clear-canvas" ).click ( function( ) {

		clearDrawingData ( );
	} );

	$ ( "#edit-layers" ).click ( function( ) {

		editLayers ( );
	} );

	$ ( "#shape-circle" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "circle";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-rectangle" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "rectangle";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-triangle" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "triangle";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-arrow" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "arrow";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-pencil" ).click ( function( ) {

		clearSelections ( );
		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "pencil";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
	} );
	$ ( "#shape-straightline" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "straightline";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-quadraticcurve" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "quadraticcurve";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-berziercurved" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "berziercurved";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-serazer" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "serazer";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/curser_small_blank.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-cerazer" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "cerazer";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/curser_small_blank.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-stext" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "stext";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
	$ ( "#shape-dtext" ).click ( function( ) {

		$ ( this ).css ( "background-color", "#666666" );
		$ ( this ).effect ( "highlight", {
			color: "#ffffff"
		}, 500 );
		currShapeSelected = "dtext";
		$ ( "#phantom-drawing-canvas" ).css ( "cursor", "url(/resources/imgs/target-curser_small.png), auto" );
		clearSelections ( );
	} );
};

var clearSelections = function( ) {

	$ ( "#shape-circle" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-rectangle" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-triangle" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-arrow" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-pencil" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-straightline" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-quadraticcurve" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-berziercurved" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-serazer" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-cerazer" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-stext" ).css ( "background-color", "rgba(0,0,0,0)" );
	$ ( "#shape-dtext" ).css ( "background-color", "rgba(0,0,0,0)" );
};

var erazeSquare = function( canHandle, x, y, lWidth ) {

	canHandle.clearRect ( x, y, lWidth, lWidth );
};

var erazeCircle = function( canHandle, sH, x, y, lWidth ) {

	sH.positions.push ( {
	    "x": x,
	    "y": y
	} );
	if ( sH.positions.length > 2 ) {
		canHandle.beginPath ( );
		canHandle.globalCompositeOperation = "destination-out";
		canHandle.lineWidth = lWidth;
		canHandle.lineJoin = "round";
		canHandle.lineCap = "round";
		canHandle.moveTo ( sH.positions [ 0 ].x, sH.positions [ 0 ].y );
		for ( var i = 0; i < sH.positions.length - 1; i++ ) {
			canHandle.lineTo ( sH.positions [ i + 1 ].x, sH.positions [ i + 1 ].y );
		}
		canHandle.stroke ( );
		canHandle.globalCompositeOperation = "source-over";
	}else {
		canHandle.clearRect ( sH.positions [ 0 ].x, sH.positions [ 0 ].y, lWidth, lWidth );
	}
};

var drawStraightLine = function( canHandle, sX, sY, fX, fY, lWidth, lColor ) {

	canHandle.beginPath ( );
	canHandle.moveTo ( sX, sY );
	canHandle.lineTo ( fX, fY );
	canHandle.lineWidth = lWidth;
	canHandle.lineJoin = "round";
	canHandle.lineCap = "round";
	canHandle.strokeStyle = lColor;
	canHandle.stroke ( );
};

var drawText = function( canHandle, sX, sY, text, size, font, lColor ) {

	canHandle.fillStyle = lColor;
	canHandle.font = size + "px " + font;
	canHandle.fillText ( text, sX, sY );
};

var drawPencil = function( canHandle, sH, x, y, lWidth, lColor ) {

	sH.positions.push ( {
	    "x": x,
	    "y": y
	} );
	canHandle.lineWidth = lWidth;
	canHandle.lineJoin = "round";
	canHandle.lineCap = "round";
	canHandle.strokeStyle = lColor;
	canHandle.fillStyle = lColor;
	canHandle.beginPath ( );
	canHandle.moveTo ( sH.positions [ 0 ].x, sH.positions [ 0 ].y );
	if ( sH.positions.length > 2 ) {
		for ( var i = 0; i < sH.positions.length - 1; i++ ) {
			canHandle.lineTo ( sH.positions [ i + 1 ].x, sH.positions [ i + 1 ].y );
		}
		canHandle.stroke ( );
	}
};

var drawRectangle = function( canHandle, sX, sY, fX, fY, outlineWidth, filled, lColor ) {

	if ( filled ) {
		canHandle.fillStyle = lColor;
		canHandle.fillRect ( sX, sY, fX - sX, fY - sY );
	}else {
		canHandle.beginPath ( );
		canHandle.lineWidth = outlineWidth;
		canHandle.strokeStyle = lColor;
		canHandle.rect ( sX, sY, fX - sX, fY - sY );
		canHandle.stroke ( );
	}
};

var drawTriangle = function( canHandle, sX, sY, fX, fY, outlineWidth, filled, lColor ) {

	if ( filled ) {
		canHandle.beginPath ( );
		canHandle.fillStyle = lColor;
		canHandle.moveTo ( sX, sY );
		canHandle.lineTo ( fX, fY );
		canHandle.lineTo ( fX, sY );
		canHandle.fill ( );
	}else {
		canHandle.beginPath ( );
		canHandle.lineWidth = outlineWidth;
		canHandle.strokeStyle = lColor;
		canHandle.moveTo ( sX, sY );
		canHandle.lineTo ( fX, fY );
		canHandle.lineTo ( fX, sY );
		canHandle.closePath ( );
		canHandle.stroke ( );
	}
};

var drawArrow = function( canHandle, sX, sY, fX, fY, outlineWidth, filled, lColor ) {

	var distance = Math.sqrt ( ( ( fX - sX ) * ( fX - sX ) ) + ( ( fY - sY ) * ( fY - sY ) ) );
	var perdis = distance * 0.10;

	canHandle.beginPath ( );
	canHandle.lineWidth = outlineWidth;
	canHandle.strokeStyle = lColor;
	canHandle.lineJoin = "round";
	canHandle.lineCap = "round";

	var headlen = perdis; // length of head in pixels
	var angle = Math.atan2 ( fY - sY, fX - sX );
	canHandle.moveTo ( sX, sY );
	canHandle.lineTo ( fX, fY );
	canHandle
	        .lineTo ( fX - headlen * Math.cos ( angle - Math.PI / 6 ), fY - headlen * Math.sin ( angle - Math.PI / 6 ) );
	canHandle.moveTo ( fX, fY );
	canHandle
	        .lineTo ( fX - headlen * Math.cos ( angle + Math.PI / 6 ), fY - headlen * Math.sin ( angle + Math.PI / 6 ) );
	canHandle.stroke ( );
};

var drawCircle = function( canHandle, sX, sY, fX, fY, outlineWidth, filled, lColor ) {

	var inner = Math.pow ( ( fX - sX ), 2 ) + Math.pow ( ( fY - sY ), 2 ), radius = Math.sqrt ( inner ) / 2, x = ( sX + fX ) / 2, y = ( sY + fY ) / 2;

	canHandle.beginPath ( );
	canHandle.arc ( x, y, radius, 0, 2 * Math.PI, false );

	if ( filled ) {
		canHandle.fillStyle = lColor;
		canHandle.fill ( );
	}else {
		canHandle.lineWidth = outlineWidth;
		canHandle.strokeStyle = lColor;
		canHandle.stroke ( );
	}
};

var drawSimpleCircle = function( canHandle, x, y, rad, outlineWidth, filled, lColor ) {

	canHandle.beginPath ( );
	canHandle.arc ( x, y, rad, 0, 2 * Math.PI, false );

	if ( filled ) {
		canHandle.fillStyle = lColor;
		canHandle.fill ( );
	}else {
		canHandle.lineWidth = outlineWidth;
		canHandle.strokeStyle = lColor;
		canHandle.stroke ( );
	}
};

var drawQuadraticCurve = function( canHandle, sX, sY, cX, cY, fX, fY, lWidth, lColor ) {

	canHandle.lineWidth = lWidth;
	canHandle.strokeStyle = lColor;
	canHandle.lineJoin = "round";
	canHandle.lineCap = "round";
	canHandle.beginPath ( );
	canHandle.moveTo ( sX, sY );
	canHandle.quadraticCurveTo ( cX, cY, fX, fY );
	canHandle.stroke ( );
};

var drawBerzierCurve = function( canHandle, sX, sY, c1X, c1Y, c2X, c2Y, fX, fY, lWidth, lColor ) {

	canHandle.lineWidth = lWidth;
	canHandle.strokeStyle = lColor;
	canHandle.lineJoin = "round";
	canHandle.lineCap = "round";
	canHandle.beginPath ( );
	canHandle.moveTo ( sX, sY );
	canHandle.bezierCurveTo ( c1X, c1Y, c2X, c2Y, fX, fY );
	canHandle.stroke ( );
};

var hex2rgb = function( hex, opacity ) {

	var h = hex.replace ( "#", "" );
	h = h.match ( new RegExp ( "(.{" + h.length / 3 + "})", "g" ) );

	for ( var i = 0; i < h.length; i++ ) {
		h [ i ] = parseInt ( h [ i ].length == 1? h [ i ] + h [ i ]: h [ i ], 16 );
	}
	if ( typeof opacity != "undefined" ) {
		h.push ( opacity );
	}
	return "rgba(" + h.join ( "," ) + ")";
};

var rgbToHex = function( rgb ) {

	rgb = rgb.match ( /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i );
	return ( rgb && rgb.length === 4 )? "#" + ( "0" + parseInt ( rgb [ 1 ], 10 ).toString ( 16 ) ).slice ( -2 )
	        + ( "0" + parseInt ( rgb [ 2 ], 10 ).toString ( 16 ) ).slice ( -2 )
	        + ( "0" + parseInt ( rgb [ 3 ], 10 ).toString ( 16 ) ).slice ( -2 ): '';
};

var rgbaToOpacity = function( rgb ) {

	rgb = rgb.replace ( /^.*,(.+)\)/, '$1' );
	return rgb;
};

var clearCanvas = function( canCon ) {

	canCon.clearRect ( 0, 0, 700, 700 );
};

var clearMessages = function( ) {

	if ( groupSessionID ) {
		$ ( "#messages-content-view" ).html ( "" );
	}
};

var drawingInstructions = function( ) {

	this.name;
	this.drawingSequence;
	this.id;
	this.publicShare;

	this.initialise = function( ) {

		this.drawingSequence = new Array ( );
		this.name = "untitled";
	};
	this.addShape = function( shapeJson ) {

		this.drawingSequence.push ( shapeJson );
	};
	this.getJSON = function( ) {

		return this.drawingSequence;
	};
	this.setDrawingSequence = function( ds ) {

		this.drawingSequence = ds;
	};
	this.getName = function( ) {

		return this.name;
	};
};

var rectangleShape = function( ) {

	this.sx;
	this.sy;
	this.fx;
	this.fy;
	this.width;
	this.filled;
	this.colour;
	this.shape;
	this.visible;

	this.initialise = function( w, f, c, x, y ) {

		this.width = w;
		this.filled = f;
		this.visible = true;
		this.colour = c;
		this.sx = x;
		this.sy = y;
		this.shape = "rectangle";
	};
	this.setEndPoints = function( x, y ) {

		this.fx = x;
		this.fy = y;
	};
	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sx,
		    "sY": this.sy,
		    "fX": this.fx,
		    "fY": this.fy,
		    "lWidth": this.width,
		    "filled": this.filled,
		    "colour": this.colour,
		    "visible": this.visible
		};
	};
};

var triangleShape = function( ) {

	this.sx;
	this.sy;
	this.fx;
	this.fy;
	this.width;
	this.filled;
	this.colour;
	this.shape;
	this.visible;

	this.initialise = function( w, f, c, x, y ) {

		this.width = w;
		this.filled = f;
		this.visible = true;
		this.colour = c;
		this.sx = x;
		this.sy = y;
		this.shape = "triangle";
	};
	this.setEndPoints = function( x, y ) {

		this.fx = x;
		this.fy = y;
	};
	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sx,
		    "sY": this.sy,
		    "fX": this.fx,
		    "fY": this.fy,
		    "lWidth": this.width,
		    "filled": this.filled,
		    "colour": this.colour,
		    "visible": this.visible
		};
	};
};

var arrowShape = function( ) {

	this.sx;
	this.sy;
	this.fx;
	this.fy;
	this.width;
	this.filled;
	this.colour;
	this.shape;
	this.visible;

	this.initialise = function( w, f, c, x, y ) {

		this.width = w;
		this.filled = f;
		this.visible = true;
		this.colour = c;
		this.sx = x;
		this.sy = y;
		this.shape = "arrow";
	};
	this.setEndPoints = function( x, y ) {

		this.fx = x;
		this.fy = y;
	};
	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sx,
		    "sY": this.sy,
		    "fX": this.fx,
		    "fY": this.fy,
		    "lWidth": this.width,
		    "filled": this.filled,
		    "colour": this.colour,
		    "visible": this.visible
		};
	};
};

var textShape = function( ) {

	this.sX;
	this.sY;
	this.text;
	this.size;
	this.font;
	this.lColor;
	this.shape;
	this.visible;

	this.initialise = function( w, f, c, x, y ) {

		this.size = w;
		this.font = f;
		this.shape = "stext";
		this.visible = true;
		this.lColor = c;
		this.sX = x;
		this.sY = y;
	};
	this.setText = function( t ) {

		this.text = t;
	};
	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sX,
		    "sY": this.sY,
		    "lWidth": this.size,
		    "text": this.text,
		    "font": this.font,
		    "colour": this.lColor,
		    "visible": this.visible
		};
	};
};

var groupChatMessageShape = function( ) {

	this.senderName;
	this.text;
	this.shape;
	this.visible;

	this.initialise = function( name, text ) {

		this.shape = "groupmessage";
		this.text = text;
		this.senderName = name;
		this.visible = true;
	};

	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "text": this.text,
		    "sender": this.senderName,
		    "visible": this.visible
		};
	};
};

var circleShape = function( ) {

	this.sx;
	this.sy;
	this.fx;
	this.fy;
	this.width;
	this.filled;
	this.colour;
	this.shape;
	this.visible;

	this.initialise = function( w, f, c, x, y ) {

		this.width = w;
		this.filled = f;
		this.visible = true;
		this.colour = c;
		this.sx = x;
		this.sy = y;
		this.shape = "circle";
	};
	this.setEndPoints = function( x, y ) {

		this.fx = x;
		this.fy = y;
	};
	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sx,
		    "sY": this.sy,
		    "fX": this.fx,
		    "fY": this.fy,
		    "lWidth": this.width,
		    "filled": this.filled,
		    "colour": this.colour,
		    "visible": this.visible
		};
	};
};

var straightLineShape = function( ) {

	this.sx;
	this.sy;
	this.fx;
	this.fy;
	this.width;
	this.colour;
	this.shape;
	this.visible;

	this.initialise = function( w, c, x, y ) {

		this.width = w;
		this.colour = c;
		this.sx = x;
		this.sy = y;
		this.shape = "straightline";
		this.visible = true;
	};
	this.setEndPoints = function( x, y ) {

		this.fx = x;
		this.fy = y;
	};
	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sx,
		    "sY": this.sy,
		    "fX": this.fx,
		    "fY": this.fy,
		    "lWidth": this.width,
		    "colour": this.colour,
		    "visible": this.visible
		};
	};
};

var quadraticCurveShape = function( ) {

	this.sx;
	this.sy;
	this.fx;
	this.fy;
	this.width;
	this.colour;
	this.shape;
	this.cx;
	this.cy;
	this.visible;

	this.initialise = function( w, c, x, y ) {

		this.width = w;
		this.colour = c;
		this.sx = x;
		this.sy = y;
		this.shape = "quadraticcurve";
		this.visible = true;
	};
	this.setControlPoints = function( x, y ) {

		this.cx = x;
		this.cy = y;
	};
	this.setEndPoints = function( x, y ) {

		this.fx = x;
		this.fy = y;
	};
	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sx,
		    "sY": this.sy,
		    "cx": this.cx,
		    "cy": this.cy,
		    "fX": this.fx,
		    "fY": this.fy,
		    "lWidth": this.width,
		    "colour": this.colour,
		    "visible": this.visible
		};
	};
};

var berzierCurveShape = function( ) {

	this.sx;
	this.sy;
	this.fx;
	this.fy;
	this.width;
	this.colour;
	this.visible;
	this.shape;
	this.c1x;
	this.c1y;
	this.c2x;
	this.c2y;

	this.initialise = function( w, c, x, y ) {

		this.width = w;
		this.colour = c;
		this.sx = x;
		this.sy = y;
		this.shape = "berziercurved";
		this.visible = true;
	};
	this.setControlPoints1 = function( x, y ) {

		this.c1x = x;
		this.c1y = y;
	};
	this.setControlPoints2 = function( x, y ) {

		this.c2x = x;
		this.c2y = y;
	};
	this.setEndPoints = function( x, y ) {

		this.fx = x;
		this.fy = y;
	};
	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sx,
		    "sY": this.sy,
		    "c1x": this.c1x,
		    "c1y": this.c1y,
		    "c2x": this.c2x,
		    "c2y": this.c2y,
		    "fX": this.fx,
		    "fY": this.fy,
		    "lWidth": this.width,
		    "colour": this.colour,
		    "visible": this.visible
		};
	};
};

var pencilShape = function( ) {

	this.positions;
	this.width;
	this.visible;
	this.colour;
	this.shape;

	this.initialise = function( w, c, x, y ) {

		this.width = w;
		this.colour = c;
		this.shape = "pencil";
		this.positions = new Array;
		this.positions.push ( {
		    "x": x,
		    "y": y
		} );
		this.visible = true;
	};

	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "positions": this.positions,
		    "lWidth": this.width,
		    "colour": this.colour,
		    "visible": this.visible
		};
	};
};

var erazeSquareShape = function( ) {

	this.sX;
	this.sY;
	this.visible;
	this.width;
	this.shape;

	this.initialise = function( w, x, y ) {

		this.width = w;
		this.shape = "serazer";
		this.visible = true;
		this.sX = x;
		this.sY = y;
	};

	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "sX": this.sX,
		    "sY": this.sY,
		    "lWidth": this.width,
		    "visible": this.visible
		};
	};
};

var erazeCircleShape = function( ) {

	this.positions;
	this.width;
	this.shape;
	this.visible;

	this.initialise = function( w, x, y ) {

		this.width = w;
		this.shape = "cerazer";
		this.positions = new Array;
		this.visible = true;
		this.positions.push ( {
		    "x": x,
		    "y": y
		} );
	};

	this.getJSON = function( ) {

		return {
		    "shape": this.shape,
		    "positions": this.positions,
		    "lWidth": this.width,
		    "visible": this.visible
		};
	};
};

var recordShape = function( cSH ) {

	var cshD = cSH.getJSON ( );

	currentDrawing.addShape ( cshD );
	if ( cshD.shape === "rectangle" ) {
		drawRectangle ( canContext, cshD.sX, cshD.sY, cshD.fX, cshD.fY, cshD.lWidth, cshD.filled, cshD.colour );
	}else if ( cshD.shape === "triangle" ) {
		drawTriangle ( canContext, cshD.sX, cshD.sY, cshD.fX, cshD.fY, cshD.lWidth, cshD.filled, cshD.colour );
	}else if ( cshD.shape === "arrow" ) {
		drawArrow ( canContext, cshD.sX, cshD.sY, cshD.fX, cshD.fY, cshD.lWidth, cshD.filled, cshD.colour );
	}else if ( cshD.shape === "circle" ) {
		drawCircle ( canContext, cshD.sX, cshD.sY, cshD.fX, cshD.fY, cshD.lWidth, cshD.filled, cshD.colour );
	}else if ( cshD.shape === "straightline" ) {
		drawStraightLine ( canContext, cshD.sX, cshD.sY, cshD.fX, cshD.fY, cshD.lWidth, cshD.colour );
	}else if ( cshD.shape === "quadraticcurve" ) {
		drawQuadraticCurve ( canContext, cshD.sX, cshD.sY, cshD.cx, cshD.cy, cshD.fX, cshD.fY, cshD.lWidth, cshD.colour );
	}else if ( cshD.shape === "berziercurved" ) {
		drawBerzierCurve ( canContext, cshD.sX, cshD.sY, cshD.c1x, cshD.c1y, cshD.c2x, cshD.c2y, cshD.fX, cshD.fY,
		        cshD.lWidth, cshD.colour );
	}else if ( cshD.shape === "pencil" ) {
		drawPencil ( canContext, cSH, cSH.positions [ cSH.positions.length - 1 ].x + 1,
		        cSH.positions [ cSH.positions.length - 1 ].y + 1, cshD.lWidth, cshD.colour );
	}else if ( cshD.shape === "serazer" ) {
		erazeSquare ( canContext, cSH.sX, cSH.sY, cshD.lWidth );
	}else if ( cshD.shape === "cerazer" ) {
		erazeCircle ( canContext, cSH, cSH.positions [ cSH.positions.length - 1 ].x + 1,
		        cSH.positions [ cSH.positions.length - 1 ].y + 1, cshD.lWidth );
	}else if ( cshD.shape === "stext" ) {
		drawText ( canContext, cshD.sX, cshD.sY, cshD.text, cshD.lWidth, cshD.font, cshD.colour );
	}else if ( cshD.shape === "groupmessage" ) {

		$ ( "#messages-content-view" ).append (
		        "<div class=\"messages-message-text\">" + cshD.sender + ": " + cshD.text + "</div>" );
		if ( !scrollRecent ) {
			scrollRecent = true;
			$ ( "#messages-main-view" ).animate ( {
				scrollTop: $ ( "#messages-content-view" ).height ( )
			}, 500 );
			setTimeout ( function( ) {

				scrollRecent = false;
			}, 500 );
		}else {
			$ ( "#messages-main-view" ).animate ( {
				scrollTop: $ ( "#messages-content-view" ).height ( )
			}, 1 );
		}

		if ( !( messagesDialogOpen ) ) {
			openCloseMessages ( );
		}
	}
	if ( isGroupSession ) {
		connection.emit ( "send-group-message", {
		    groupSession: groupSessionID,
		    sessionID: mySessionID,
		    drawingInstruction: cshD
		} );
	}
};

var drawFull = function( canvasHandle, instructions ) {

	for ( i = 0; i < instructions.length; i++ ) {

		var curr = instructions [ i ];
		if ( curr.visible ) {
			if ( curr.shape === "rectangle" ) {
				drawRectangle ( canvasHandle, curr.sX, curr.sY, curr.fX, curr.fY, curr.lWidth, curr.filled, curr.colour );
			}else if ( curr.shape === "triangle" ) {
				drawTriangle ( canvasHandle, curr.sX, curr.sY, curr.fX, curr.fY, curr.lWidth, curr.filled, curr.colour );
			}else if ( curr.shape === "arrow" ) {
				drawArrow ( canvasHandle, curr.sX, curr.sY, curr.fX, curr.fY, curr.lWidth, curr.filled, curr.colour );
			}else if ( curr.shape === "circle" ) {
				drawCircle ( canvasHandle, curr.sX, curr.sY, curr.fX, curr.fY, curr.lWidth, curr.filled, curr.colour );
			}else if ( curr.shape === "straightline" ) {
				drawStraightLine ( canvasHandle, curr.sX, curr.sY, curr.fX, curr.fY, curr.lWidth, curr.colour );
			}else if ( curr.shape === "quadraticcurve" ) {
				drawQuadraticCurve ( canvasHandle, curr.sX, curr.sY, curr.cx, curr.cy, curr.fX, curr.fY, curr.lWidth,
				        curr.colour );
			}else if ( curr.shape === "berziercurved" ) {
				drawBerzierCurve ( canvasHandle, curr.sX, curr.sY, curr.c1x, curr.c1y, curr.c2x, curr.c2y, curr.fX,
				        curr.fY, curr.lWidth, curr.colour );
			}else if ( curr.shape === "pencil" ) {
				drawPencil ( canvasHandle, curr, curr.positions [ curr.positions.length - 1 ].x,
				        curr.positions [ curr.positions.length - 1 ].y, curr.lWidth, curr.colour );
			}else if ( curr.shape === "serazer" ) {
				erazeSquare ( canvasHandle, curr.sX, curr.sY, curr.lWidth );
			}else if ( curr.shape === "cerazer" ) {
				erazeCircle ( canvasHandle, curr, curr.positions [ curr.positions.length - 1 ].x,
				        curr.positions [ curr.positions.length - 1 ].y, curr.lWidth );
			}else if ( curr.shape === "stext" ) {
				drawText ( canvasHandle, curr.sX, curr.sY, curr.text, curr.lWidth, curr.font, curr.colour );
			}else if ( curr.shape === "groupmessage" ) {
				if ( isGroupSession ) {
					$ ( "#messages-content-view" ).append (
					        "<div class=\"messages-message-text\">" + curr.sender + ": " + curr.text + "</div>" );
					if ( !scrollRecent ) {
						scrollRecent = true;
						$ ( "#messages-main-view" ).animate ( {
							scrollTop: $ ( "#messages-content-view" ).height ( )
						}, 500 );
						setTimeout ( function( ) {

							scrollRecent = false;
						}, 500 );
					}else {
						$ ( "#messages-main-view" ).animate ( {
							scrollTop: $ ( "#messages-content-view" ).height ( )
						}, 1 );
					}
					if ( !( messagesDialogOpen ) ) {
						openCloseMessages ( );
					}
				}
			}
		}
	}
};

var initPrivateSession = function( ) {

	$ ( "#shape-selector-accordion" ).accordion ( {
	    fillSpace: true,
	    heightStyle: "fill"
	} );
	$ ( "#colour-selector-accordion" ).accordion ( {
	    fillSpace: true,
	    heightStyle: "fill"
	} );
	$ ( "#colour-selector-height" ).height ( 185 );
	$ ( "#options-selector-height" ).height ( 185 );
	canvasHandle = $ ( "#current-drawing-canvas" ).get ( 0 );
	canContext = canvasHandle.getContext ( "2d" );
	phantomCanvasHandle = $ ( "#phantom-drawing-canvas" ).get ( 0 );
	phantomContext = phantomCanvasHandle.getContext ( "2d" );
	attachEvents ( );
	currentDrawing = new drawingInstructions ( );
	currentDrawing.initialise ( );
};

var editLayers = function( ) {

	currShapeSelected = "";
	clearSelections ( );
	$ ( ".dialog-window" ).html ( $ ( "#dialog-window-edit-layers" ).html ( ) );
	$ ( ".dialog-window" ).css ( "visibility", "visible" );
	$ ( ".dialog-window" ).css ( "opacity", "0" );
	$ ( ".dialog-window" ).fadeTo ( 400, 1.0 );

	$ ( ".dialog-window-backdrop-large" ).click ( function( ) {

		refreshCanvas ( );
		$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
		setTimeout ( function( ) {

			$ ( ".dialog-window" ).css ( "visibility", "hidden" );
		}, 400 );
	} );
	$ ( ".dialog-window-top-exit-large" ).click ( function( ) {

		refreshCanvas ( );
		$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
		setTimeout ( function( ) {

			$ ( ".dialog-window" ).css ( "visibility", "hidden" );
		}, 400 );
	} );
	$ ( ".dialog-window-footer-button" ).click ( function( ) {

		refreshCanvas ( );
		$ ( ".dialog-window" ).fadeTo ( 400, 0.0 );
		setTimeout ( function( ) {

			$ ( ".dialog-window" ).css ( "visibility", "hidden" );
		}, 400 );
	} );

	var instructions = currentDrawing.getJSON ( );
	var shapeName, filled, visible, colour, width, opacity;

	for ( var i = 0; i < instructions.length; i++ ) {

		if ( !( instructions [ i ].shape === "groupmessage" ) ) {

			shapeName = instructions [ i ].shape;
			filled = instructions [ i ].filled;
			visible = instructions [ i ].visible;
			width = instructions [ i ].lWidth;

			if ( instructions [ i ].colour ) {
				colour = rgbToHex ( instructions [ i ].colour );
				opacity = rgbaToOpacity ( instructions [ i ].colour );
			}else {
				colour = "#FFFFFF";
				opacity = 1;
			}
			opacity = opacity * 100;

			if ( filled ) {
				var filledval = "checked";
			}else {
				var filledval = "unchecked";
			}

			if ( visible ) {
				var visibleval = "checked";
			}else {
				var visibleval = "unchecked";
			}

			$ ( "#edit-layers-main-shape-container" ).append (
			        "<div class=\"edit-layers-shape-container\">" + "<canvas id=\"canvas-shape-layer-" + i
			                + "\" class=\"edit-layers-canvas\" width=\"700\" height=\"700\" />"
			                + "<div class=\"edit-layers-option-container\">" + "<div class=\"edit-layers-shape-name\">"
			                + shapeName + "</div><div class=\"edit-layers-options-sub-container\">" + "<table>"
			                + "<tr>" + "<td class=\"td-text-light\" >Visible:</td>"
			                + "<td class=\"td-input\"><input id=\"shape-visible-" + i
			                + "\" type=\"checkbox\" onclick=\"changeVisibilityStatus(" + i
			                + ")\" name=\"shape-filled\" " + visibleval + " ></td>" + "</tr>" + "<tr>"
			                + "<td class=\"td-text-light\" >Shape Filled:</td>"
			                + "<td class=\"td-input\"><input id=\"shape-filled-" + i
			                + "\" type=\"checkbox\" onclick=\"changeFilledStatus(" + i + ")\" name=\"shape-filled\" "
			                + filledval + " ></td>" + "</tr>	" + "<tr class=\"tr-separator\" >"
			                + "<td class=\"td-text-light\">Colour:</td>"
			                + "<td class=\"td-input\"><input id=\"color-color-" + i
			                + "\" type=\"color\" name=\"color-chooser\" value=\"" + colour
			                + "\" onchange=\"changeColourStatus(" + i
			                + ")\" class=\"colour-selector-input-width\"></td>" + "</tr>	"
			                + "<tr class=\"tr-separator\" >" + "<td class=\"td-text-light\">Opacity:</td> "
			                + "<td class=\"td-input\"><input id=\"color-opacity-" + i + "\" type=\"range\" value=\""
			                + opacity + "\" onchange=\"changeColourStatus(" + i
			                + ")\" name=\"opacity-chooser\" class=\"colour-selector-input-width\"></td>" + "</tr>"
			                + "<tr class=\"tr-separator\" >" + "<td class=\"td-text-light\">Line Width:</td>"
			                + "<td class=\"td-input\"><input id=\"line-width-" + i + "\" type=\"number\" value=\""
			                + width + "\" onchange=\"changeWidthStatus(" + i
			                + ")\" name=\"line-width\" class=\"colour-selector-input-width\"></td>" + "</tr>"
			                + "</table>" + "</div>" + "</div>" + "</div>"
			                + "<div class=\"dialog-window-full-separator-large\"></div>" );

			// Draw shape on canvas
			var canlocal = "#canvas-shape-layer-" + i;
			var cH = $ ( canlocal ).get ( 0 );
			var cC = cH.getContext ( "2d" );
			var currInstructionTemp = new Array ( );
			currInstructionTemp.push ( instructions [ i ] );
			drawFull ( cC, currInstructionTemp );
		}
	}
};

var changeVisibilityStatus = function( id ) {

	var currentStatus = $ ( "#shape-visible-" + id ).is ( ":checked" );
	currentDrawing.drawingSequence [ id ].visible = currentStatus;
	if ( isGroupSession ) {
		updateLayersGroup ( id, "visible", currentStatus );
	}
	var canlocal = "#canvas-shape-layer-" + id;
	var cH = $ ( canlocal ).get ( 0 );
	var cC = cH.getContext ( "2d" );
	clearCanvas ( cC );
	var currInstructionTemp = new Array ( );
	currInstructionTemp.push ( currentDrawing.drawingSequence [ id ] );
	drawFull ( cC, currInstructionTemp );
};

var changeFilledStatus = function( id ) {

	var currentStatus = $ ( "#shape-filled-" + id ).is ( ":checked" );
	currentDrawing.drawingSequence [ id ].filled = currentStatus;
	if ( isGroupSession ) {
		updateLayersGroup ( id, "filled", currentStatus );
	}
	var canlocal = "#canvas-shape-layer-" + id;
	var cH = $ ( canlocal ).get ( 0 );
	var cC = cH.getContext ( "2d" );
	clearCanvas ( cC );
	var currInstructionTemp = new Array ( );
	currInstructionTemp.push ( currentDrawing.drawingSequence [ id ] );
	drawFull ( cC, currInstructionTemp );
};

var changeWidthStatus = function( id ) {

	var currentStatus = parseInt ( $ ( "#line-width-" + id ).val ( ) );
	currentDrawing.drawingSequence [ id ].lWidth = currentStatus;
	if ( isGroupSession ) {
		updateLayersGroup ( id, "lWidth", currentStatus );
	}
	var canlocal = "#canvas-shape-layer-" + id;
	var cH = $ ( canlocal ).get ( 0 );
	var cC = cH.getContext ( "2d" );
	clearCanvas ( cC );
	var currInstructionTemp = new Array ( );
	currInstructionTemp.push ( currentDrawing.drawingSequence [ id ] );
	drawFull ( cC, currInstructionTemp );
};

var changeColourStatus = function( id ) {

	var hex = $ ( "#color-color-" + id ).val ( );
	var opacity = parseInt ( $ ( "#color-opacity-" + id ).val ( ) );
	var newColour = hex2rgb ( hex, opacity / 100 );
	currentDrawing.drawingSequence [ id ].colour = newColour;
	if ( isGroupSession ) {
		updateLayersGroup ( id, "colour", newColour );
	}
	var canlocal = "#canvas-shape-layer-" + id;
	var cH = $ ( canlocal ).get ( 0 );
	var cC = cH.getContext ( "2d" );
	clearCanvas ( cC );
	var currInstructionTemp = new Array ( );
	currInstructionTemp.push ( currentDrawing.drawingSequence [ id ] );
	drawFull ( cC, currInstructionTemp );
};

var refreshCanvas = function( ) {

	clearCanvas ( canContext );
	if ( isGroupSession ) {
		clearMessages ( );
	}
	drawFull ( canContext, currentDrawing.getJSON ( ) );
};

var updateLayersGroup = function( id, typ, val ) {

	connection.emit ( "group-update-layers", {
	    groupSession: groupSessionID,
	    sessionID: mySessionID,
	    drawingInstruction: {
	        elemID: id,
	        type: typ,
	        value: val
	    }
	} );
};
