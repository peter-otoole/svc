var updatesShownCondition = false,
	updatesData = "",
	inGroupSession = false,
	vdrawData="",
	myName="";

$(document).ready(function(){
	
	$( "#main-content" ).load( "../html/home.html",  function(res, status, header) {
		if( header.status === 200 ){
			
			$("#private-session").click(function(){
				openNewCanvasDialog();
			});
			$( "#group-session" ).click(function(){
				openGroupSession();
			});
			$( "#message-friend" ).click(function(){
				messageAFriend();
			});
			$( "#find-friends" ).click(function(){
				extendFriendRequest();
			});
			$( "#view-drawings" ).click(function(){
				viewDrawings();	
			});
			$( "#banner_logo-img" ).click(function() {
				if(inGroupSession){
					$.ajax({type: "POST", url:"/leave-group-session/", data: {session: $("#group-session-session-id").html()}, async:false}).done(function() {
						location = "/";
					});
				}else{
					location = "/";
				}
			});
			$( "#banner_title" ).click(function() {
				if(inGroupSession){
					$.ajax({type: "POST", url:"/leave-group-session/", data: {session: $("#group-session-session-id").html()}, async:false}).done(function() {
						location = "/";
					});
				}else{
					location = "/";
				}
			});
			$( "#banner_log-out" ).click(function() {
				if(inGroupSession){
					$.ajax({type: "POST", url:"/leave-group-session/", data: {session: $("#group-session-session-id").html()}, async:false}).done(function() {
						$.post( "/sign-out/", {}, function(){	location = "/";	}); 
					});
				}else{
					$.post( "/sign-out/", {}, function(){	location = "/";	}); 
				}	
			});	
			$(window).unload(function() {
				if(inGroupSession){
					$.ajax({type: "POST", url:"/leave-group-session/", data: {session: $("#group-session-session-id").html()}, async:false}).done(function() {});
				}
			});
			window.onbeforeunload = function(){
				if(inGroupSession){
					$.ajax({type: "POST", url:"/leave-group-session/", data: {session: $("#group-session-session-id").html()}, async:false}).done(function() {
						$.post( "/sign-out/", {}, function(){	location = "/";	}); 
					});
				}else{
					$.post( "/sign-out/", {}, function(){	location = "/";	}); 
				}	
			};
			$( "#banner_updates-button" ).click(function() {
				openUpdatesMenu();		
			});	
			$( "#updates-background-cover" ).click(function() {
				openUpdatesMenu();	
			});	
			
			initDrawingCanvas();
			getUpdates();
			setInterval(function(){getUpdates();},20000);
			myName = $("#res-my-name").html();
			
		}else if( header.status === 403 ){
			if(header.statusText === "redirect"){
				location = "/";
			}
		}
	});		
});

var loadNewDrawing = function(conHandle){
	$.post( "/get-random-drawing/", {}).done(function(data) {
		var drawingInstructions = jQuery.parseJSON(data.data);
		drawFull(conHandle,drawingInstructions);
	}).fail(function() {});
};

var initDrawingCanvas = function(){
	
	var canvasHandle = $("#drawing-canvas").get(0);
	var	canContext = canvasHandle.getContext('2d'); 
	canContext.rect(0,0,700,700);
    canContext.fillStyle = '#FFFFFF';
    canContext.fill();
	loadNewDrawing(canContext);
};

var viewDrawingsLoad = function(canCon, currID){
	$.post( "/get-my-drawing/", {id:currID}).done(function(data) {
		if(data.present){
			var drawingInstructions = jQuery.parseJSON(data.data);
			vdrawData = new viewDrawingData();
			vdrawData.init(data.id, data.name, data.date, drawingInstructions,data.shared);
			drawFull(canCon,drawingInstructions);
		}else{
			failedToOpenViewDrawings();
		}
	}).fail(function() {failedToOpenViewDrawings();});
};

