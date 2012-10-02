var SPC  = {
	primeOn: function(){
		$('#navLogoSecondary').removeClass("nonPrime").addClass("prime");
		$("#faq ul").prepend("<li style='color:#333'><b>Amazon Prime Shipping has been applied to the eligible items in your order</b></li>");
		this.isPrime = true;
	},
	primeOff:function() {
		$('#navLogoSecondary').removeClass("prime").addClass("nonPrime");
		this.isPrime = false;
	},
	loadMainContent: function(jsonURL) {
		$.getJSON(jsonURL, function(json) {	
			
			$("#tpl-vendor-group").jqote(json).prependTo("#purchase-context");
			
			//default formatting the currency on the page.
			$('#purchase-context .price').formatCurrency();
			
			//hide the bototm "place order" button if everything fits on one screen 
			if($("#bd").height() < 500) { 
				$("#bottom-place-order").hide();
			}
			
			 //$("#alert-tab").trigger("scroll");
			
			//yes, this is called twice on each page load, one here and once in SPC.loadOrderSummary
			SPC.positionInfoCallout();
			
			SPC.renderingDone();
		});
	},
	updateMainContent: function(jsonURL) {
		$("#purchase-context").showLoadingSpinner({
			onLoadingDone: function(){
			    this.html("");
			    SPC.loadMainContent(jsonURL);
			}
		});
	},
	loadOrderSummary: function(jsonURL) {
		//Render templte for Order Summary data and do some content fiddling
		$.getJSON(jsonURL, function(json) {
			$("#tpl-order-summary").jqote(json).prependTo("#order-summary div.os-content");
				
			//in TFX state, re-price in EUR and set up links and stuff.
			if (json.tfx) {
				console.log("tfx...");
				$('#order-summary .price').formatCurrency({ region: 'de-DE' });
				$(".place-order-button img").attr("src", "images/place-order-eur.gif");
				
				$('#tfx-conversion-trigger').click(function() {
					$("#tfx-conversion").show();
					$(this).hide();
				});
				$("#tfx-currency-switcher-trigger").click(function() {
					$("#tfx-currency-switcher").show();
					$(this).hide();
				});
				$("#tfx-currency-switcher input").click(function() {
					$(".place-order-button img").attr("src", "images/place-order-" + $(this).val() + ".gif");
					status = $(".tfx-message h5 b");
					if (status.html() == "Enabled") {
						status.html("Disabled");
					} else {
						status.html("Enabled");
					}
				});
			} else {
				$('#order-summary .price').formatCurrency({ negativeFormat: '-%s%n'});
			}
			SPC.positionInfoCallout();
			SPC.updateTotalUnits();
		});
	},
	renderingDone: function(){
		//function that gets set elsewhere as a generic "do more stuff" step after main content area rendering is done 
	},
	positionInfoCallout: function(){
		var orderSummaryBottom = $("#order-summary").height() + $("#order-summary").offset().top;
		var vendorGroupTop = $(".vendor-group:first").offset().top;
		var offset = ($.browser.safari) ? 20 : 5;

		$(".info-callout:first").css("top", orderSummaryBottom - vendorGroupTop + offset);
	},
	updateTotalUnits: function(){
		var sum = 0;
		$("#purchase-context p.quantity span").each(function(){
		    sum += parseInt(this.innerHTML, 10);
		});
		$("#units-total").html(sum);
	}
};


SPC.quantityEdit = {
	currentASIN: null,
	show: function(element){
		//set currentASIN in case we need to delete it 
		this.currentASIN = element.closest("div.asin");
		
		//figure out the current quantity and put it in the edit field
		this.currentQuantity = this.currentASIN.find("p.quantity span");
		this.field.val(parseInt(this.currentQuantity.html(),10));

		var ypos = $(element).offset().top - 4;
		var xpos = $(element).offset().left - 130;
		
		this.el.css({
			top: ypos,
			left:xpos,
		    display: 'block'
		})
		.animate({
		   opacity: 1
		}, 300, 'swing');
	
	},
	hide: function(){
		if (this.field.val()) {
			this.currentQuantity.html(this.field.val());
		}
		this.el.animate({
		   opacity: 0
		}, 300, 'swing');
		$("#order-summary").showLoadingSpinner({
				onLoadingDone: function(){
					SPC.updateTotalUnits();
				}
		});		
	},
	deleteASIN: function(e){
		var currentASINtitle = this.currentASIN.find("h4").text();
		var successMessage = "<div class='message success' style='margin:0 20px 20px 20px'><span class=''></span><h6>Item removed</h6><p><b>" + currentASINtitle + "</b> was removed from your order and placed on your Saved for Later list. <a href='#'>Undo</a></p>";
		
		this.hide();
		
		this.currentASIN.fadeOut(1000, function(){
			$(this).before(successMessage);
		});
		e.preventDefault();
	},
	init: function() {
		this.el = $("#quantity-edit");
		this.field = $("#new-quantity");
		this.el.css("opacity", 0);
		$("img", this.el).click(function(){
			SPC.quantityEdit.hide();
		});
		$("#delete-quantity", this.el).click(function(e) {
			SPC.quantityEdit.deleteASIN(e);
		});
	}	
};

