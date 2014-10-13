var connection,
	mySessionID,
	groupSessionID,
	messagesDialogOpen = true;

var openCloseMessages = function(){

	if(messagesDialogOpen){
		messagesDialogOpen = false;
		$("#messages-open-temp-holder").html( $("#messages-place-holder").html() );	
		$("#messages-place-holder").html( $("#messages-closed").html() );
	}else{
		messagesDialogOpen = true;
		$("#messages-place-holder").html( $("#messages-open-temp-holder").html() );	
		$("#messages-open-temp-holder").html("");
		$("#messages-main-view").animate({ scrollTop: $("#messages-content-view").height() }, 450 );
	}
};

var sendGroupMessage = function(){
	
	var text = $("#group-message-input").val();
	$("#group-message-input").val("");
	var messageShape = new groupChatMessageShape();
	messageShape.initialise(myName,text);
	recordShape(messageShape);
};
	
$(document).ready(function(){
	
	isGroupSession = true;

	$("#nav-invite-friends-button").css("visibility", "visible");
	
	$( "#nav-invite-friends-button" ).click(function(){
		clearSelections();
		currShapeSelected = "";
		openInviteFriendsDialog();	
	});
	
	//get my session ID
	$.post( "/get-my-session-id/", {}).done(function(data) {	
		mySessionID = data.session;
		groupSessionID = $("#group-session-session-id").html();	
	}).fail(function(header) {
		location = "/";
	});
	setTimeout(function(){ 
		//connect to server over socket io
		connection = io.connect("http://127.0.0.1:8080/communication/");
		
		//add to group[ sesion
		connection.on("accepted", function() {
			connection.emit("init", {groupSession: groupSessionID, userSession: mySessionID});
			connection.on("user-added", function(data) {
				if( data === "ok" ){
					connection.emit("get-full-drawing", {groupSession: groupSessionID} );
					connection.on("draw-full-drawing", function(data){
						currentDrawing.setDrawingSequence(data.data.drawingInstructions.drawingSequence);
						clearCanvas(canContext);
						drawFull(canContext,currentDrawing.getJSON());
					});
				}else{
					location = "/";
				}
			});
		});
		
		connection.on("draw-this", function(data) {
			
			if( data.drawingInstruction.shape === "groupmessage" ){
				currentDrawing.addShape(data.drawingInstruction);
				$("#messages-content-view").append( "<div class=\"messages-message-text\">"+data.drawingInstruction.sender+": "+data.drawingInstruction.text+"</div>" );
				if( !scrollRecent ){
					scrollRecent = true;
					$("#messages-main-view").animate({ scrollTop: $("#messages-content-view").height() }, 500 );
					setTimeout(function(){ scrollRecent = false; }, 500);
				}else{
					$("#messages-main-view").animate({ scrollTop: $("#messages-content-view").height() }, 1 );
				}
				$("#messages-main-view").animate({ scrollTop: $("#messages-content-view").height() }, 450 );
				if( !(messagesDialogOpen) ){
					openCloseMessages();
				}
				
			}else{
				var instructions = new Array();
				instructions.push(data.drawingInstruction);
				currentDrawing.addShape(data.drawingInstruction);
				drawFull(canContext, instructions);
			}
		});
		
		connection.on("update-layer", function(data) {
			var id = data.drawingInstruction.elemID,
				type = data.drawingInstruction.type,
				value = data.drawingInstruction.value;
			if( type === "visible" ){
				currentDrawing.drawingSequence[id].visible = value;
			}else if( type === "filled" ){
				currentDrawing.drawingSequence[id].filled = value;
			}else if( type === "lWidth" ){
				currentDrawing.drawingSequence[id].lWidth = value;
			}else if( type === "colour" ){
				currentDrawing.drawingSequence[id].colour = value;
			}
			refreshCanvas();
		});
		
		connection.on("clear-canvas", function(data) {
			clearDrawingDataFromServer();
		});
		
		connection.on("request-full-drawing", function(data){
			connection.emit("get-full-drawing", {drawingInstructions: currentDrawing});
		});		
	}, 100);
});