var failedToOpenViewDrawings = function (){
	
	$(".dialog-window").html( $("#dialog-window-view-my-drawings-no-drawings").html() );
	$(".dialog-window").css("visibility", "visible");
	$(".dialog-window").css("opacity", "0");
	$(".dialog-window" ).fadeTo( 400, 1.0 );
	$( ".dialog-window-backdrop" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( ".dialog-window-top-exit" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( "#dialog-window-close-button" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});	
};

var viewDrawingData = function(){
	
	this.id;	this.name;
	this.date;	this.data;
	this.pubshare;
	
	this.init = function(id,name,date,data,publ){
		
		this.id = id;		this.name = name;
		this.date = date;	this.data = data;
		this.pubshare = publ;
	};

};

var viewDrawings = function(){
	
	$.post( "/get-my-drawing/", {id:0}).done(function(data) {
		if(data.present){
			$(".dialog-window").html( $("#dialog-window-view-my-drawings").html() );
			$(".dialog-window").css("visibility", "visible");
			$(".dialog-window").css("opacity", "0");
			$(".dialog-window" ).fadeTo( 400, 1.0 );
			$( ".dialog-window-backdrop-large" ).click(function() {
				$(".dialog-window" ).fadeTo( 400, 0.0 );
				setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
			});
			$( ".dialog-window-top-exit-large" ).click(function() {
				$(".dialog-window" ).fadeTo( 400, 0.0 );
				setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
			});
			var canvasHandle = $("#view-drawings-canvas").get(0);
			var	canContext = canvasHandle.getContext("2d");
			var currID = 0;
			canContext.rect(0,0,700,700);
			canContext.fillStyle = "#FFFFFF";
			canContext.fill();
			viewDrawingsLoad(canContext, currID);
			$( ".message-dialog-large-left").click(function(){
				canContext.clearRect(0,0,700,700);
				canContext.rect(0,0,700,700);
				canContext.fillStyle = "#FFFFFF";
				canContext.fill();
				currID--;
				viewDrawingsLoad(canContext, currID);
			});
			$( ".message-dialog-large-right").click(function(){
				canContext.clearRect(0,0,700,700);
				canContext.rect(0,0,700,700);
				canContext.fillStyle = "#FFFFFF";
				canContext.fill();
				currID++;
				viewDrawingsLoad(canContext, currID);
			});
			
			$( "#view-my-drawings-share-button").click(function(){
				shareDrawing(canvasHandle);
			});
			
			$( "#view-my-drawings-edit-button").click(function(){
				editSelectedDrawing(vdrawData.id,vdrawData.name,vdrawData.data,vdrawData.pubshare);
			});
			
			$( "#view-my-drawings-delete-button").click(function(){
				$.post( "/delete-my-drawing/",{id:vdrawData.id}).done(function(){}).fail(function(){alert("Failed");/*Reimplement*/});
				canContext.clearRect(0,0,700,700);
				canContext.rect(0,0,700,700);
				canContext.fillStyle = "#FFFFFF";
				canContext.fill();
				viewDrawingsLoad(canContext, currID);
			});
		}else{
			failedToOpenViewDrawings();
		}
	}).fail(function() {
		failedToOpenViewDrawings();
	});
};

var shareDrawing = function(canvasHandle){

	var img = canvasHandle.toDataURL("image/png");
	$.post( "/share-drawing-publicly/", {data:img}).done(function(res, status, header) {
		if( header.status === 200 ){
			location = res.url;
		}else if( header.status === 403 ){
			location = "/";
		}
	}).fail(function(header){ 
	});
};

var editSelectedDrawing = function(id,name,data,shared){
	
	$(".dialog-window" ).fadeTo( 400, 0.0 );
	setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	$("#res-drawing-name-holder" ).html( name );
	$( "#main-content" ).load( "../html/private-drawing.html", function(res, status, header) {
		if( header.status === 200 ){
			initPrivateSession();
			currentDrawing.drawingSequence = data;
			currentDrawing.id = id;
			currentDrawing.publicShare = shared;
			$("#share-publicly-allowed").prop("checked", shared);
			drawFull(canContext, data);
		}else if( header.status === 403 ){
			location = "/";
		}
	});
};

var openFriendRequestResponseDialog = function(index){
	var id = updatesData[index].id,
		name = updatesData[index].fname+" "+updatesData[index].lname+" ("+updatesData[index].emailaddress+")",
		email = updatesData[index].emailaddress,
		message = updatesData[index].messagetext;
	openUpdatesMenu();
	$.post( "/updates-set-seen/", {id:id,email:email});
	$(".dialog-window").html( $("#dialog-window-reply-to-friend-request").html() );
	$(".dialog-window").css("visibility", "visible");
	$(".dialog-window").css("opacity", "0");
	$(".dialog-window" ).fadeTo( 400, 1.0 );
	$("#dialog-window-friend-request-reply-from-header").html("From: "+name);
	$("#dialog-window-friend-request-reply-text").html(message);
	$( ".dialog-window-backdrop" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( ".dialog-window-top-exit" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( "#dialog-window-accept-button" ).click(function() {
		
		$.post( "/friend-request-response/", {	id:id, email:email,	accept:true
		}).done(function(res, status, header) {
			$(".dialog-window" ).fadeTo( 400, 0.0 );
			setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
		}).fail(function(header){ 
			$(".dialog-window" ).fadeTo( 400, 0.0 );
			setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
		});
	});	
	$( "#dialog-window-decline-button" ).click(function() {
		$.post( "/friend-request-response/", {	id:id,
												email:email,
												accept:false
		}).done(function(res, status, header) {
			$(".dialog-window" ).fadeTo( 400, 0.0 );
			setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
		}).fail(function(header){ 
			$(".dialog-window" ).fadeTo( 400, 0.0 );
			setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
		});
	});	
};

var openMessageDialog = function(index){
	var id = updatesData[index].id,
		name = updatesData[index].fname+" "+updatesData[index].lname+" ("+updatesData[index].emailaddress+")",
		email = updatesData[index].emailaddress,
		message = updatesData[index].messagetext;
	openUpdatesMenu();
	$.post( "/updates-set-seen/", {id:id,email:email});
	$(".dialog-window").html( $("#dialog-window-view-message").html() );
	$(".dialog-window").css("visibility", "visible");
	$(".dialog-window").css("opacity", "0");
	$(".dialog-window" ).fadeTo( 400, 1.0 );
	$("#dialog-window-view-message-from-header").html("From: "+name);
	$("#dialog-window-view-message-text").html(message);
	
	$( ".dialog-window-backdrop" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( ".dialog-window-top-exit" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( "#dialog-window-close-button" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});	
};

var joinGroupSession = function(index){
	
	var id = updatesData[index].id,
		name = updatesData[index].fname+" "+updatesData[index].lname+" ("+updatesData[index].emailaddress+")",
		email = updatesData[index].emailaddress,
		session = updatesData[index].messagetext;
	openUpdatesMenu();
	$.post( "/updates-set-seen/", {id:id,email:email});
	
	$(".dialog-window").html( $("#dialog-window-join-group-session-original").html() );
	$(".dialog-window").css("visibility", "visible");
	$(".dialog-window").css("opacity", "0");
	$(".dialog-window" ).fadeTo( 400, 1.0 );
	$("#dialog-window-group-invite-from-header").html("From: "+name);
	$("#dialog-window-group-invite-message").html("Invited you to join a group session");
	
	$( ".dialog-window-backdrop" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( ".dialog-window-top-exit" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( "#dialog-window-close-button" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});	
	
	$( "#dialog-window-submit-button" ).click(function() {
		
		inGroupSession = true;
		
		$( "#main-content" ).load( "../html/group-drawing.html", function(res, status, header) {
			if( header.status === 200 ){
				initPrivateSession();
				$("#group-session-session-id").html(session);
			}else if( header.status === 403 ){
				location = "/";
			}
		});
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
};

var openUpdatesMenu = function(){
	
	getUpdates(function(){
		if(updatesShownCondition){
			updatesShownCondition = false;
			$("#updates-place-holder").css("height", "300px");
			$("#updates-holder").hide( "blind", {direction: "vertical"}, 600 ); 
			$("#updates-background-cover").css("visibility", "hidden");
			$("#banner_updates-button").css("background-color","rgba(255,255,255,0.2)");
		}else{
			updatesShownCondition = true;
			$("#updates-holder").hide(); 
			$("#updates-holder").css("visibility", "visible");
			$("#updates-place-holder").css("height", "5px");
			$("#updates-holder").parent().append($("#updates-holder"));
			$("#updates-holder").show( "blind", {direction: "vertical"}, 600 ); 
			$("#updates-background-cover").css("visibility", "visible");
			$("#banner_updates-button").css("background-color","rgba(255,255,255,0.2)");
		}
	});
};

var getUpdates = function(callback){

	$.post( "/get-updates/", {}).done(function(data, status, header) {
		
		if($("#res-number-of-updates").html() === "" ){
			$("#res-number-of-updates").html(data.length);
			//if unseen element, highlight red and stay dark red
			var first = true;
			for(var i=0; i<data.length; i++){
				if( !(data[i].seen) ){
					first = false;
					$("#banner_updates-button").effect("highlight", {color:"rgba(255,0,0,1.0);"}, 500);
					setTimeout(function(){ $("#banner_updates-button").css("background-color","rgba(255,0,0,0.2)"); }, 550);
				}
			}
		}else{
			if( $("#res-number-of-updates").html() === data.length+"" ){
			}else{
				$("#res-number-of-updates").html(data.length);
				//highlight red and stay dark red
				$("#banner_updates-button").effect("highlight", {color:"rgba(255,0,0,1.0);"}, 500);
				setTimeout(function(){ $("#banner_updates-button").css("background-color","rgba(255,0,0,0.2)"); }, 550);
			}
		}
		
		var html = "<div class='updates-main'><div class='updates-header'>Updates</div>";
		var classValue = "updates-text";
		for(var i=0; i<data.length; i++){
			html += "<div class='updates-separator'></div>"
			if( data[i].seen ){
				classValue = "updates-text-seen";
			}else{
				classValue = "updates-text";
			}
			updatesData = data;
			if( data[i].messagetype === "friend-request" ){
				html += "<div onclick=\"openFriendRequestResponseDialog("+i+")\" class=\""+classValue+"\">"+data[i].fname+" "+data[i].lname+" ("+data[i].emailaddress+")<br><div class='updates-text-separator' ></div>"+data[i].messagetext+"</div>";
			}else if( data[i].messagetype === "message" ){
				html += "<div onclick=\"openMessageDialog("+i+")\" class=\""+classValue+"\">"+data[i].fname+" "+data[i].lname+" ("+data[i].emailaddress+")<br><div class='updates-text-separator' ></div>Sent you a message</div>";				
			}else if( data[i].messagetype === "groupinvite" ){
				html += "<div onclick=\"joinGroupSession("+i+")\" class=\""+classValue+"\">"+data[i].fname+" "+data[i].lname+" ("+data[i].emailaddress+")<br><div class='updates-text-separator' ></div>Invited you to join a group session</div>";	
			}
		}
		html += "<div class='updates-separator'></div></div>";
		$("#updates-holder").html(html);
		if(callback){
			callback();
		}
	}).fail(function(header){ 
		if(header.status === 404){
			location = "/";
		}else if(header.responseText === "redirect" ) {
			location = "/";	
		}
	});
};

var messageAFriend = function(){
	$.post( "/get-friends-list/", {	}).done(function(res, status, header) {
		var selectorText = "<option value='-'>Select A Friend</option>";
		var friends = header.responseJSON;	
		for(var i=0; i<friends.length; i++){
			selectorText += "<option value='"+friends[i].id+"'>"+friends[i].fname+" "+friends[i].lname+" ("+friends[i].emailaddress+") </option>"
		}	
		$("#message-to-friend-friend-selection").html(selectorText);
		$(".dialog-window" ).html( $( "#dialog-window-message-friend-original-html" ).html() );	
		$(".dialog-window").css("visibility", "visible");
		$(".dialog-window").css("opacity", "0");
		$(".dialog-window" ).fadeTo( 400, 1.0 );
		$( ".dialog-window-backdrop" ).click(function() {
			$(".dialog-window" ).fadeTo( 400, 0.0 );
			setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
		});
		$( ".dialog-window-top-exit" ).click(function() {
			$(".dialog-window" ).fadeTo( 400, 0.0 );
			setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
		});
		$( "#dialog-window-close-button" ).click(function() {
			$(".dialog-window" ).fadeTo( 400, 0.0 );
			setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
		});	
		$( "#dialog-window-submit-button" ).click(function() {
			
			if( $("#message-to-friend-friend-selection").find(":selected").val() === "-" ){
				$("#message-to-friend-friend-selection").effect("highlight", {color:"rgba(255,0,0,0.1);"}, 500);
			}else{
				$.post( "/send-message-to-friend/", {friendID: $("#message-to-friend-friend-selection").find(":selected").val(), message: $("#message-to-friend-text-area").val() }
				).done(function(data, st, resHead) {
					$( ".dialog-window" ).html( $( "#dialog-window-message-friend-success" ).html() );
					$( ".dialog-window-top-exit" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
					$( "#dialog-window-close-button" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
					$( ".dialog-window-backdrop" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
				}).fail(function(header) { 		
					if(header.responseText === "failed"){					
						$( ".dialog-window" ).html( $( "#dialog-window-message-friend-failure" ).html() );
						$( ".dialog-window-top-exit" ).click(function() {
							$(".dialog-window" ).fadeTo( 400, 0.0 );
							setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
						});
						$( "#dialog-window-close-button" ).click(function() {
							$(".dialog-window" ).fadeTo( 400, 0.0 );
							setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
						});
						$( ".dialog-window-backdrop" ).click(function() {
							$(".dialog-window" ).fadeTo( 400, 0.0 );
							setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
						});
					}else if(header.responseText === "redirect" ) {
						location = "/";
					}
				});
			}
		});	
	}).fail(function(header){ 
	
		if(header.status === 404){
			location = "/";
		}else{
			if(header.responseText === "failed"){					
				$( ".dialog-window" ).html( $( "#dialog-window-message-friend-cannot-get-friends" ).html() );
				$( ".dialog-window-top-exit" ).click(function() {
					$(".dialog-window" ).fadeTo( 400, 0.0 );
					setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
				});
				$( "#dialog-window-close-button" ).click(function() {
					$(".dialog-window" ).fadeTo( 400, 0.0 );
					setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
				});
				$( ".dialog-window-backdrop" ).click(function() {
					$(".dialog-window" ).fadeTo( 400, 0.0 );
					setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
				});
			}else if(header.responseText === "redirect" ) {
				location = "/";
			}	
		}
	});
};

var extendFriendRequest = function(){

	$(".dialog-window" ).html( $( "#dialog-window-extend-friend-request-original-html" ).html() );	
	$(".dialog-window").css("visibility", "visible");
	$(".dialog-window").css("opacity", "0");
	$(".dialog-window" ).fadeTo( 400, 1.0 );
	$( ".dialog-window-backdrop" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( ".dialog-window-top-exit" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( "#dialog-window-close-button" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});	
	$( "#dialog-window-submit-button" ).click(function() {
		if( isValidEmailAddress($.trim($("#friend-request-friend-email").val())) ){
			$.post( "/extend-friend-request/", {friendemail: $("#friend-request-friend-email").val()
			}).done(function(data, st, resHead) {
				$( ".dialog-window" ).html( $( "#dialog-window-extend-friend-request-success" ).html() );
				$( ".dialog-window-top-exit" ).click(function() {
					$(".dialog-window" ).fadeTo( 400, 0.0 );
					setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
				});
				$( "#dialog-window-close-button" ).click(function() {
					$(".dialog-window" ).fadeTo( 400, 0.0 );
					setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
				});
				$( ".dialog-window-backdrop" ).click(function() {
					$(".dialog-window" ).fadeTo( 400, 0.0 );
					setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
				});
			}).fail(function(header) { 		
				if(header.responseText === "failed"){					
					$( ".dialog-window" ).html( $( "#dialog-window-extend-friend-request-failed" ).html() );
					$( ".dialog-window-top-exit" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
					$( "#dialog-window-close-button" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
					$( ".dialog-window-backdrop" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
				
				}else if(header.responseText === "redirect" ) {
					location = "/";
				}
			});
		}else{
			$("#friend-request-friend-email").effect("highlight", {color:"#FF0000"}, 500); 
		}
	});
};

var openGroupSession = function(){
	var numOfFriends = 0;
	$(".dialog-window" ).html( $( "#dialog-window-invite-more-friends" ).html() );	
	$(".dialog-window").css("visibility", "visible");
	$(".dialog-window").css("opacity", "0");
	$(".dialog-window" ).fadeTo( 400, 1.0 );
	$( ".dialog-window-backdrop" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( ".dialog-window-top-exit" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( "#dialog-window-close-button" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});	
	$.post( "/get-friends-list/", {	}).done(function(res, status, header) {
		var friendsHTML = "<table class=\"invite-friends-selector-table\">";
		var friends = header.responseJSON;
		numOfFriends = friends.length;
		for(var i=0; i<friends.length; i++){
			if( !( i & 1 ) ){
				friendsHTML += "<tr class=\"invite-friends-selector-row\">";
			}
			friendsHTML += "<td class=\"invite-friends-selector-text\">"+friends[i].fname+" "+friends[i].lname+"</td><td><input value=\""+friends[i].id+"\"id=\"select-friends-"+i+"\" type=\"checkbox\" name=\"select-friends\"></td>";
			if( ( i & 1 ) ){
				friendsHTML += "</tr>";
			}
		}	
		friendsHTML += "</table>";
		$("#invite-friends-main-container").html(friendsHTML);
	}).fail(function(header){ 
		location = "/";
	});
	$( "#dialog-window-submit-button" ).click(function() {	
		$.post( "/start-group-session/", {}).done(function(sessionID) {
			for(var i=0; i<numOfFriends; i++){
				if( $("#select-friends-"+i).is(":checked") ){
					$.post( "/invite-friend-to-group/", {friendID: $("#select-friends-"+i).val(), groupSession: sessionID} );
				}
			}
			inGroupSession = true;
			$( "#main-content" ).load( "../html/group-drawing.html", function(res, status, header) {
				if( header.status === 200 ){
					initPrivateSession();
					$("#group-session-session-id").html(sessionID);
				}else if( header.status === 403 ){
					location = "/";
				}
			});
			$(".dialog-window" ).fadeTo( 400, 0.0 );
			setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
		}).fail(function(header){ 
			if(header.status === 404){
				location = "/";
			}else{
				if(header.responseText === "failed"){	
					$( ".dialog-window" ).html( $( "#dialog-window-group-session-failed" ).html() );
					$( ".dialog-window-top-exit" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
					$( "#dialog-window-close-button" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
					$( ".dialog-window-backdrop" ).click(function() {
						$(".dialog-window" ).fadeTo( 400, 0.0 );
						setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
					});
				}else if(header.responseText === "redirect" ) {
					location = "/";
				}	
			}
		});	
	});
};

var openInviteFriendsDialog = function(){
	var numOfFriends = 0;
	$(".dialog-window" ).html( $( "#dialog-window-invite-more-friends" ).html() );	
	$(".dialog-window").css("visibility", "visible");
	$(".dialog-window").css("opacity", "0");
	$(".dialog-window" ).fadeTo( 400, 1.0 );
	$( ".dialog-window-backdrop" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( ".dialog-window-top-exit" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
	$( "#dialog-window-close-button" ).click(function() {
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});	
	$.post( "/get-friends-list/", {	}).done(function(res, status, header) {
		var friendsHTML = "<table class=\"invite-friends-selector-table\">";
		var friends = header.responseJSON;
		numOfFriends = friends.length;
		for(var i=0; i<friends.length; i++){
			if( !( i & 1 ) ){
				friendsHTML += "<tr class=\"invite-friends-selector-row\">";
			}
			friendsHTML += "<td class=\"invite-friends-selector-text\">"+friends[i].fname+" "+friends[i].lname+"</td><td><input value=\""+friends[i].id+"\"id=\"select-friends-"+i+"\" type=\"checkbox\" name=\"select-friends\"></td>";
			if( ( i & 1 ) ){
				friendsHTML += "</tr>";
			}
		}	
		friendsHTML += "</table>";
		$("#invite-friends-main-container").html(friendsHTML);
	}).fail(function(header){ 
		location = "/";
	});
	$( "#dialog-window-submit-button" ).click(function() {	
		for(var i=0; i<numOfFriends; i++){
			if( $("#select-friends-"+i).is(":checked") ){
				$.post( "/invite-friend-to-group/", {friendID: $("#select-friends-"+i).val(), groupSession: groupSessionID} );
			}
		}
		$(".dialog-window" ).fadeTo( 400, 0.0 );
		setTimeout(function(){ $(".dialog-window").css("visibility", "hidden"); }, 400);
	});
};

var openNewCanvasDialog = function(){

	$( "#main-content" ).load( "../html/private-drawing.html", function(res, status, header) {
	
		if( header.status === 200 ){
		
			initPrivateSession();
		}else if( header.status === 403 ){
		
			location = "/";
		}
	});
};

var isValidEmailAddress = function(emailAddress) {

    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
   
	return pattern.test(emailAddress);
};
