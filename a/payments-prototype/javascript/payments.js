String.prototype.capitalize = function(){
   return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
  };


function checkDashboardHeight() {
		if (jQuery.browser.msie == true && jQuery.browser.version == "6.0") { positionElements(); }
		
		var BORDERSTYLE = "1px solid " + $("#os-wrapper").css("border-left-color");
		
		var diff = $("#existing-instruments").outerHeight() - $("#os-wrapper").outerHeight();
		
		switch(true) {
			case (diff >= 0):
				$("#elbow").hide();
				$("#wrapper-BR").show();
				$("#os-wrapper-BR").hide();
				$("#os-wrapper-BL").hide();
				$("#os-wrapper").css("border-bottom", 0 );
				//console.log(">=0");
				break;
			case (diff < 0 && diff >= -15):
				$("#elbow").hide();
				$("#wrapper-BR").show();
				$("#os-wrapper-BR").hide();
				$("#os-wrapper-BL").hide();
				$("#os-wrapper").css("border-bottom", 0 );
				$("#existing-instruments").css("padding-bottom", "15px");
				//console.log("< 0 && >= -15");
				break;
			default: 
				$("#elbow").show();
				$("#wrapper-BR").hide();
				$("#os-wrapper-BR").show();
				$("#os-wrapper-BL").show();
				$("#os-wrapper").css("border-bottom", BORDERSTYLE );
				//console.log("default");
		}	
	}
	
function cardAutoTypeDetect() {
	var type = identifyCard(); //{name: "Master Card", short:"mc"}
	var imgFileName = type.short + '.gif';
	console.log(type);
	
	$(".add-instrument-button").data('card-info', {graphic: imgFileName, nameOnCard:'Andrew Otwell', card:'<strong>' + type.name + '</strong> <span>ending in 7311</span>',expires:'06/2012'});
	
	var e = $('#cc-logo');
	var path = "images/card-logos-small/" + imgFileName;
	if(e.attr("src") != path) {
		e.fadeOut("fast", function(){
			$(this).attr("src", path).fadeIn("fast");
		});
	}
}


function identifyCard() {
  	var cc = $('#newCreditCardNumber')[0].value;
	if(cc.length >=2) {
		$(".maestro_fields:visible").hide();
		var prefix = cc.substring(0,2);
		console.log(prefix);
		if(/^21/.test(prefix)) { return {name: "ABC Bank Card", short: "abc"}};
		if(/^2./.test(prefix)) { return {name: "Citi Bank Card", short: "citi"}};
		if(/^3./.test(prefix)) {return {name: "American Express", short:"amex"}};
		if(/^45/.test(prefix)) {return {name: "Amazon.com Visa", short: "amzn"}};
		if(/^4./.test(prefix)) {return {name: "Visa", short: "visa"}};
		if(/^56/.test(prefix)) {
			$(".maestro_fields").show();
			return {name: "Master Card", short: "mc"};
		}
		if(/^5./.test(prefix)) {return {name: "MasterCard", short: "mc"}};
		if(/^6./.test(prefix)) {return {name: "Discover", short: "discover"}};
		if(/^8./.test(prefix)) {return {name: "Diner's Club", short: "diners"}};
		if(/^99/.test(prefix)) {return {name: "JCB", short: "jcb"}};
		return {short: "blank"};		
	}
}


function handleDashboardRowClick(row) {	
	$("#existing-instruments tr").removeClass("current");
	row.addClass("current").find(":input").attr("checked", "checked");
}

function disableContinueButton(popoverMessage) {
	//disable the "continue" buttons and make them unclickable
	$('.continue_button').unbind('click') //no clicks allowed
		.css({cursor:'not-allowed'})
		.hover(
			function(e){						
				$(".continue-blocker").show().css({top:$(this).offset().top - 30, left:$(this).offset().left - 210});
				if(popoverMessage) { $(".continue-blocker p").html(popoverMessage) };
				$(this).attr("src", "images/buttons/continue-disabled.gif");
			},
			function(){
				$('.continue-blocker').hide();
				$(this).attr("src", "images/buttons/continue.gif");
			}
		);
}