SPC.alertTab = {
	init: function(){
		this.tab = $("#alert-tab");
		console.log("init");

		//this element doesn't actually scroll, so window.scroll is a proxy for it
		this.tab.bind('scroll', function(event) {
			var elem = $("div.vendor-group:last"); //needs to be dynamic..
			
			if ($(elem).offset() !== null) {
				var windowTop = $(window).scrollTop();
			    var windowBottom = windowTop + $(window).height();

			    var elemTop = $(elem).offset().top;
			    var elemBottom = elemTop + $(elem).height();

			    if ((elemBottom >= windowTop) && (elemTop <= windowBottom)) {
					SPC.alertTab.hide();
				} else {
					SPC.alertTab.show();
				}
			}
		});
		
		$(window).scroll(function() {
			SPC.alertTab.tab.trigger("scroll");
		});
	},
	hide: function() {
		this.tab.fadeOut(750);
	},
	show: function(){
		this.tab.fadeIn(750);
	}
};

Lightbox = {
	init: function(){
		this.lightbox = $("#lightbox");
		this.lightbox.find("h3 span").click(function() {
			Lightbox.hide();
		});
		return this;
	},
	hide: function() {
		this.lightbox.fadeOut("fast");
	},
	show: function(){
		this.lightbox.height($(document).height() + 100); //whatever
		this.lightbox.fadeIn("fast");
	},
	setSimpleLightboxContent: function(title, content){
		$("h3 b", "#lightbox #modal").html(title);
		$("<p class='content'>" + content + "</p>").appendTo("#lightbox #modal");
	},
	loadLightboxContent: function(jsonURL, lightboxClosedContentURL){
		//render template for ILE lightbox
		$.getJSON(jsonURL, function(json){
			$("#tpl-ile-lightbox").jqote(json).appendTo("#lightbox #modal");
			$('#lightbox .price').formatCurrency();
			//when save is clicked, close the lightbox, and tell the main page to update with new content
			$("#lightbox-save-button").click(function() {
				Lightbox.hide();
				SPC.updateMainContent(lightboxClosedContentURL);
			});
		});
	}
};



	$(document).ready(function() {
		
		//default json object content URLS
		var mainContentURL = "javascript/json/json-data.js";
		var orderSummaryURL = "javascript/json/json-ordersummary.js";
		var ILELightboxURL, ILELightboxClosedURL = null;
		
		//set up states
		$.prototyper.init(
			[
				{
					state: "prime",
					text: "Prime-enabled",
					response: function() {
						mainContentURL = "javascript/json/json-prime-data.js";
						orderSummaryURL = "javascript/json/json-ordersummary.js";
						SPC.primeOn();
					}
				},
				{
					state: "singleitem",
					text: "Single item",
					response: function() {
						mainContentURL = "javascript/json/json-singleitem.js";
						orderSummaryURL = "javascript/json/json-singleitem-os.js";
						$("#dashboard #ship-to-multiple").hide();
					}
				},
				{
					state: "twoitems",
					text: "Two items",
					response: function() {
						mainContentURL = "javascript/json/json-twoitems.js";
						orderSummaryURL = "javascript/json/json-twoitems-os.js";
					}
				},
				{
					state: "pointsmessage",
					text: "Single item with 3P Points alert",
					response: function() {
						mainContentURL = "javascript/json/json-singleitem.js";
						orderSummaryURL = "javascript/json/json-singleitem-os.js";
						$("#dashboard #ship-to-multiple").hide();
						$("#3Ppoints").show();
					}
				},
				{
					state: "likecart",
					text: "Cart prototype",
					response: function(){
						mainContentURL = "javascript/json/json-cartproto.js";
						orderSummaryURL = "javascript/json/json-ordersummary.js";
					}
				},
				{
					state: "refdata",
					text: "Refdata Examples",
					response: function() {
						mainContentURL = "javascript/json/json-refdata.js";
						orderSummaryURL = "javascript/json/json-ordersummary.js";
					}
				},
				{
					state: "split",
					text: "Split shipment",
					response: function() {
						mainContentURL = "javascript/json/json-ship-split.js";
						orderSummaryURL = "javascript/json/json-ordersummary.js";
					}
				},
				{
					state: "longtext",
					text: "Examples of long text",
					response: function(){
						mainContentURL = "javascript/json/json-longtexts.js";
						orderSummaryURL = "javascript/json/json-ordersummary.js";
					}
				},
				{
					state: "preorder",
					text: "Preorder",
					response: function(){
						mainContentURL = "javascript/json/json-preorder.js";
						orderSummaryURL = "javascript/json/json-preorder-os.js";
					}
				},
				{
					state: "multiple",
					text: "Ship to Multiple",
					response: function(){
						mainContentURL = "javascript/json/json-ship-to-multiple.js";
						orderSummaryURL = "javascript/json/json-ordersummary.js";
						$("div.dashboard-element:first p").html("You are shipping items to multiple addresses. See details below. <a href='#'>Change</a>").addClass("caption");
					}
				},
				{
					state: "gc-error",
					text: "Inline Error on Gift Card",
					response: function(){
						mainContentURL = "javascript/json/json-singleitem.js";
						orderSummaryURL = "javascript/json/json-ordersummary.js";
						$("div.dashboard-element div.error").show();
					}
				},
				{
					state: "promo-page-level",
					text: "IMB with long promo text",
					response: function(){
						mainContentURL = "javascript/json/json-singleitem.js";
						orderSummaryURL = "javascript/json/json-preorder-os.js";
						$("#global-error").removeClass("warning")
											.show()
											.find("p:first")
											.html("After you order, we'll email you to confirm a $1 credit for Amazon MP3 music downloads has been applied to your account. The credit may be used only for Amazon MP3 downloads available at www.amazon.com. You must redeem your credit (in one or more transactions) for Amazon MP3 downloads by June 30, 2010. Customers may only become eligible for the $1 MP3 offer once during the June 7, 2010 to August 7, 2010 11:59pm PST promotional period.")
										  .end()
											.find("h6")
											.html("Promotions applied");
					}
				},
				{
					state: "diapers",
					text: "Promo Diapers split",
					response: function(){
						mainContentURL = "javascript/json/json-diapers-split.js";
						orderSummaryURL = "javascript/json/json-diaper-split-os.js";
					}
				},
				{
					state: "digital",
					text: "MP3 (EU only)",
					response: function(){
						mainContentURL = "javascript/json/json-digital.js";
						orderSummaryURL = "javascript/json/json-diaper-split-os.js";
					}
				},
				{
					state: "magazine",
					text: "Magazine subscription",
					response: function(){
						mainContentURL = "javascript/json/json-magazine.js";
						orderSummaryURL = "javascript/json/json-magazine-os.js";
					}
				},
				{
					state: "scheduled",
					text: "Scheduled Delivery",
					response: function(){
						mainContentURL = "javascript/json/json-scheduleddelivery.js";
						orderSummaryURL = "javascript/json/json-scheduleddelivery-os.js";
						
						SPC.renderingDone = function(){
							var sdHtml = "<span><select><option selected='selected'>Select a delivery date</option><option value='11'>8:00 AM-11:00 AM 7/11/10</option><option value='12'>9:00 AM-12:00 PM 7/12/10</option><option value='12-2'>11:00 AM-1:00 PM 7/12/10</option><option value='12-3'>12:00 PM-3:00 PM 7/12/10</option><option value='12-4'>1:00 PM-3:00 PM 7/12/10</option><option value='12-5'>3:00 PM-5:00 PM 7/12/10</option></select>&nbsp;<img src='images/calendar-icon2.gif' style='vertical-align:text-bottom' /></span>";
							$("span.promise:first").replaceWith(sdHtml);
						}
					}
				},
				{
					state: "de-agerestrict",
					text: "Age Restriction (DE)",
					response: function(){
						mainContentURL = "javascript/json/json-singleitem.js";
						orderSummaryURL = "javascript/json/json-ordersummary.js";
						Lightbox.init().setSimpleLightboxContent("Bitte best&auml;tigen Sie Alter und Identit&auml;t", "<b>Ihre Bestellung enth&auml;lt einen Artikel ohne Jugendfreigabe. Die Lieferung, die diesen Artikel enth&auml;lt, muss vom Empfänger pers&ouml;nlich entgegengenommen werden. Bitte bestätigen Sie Alter und Identit&auml;t.</b> Ich bin &uuml;ber 18 Jahre alt und versichere, dass der Name auf dem Ausweis des Empf&auml;ngers dieser Bestellung exakt dem in der Lieferadresse hinterlegten Namen entspricht. Der Empf&auml;nger muss diese Lieferung pers&ouml;nlich in Empfang nehmen. <a href='#'>Weitere Informationen</a>");
						Lightbox.show();
					}
				},
				{
					state: "task2",
					text: "Usability test - Task 2",
					response: function(){
						mainContentURL = "javascript/json/usability/json-usability-task2.js";
						orderSummaryURL = "javascript/json/usability/json-usability-task2-os.js";
					}
				},
				{
					state: "task3",
					text: "Usability test - Task 3",
					response: function(){
						//ok, this is seriously hacky: set a function in the SPC object that 
						//gets called after the main rendering job is done
						SPC.renderingDone = function(){
							$("div.ship-options:first").append("<li id='ile-trigger' style='font-size: 93%; margin-left: -16px; color: #666;'>You can also <a href='#'>set shipping speeds for each item seperately</a></li>");
							$("#ile-trigger").click(function() {
								Lightbox.show();
							});
						};
						
						mainContentURL = "javascript/json/usability/json-usability-task3.js";
						orderSummaryURL = "javascript/json/usability/json-usability-task3-os.js";
						//content to show in lightbox
						ILELightboxURL = "javascript/json/usability/json-usability-task3-ile.js";
						//content to show after lightbox "Save" button clicked
						ILELightboxClosedURL = "javascript/json/usability/json-usability-task3-split.js";
					}
				},
				{
					state: "task5",
					text: "Usability test - Task 5",
					response: function(){
						//see above..this is a total hack to sorta kinda do a post-rendering task.
						SPC.renderingDone = function(){
							$("div.asin").append("<p><a href='#' class='split-trigger' style='font-size: 93%;'>Set shipping speed for this item</a></p>");
							$("div.asin a.split-trigger").click(function() {
								SPC.updateMainContent("javascript/json/usability/json-usability-task5-split.js");
							});
						};
						
						mainContentURL = "javascript/json/usability/json-usability-task5.js";
						orderSummaryURL = "javascript/json/usability/json-usability-task5-os.js";
					}
				}
			]
		);
		
		//load appropriate data into templates
		SPC.loadMainContent(mainContentURL);
		
		//if the current state uses a lightbox, set it up here
		if(ILELightboxURL !== null){
			Lightbox.init();
			Lightbox.loadLightboxContent(ILELightboxURL, ILELightboxClosedURL);
		}
		
		SPC.loadOrderSummary(orderSummaryURL);
		
		/* Set up page behaviors */
		
		//using delegate here because the .ship-options div and its radio buttons aren't in the
		//DOM at runtime, they get inserted by the jqote template
		//simulate Ajax reloading of Order Summary when clicking Shipping Options
		$("#purchase-context").delegate(".ship-options input:radio", "click", function(event) {
			$("#order-summary").showLoadingSpinner();
		});
		
		
		$("input.gift-cb").live('change', function(e) {
			e.preventDefault();
			var si = $(this).siblings(".save-indicator").show();
			var sc = $(this).siblings(".save-confirm").hide();

			setTimeout(function(){ 
				si.hide(); 
				sc.show().delay(5000).fadeOut("fast"); 
			},1000);
		});
		
		//Show popover Quantity editor
		$("#purchase-context").delegate(".asin .quantity-edit", "click", function(event) {
			SPC.quantityEdit.show($(this));
			return false;
		});
		
		//help links in right column
		$("a.help-link").live('click', function(event) {
			window.open(this.href, "help","width=550,height=500,scrollbars=1,resizable=1,status=1,location=1");
			event.preventDefault();
		});
		
		//element initialization
		SPC.quantityEdit.init();
		SPC.alertTab.init();	
		
	
});