//do we need this one?
function enableContinueButton() {
	$('.continue_button').css({cursor:'default'})
		.unbind('mouseover')
		.unbind('mouseout')
		.click(function(){ alert("That would continue to the next page.") });	
}


/* PAGE INITIALIZATION */

var autoCCType = true;

$(document).ready(function() {	
													 
	//state of the page determines what's shown/hidden by default
	switch($(document).getUrlParam("state")) {
		
		case "blank": 
			$("#existing-instruments table").hide();
			$("#existing-instruments #blankslate").show();
			$("#gc_subtotal").hide();
			$("h1:eq(1)").hide(); //seems redundant to show it in this state
			$("div.payment-method:first").each(function(){ //credit cards come first
				$(this).find(".create").show();
				$(this).find(".offer").hide();
				$(this).find(":input:first").focus();
			});
			disableContinueButton("To continue, please enter your payment information.");
			break;
			
		case "cc-ca": 
			$("#existing-instruments table:gt(1), #gc_subtotal").hide();
			break;
		
		case "pp-offer":
			$("#existing-instruments table:gt(0), #gc_subtotal, #paypal").hide();
			$("#paypal").show();
			break;
			
		case "cc-pp": 
			$("#existing-instruments table:gt(0), #gc_subtotal, #paypal").hide();
			$("#existing-instruments table:eq(2)").show();
			break;
		
		case "one-cc": 
			$("#existing-instruments table:gt(0), #gc_subtotal").hide();
			$("#existing-instruments table:first tr:eq(1)")
							.removeClass("current")
							.siblings("tr")
							.hide();		
			break;
		
		case "gc_only":
			$("<input type='radio' name='pm' />").replaceAll("#existing-instruments :checkbox").click(function(){
				var p = $(this).parents("tr").eq(0);
				handleDashboardRowClick(p);
			});
			//make sure the mockup has a plausible GC balance :-)
			$("#existing-instruments table.balance label").html("Use your <strong>$250.00 Gift and promotional balance</strong>");
			$("#existing-instruments table.balance ul.extended").hide();
			break;
			
		case "gc-incomplete-pp":
			//hide payment methods
			$("#existing-instruments table").hide();
			$("#existing-instruments #blankslate").show();
			$("#gc_subtotal").show();
			//show gc as checkbox
			$("#existing-instruments table.balance").show().find("ul.extended").hide()
			//remove event from gc checkbox?
			disableContinueButton("To continue, please enter your payment information.");
			break;
		
		case "amnesia":
			$("#existing-instruments table").hide();
			$("#amnesia-message").show();
			$("#gc_subtotal").hide();
				$("h1:eq(1)").hide(); //seems redundant to show it in this state
			$("div.payment-method:first").each(function(){ //credit cards come first
				$(this).find(".create").show();
				$(this).find(".offer").hide();
				$(this).find(":input:first").focus();
			});
			disableContinueButton("Because this is the first time you're shipping to this address, re-enter your payment information.");
			break;
		
		case "expired-card":
			var expDateUpdater = "<p>New expiration date:</p><select><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option selected='selected'>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option></select> <select><option>2008</option><option>2009</option><option>2010</option><option>2011</option></select>";
			var deletedCardConfirmation = "<td colspan='5'>Your card was deleted.</td>";
			
			$("td.expires:eq(1)").html("<span class='expired' style='display:block'>Expired 07/2008</span> <a href='#' id='expired-updater'>Update</a> or <a id='expired-deleter' href='#'>Delete</a>" );
			$("#expired-updater").click(function(){
				$("td.expires:eq(1)").html(expDateUpdater);
				$("div.message:eq(0)").hide();
			});
			$("#expired-deleter").click(function() {
				$(this).parents('tr').fadeOut(1500);
			});
			break;
			
		case "plcc":
			$("#existing-instruments table:first tr:last").show(); //plcc is last credit card
			$("#plcc").hide(); 
			break;
			
		case "pcard":
			$("#pcard-input").show();
			break;
			
			
		case "sva":
			$("#existing-instruments table.balance tr:eq(2)").show()
			break;
			
		case "error":
			$("div.message:eq(1)").show();
			break;
		
		case "inlineerror":
			$("div.payment-method:first").each(function(){ //credit cards come first
				$(this).find("div.message").show();
				$(this).find(".create").show();
				$(this).find(".offer").hide();
				$(this).find(":input:not(':image')").css({border: "2px #A31919 solid"});
			});
			break;
		
		case "ib-buyer":
			$("h1:eq(1)").hide(); //seems redundant to show it in this state
			$(".payment-method").hide();
			$(".marketing").hide();
			break;
		
		case "no-cctype-api":
			$("#cctype").show();
			autoCCType = false; //flag to check when binding the auto-cc typing event 
			break;
		
		case "maestro-issue":
			$("#maestro-issue-no").show();
			break;
		
		case "maestro-sd":
			$("#maestro-start-date").show();
			break;
		
		default:
			break;
	}
	
	//should we hide the Order Summary table?
	if ($(document).getUrlParam("hidetable") == "true") {
		$("#order-summary table").hide();
		$("#order-summary div.body").css("paddingTop", "2px");
	}
	
	//for rounded boxes
	checkDashboardHeight();
	//re-run on resize of course
	$(window).resize(function(){
		checkDashboardHeight();
	});

 	//attatch validation to cc input field blur, this needs to be combined with jquery.validation plugin
	if (autoCCType != false) { $('#newCreditCardNumber').blur(cardAutoTypeDetect); } 
	
	/*	delegate click events on dashboard table bodies (except the "balance" table) 
	to handle clicks on table rows. This lets rows act as larger click targets,
	even rows that are added to the DOM later
	*/
	$("#existing-instruments table:not(.balance)").find("tbody").click(function(event) {																	
  	//check click event.target
		var tgt = $(event.target);
		//find tgt's parent tr
		var clickedRow = tgt.parents("tr");
		//set the bg of clickedRow to current
		handleDashboardRowClick(clickedRow);
	});
	

	/* 	delegate click events on dashboard "balance" table bodies to handle
			clicks on dashboard rows that are "balance" payment instruments like a GC
			during the service call to recalc the order total, we stick "loading..." over the summary box.
			protoype does this w/settimeout, real page will do it w/Ajax.
	*/
	$("#existing-instruments table.balance input:checkbox").change(function(event) {
			
		var cb = $(this).attr("name");
		
		$("#order-summary").fadeTo('fast', '0.33');
		$("#os-summary-spinner").show();
					
		//fade order-summary back in after 2.5 seconds
		setTimeout(function(){
			var gc = $("#gc_subtotal");
			var ogt = $("#order-grand-total");
			if(gc.is(":visible")) {
				//hide, set order-grand-total to $224.71
				gc.hide();
				ogt.text("$224.71");
				$("#gc-warning").html("<span style='background-color:#FFFFDD'>Your gift and promotional balance will <b>not</b> be used with this purchase.</span>");
			} else {
				//show, set order-grand-total to 195.71
				gc.show();
				ogt.text("$196.71");
				$("#gc-warning").html("Your gift and promotional balance will be applied to your order when you check out.");
			}
			
			$("#os-summary-spinner").hide();
			checkDashboardHeight();
			$("#order-summary").fadeTo('fast', '1');
			
		}, 2500);
	});
	
	//handlers for adding new payment instruments to the Dashboard
	
	//set some default data for using when we stick the new card into the dashboard
	$(".add-instrument-button").data('card-info', {graphic: 'discover.gif', nameOnCard:'Andrew Otwell', card:'<strong>Discover</strong> <span>ending in 7311</span>',expires:'06/2012'});
	
	//set up the click handler
	$(".add-instrument-button").click(function(event){
		
		//if currently in blankslate state, set up existing-instruments table to receive 1st row
		if($(document).getUrlParam("state") == "blank") {
			$("#blankslate").hide();
			//this prototype can only handle adding stuff to the credit cards table--the first one
			$("#existing-instruments table:first").show().find("tbody tr").hide()
		}
		
		/*  get the data values out of the .data() field of the button. Data is updated elsewehre depending
			on what card type the user chooses 
		*/
		
		var cardInfo = $(this).data('card-info');
		var container = $(this).parents("div.create");
		var uniqueTime = (new Date()).getTime();
		var newhtml = $("<tr><td class='payment-method-selector'><input type='radio' name='pm' id='pm_" + uniqueTime + "'/></td> <td><img src='images/card-logos-small/" + cardInfo.graphic + "'/><td><label for='pm_" + uniqueTime + "'>" + cardInfo.card + "</label></td><td>" + cardInfo.nameOnCard + "</td><td class='expires'>" + cardInfo.expires + "</td></tr>").hide();	
		
		//add the new payment instrument to the Dashboard, scrolling up there first if necessary
		$(this).replaceWith("<p class='spinner'><img src='images/assets/spinner.gif' /> Please wait... </p>");
		
		//pause, then respond to click
		setTimeout(function(){
			if ($(window).scrollTop() != 0) {
				$('html,body').animate({scrollTop: "0px"}, 1000, function() {										
					newhtml.insertBefore("#existing-instruments table:first tbody tr:first").fadeIn(1300);
				});
			} else {
				newhtml.insertBefore("#existing-instruments table:first tbody tr:first").fadeIn(1300);
			}
			
			handleDashboardRowClick(newhtml);
			enableContinueButton();	
			//dashboard might have crossed the threshold
			checkDashboardHeight();
			//cleanup: close the "create" form state and go back to the regular "offer" state
			container.fadeOut("fast").siblings("div.offer").show();
			$(".continue_button:eq(0)").focus();
		}, 2500);
	});
	
	
	$("#gc_entry .apply").click(function() {
		//scroll to top if needed, then fade order-summary during server process
		if ($(window).scrollTop() != 0) {
			$('html,body').animate({scrollTop: "0px"}, 1000, function() {										
				$("#order-summary").fadeTo('fast', '0.33');
				$("#os-summary-spinner").show();
			});
		} else {
			$("#order-summary").fadeTo('fast', '0.33');
			$("#os-summary-spinner").show();
		}
		
		//store & clear text input before entering the timeout
		var code = $(this).prev("input").val();
		$(this).prev("input").val('');
		
		//fade order-summary back in after 2.5 seconds
		setTimeout(function(){
			$("#os-summary-spinner").hide();
			
			//check what was entered in the text input 
			if(/^ABCD/.test(code)) { //gc code
				$("table.balance:hidden, #gc_subtotal:hidden").show();
				$("ul.extended").hide();
			} else if (code == "1234") {
				$("ul.extended, #promo_subtotal:hidden").show();
			}
			
			checkDashboardHeight();
			$("#order-summary").fadeTo('fast', '1');
			
		}, 2500);
	});
	
	
	
	//toggle-create buttons 
	$("div.offer .toggle-create").click(function() {													 
		$(this).parents("div.offer").hide().siblings("div.create").show().find(":input:first").focus();
		return false;
	});
	
});

//toggle Order Summary visibility with fade
function toggleOrderSummary(){
	$("#order-summary").fadeTo('fast', '0.33');
	$("#os-summary-spinner").show();

	//fade order-summary back in after 2.5 seconds
	setTimeout(function(){
		$("#order-summary div.body table").toggle();
		$("#os-summary-spinner").hide();
		checkDashboardHeight();
		$("#order-summary").fadeTo('fast', '1');
	}, 1000);
}
