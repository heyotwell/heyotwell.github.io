$.fn.simpleColorHighlight = function() {
    this.animate({backgroundColor:'#ffffdd'}, 1200).animate({backgroundColor:'#ffffff'}, 2000);
};

 

function isZip(s) {
    // Check for correct zip code
    reZip = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);

    if (!reZip.test(s)) {
      return false;
    }
    return true;
}

var User = {
	zipcode: false, //set by user below
	isPrime: true //set to false in certain $.prototyper states
};

var CartHelpers = {
	scrollableElement: ($.browser.safari) ? "body" : "html",
	
	scrollCartIntoView: function (callback){
		var cartItemsYpos = $("table.cart-items thead:first").offset().top;
		if ($(window).scrollTop() != cartItemsYpos) {
			$(this.scrollableElement).animate({scrollTop: cartItemsYpos}, 1000, "easeOutExpo", callback)
		}
	},
	scrollSavedItemsIntoView: function(callback){
		var savedItemsYpos = $("table.cart-items thead:last").offset().top;
		if ($(window).scrollTop() != savedItemsYpos) {
			$(this.scrollableElement).animate({scrollTop: savedItemsYpos}, 1000, "easeOutExpo", callback)
		}
	},
	updateCartCount: function(count){
		$("#unit-count").html(count);
		$('#nav [navid=cart] .cartCount').attr('count', count).text(count);
		$('#nav [navid=cart]').attr('count', count);
	},
	calculateOrderTotal: function(){
		var newSubTotal = 0;
		var newQuantity = 0;
		var merchantShipping = 0;
		var amazonShipping = 0;
		var merchants = [];
		
		$("#cart-asins tr:visible").each(function(){
			var itemData = $(this).tmplItem().data;

			if(itemData.title) {
				var extendedTotal = itemData.quantity * (itemData.our_price || itemData.list_price);
				newSubTotal += extendedTotal;
				newQuantity += itemData.quantity;
			
				if(itemData.shipper) {
					merchantShipping += itemData.shipping;
					//merchants array is passed to the Order Summary template
					//so we can break out shipping by merchantname
					merchants.push({"merchantShipperName":itemData.shipper, "merchantShipping":itemData.shipping});
				} else {
					amazonShipping += (User.isPrime) ? 0 : itemData.shipping; 
				}
			}
		});
		
		//if #shipping-zip input has a value, calculate values for tax and shipping
		if (User.zipcode){
			var zip = User.zipcode;
			var taxRate = (zip > 98000) ? 9.5 : 0; //WA zipcodes are > than 98000, otherwise assume no tax
			var tax =  ((newSubTotal + amazonShipping) * taxRate)/100; 	
		} else {
			var zip = "";
			var tax = 0;
		}
		
		var orderGrandTotal = newSubTotal + tax + amazonShipping + merchantShipping;
		
		var orderSummaryData = {
			subtotal: newSubTotal,
			unitCount: newQuantity,
			tax: tax,
			amazonShipping: amazonShipping,
			merchantShipping: merchantShipping,
			merchants:merchants,
			orderGrandTotal: orderGrandTotal,
			zip: zip
		}
		
		//refresh the order summary and unit count
		$("#proceed-to-checkout").empty();
		$("#proceedToCheckoutTemplate").tmpl(orderSummaryData, TemplateHelpers).appendTo("#proceed-to-checkout");
		
		this.updateCartCount(orderSummaryData.unitCount)
		
		$("#saved-for-later-count").html($("#saved-for-later-asins tr:visible").length);
		//$("#shipping-zip").focus();
		
	},
	calculateExtendedRowTotal: function(item){
		var itemData = $(item).tmplItem().data;
        var extendedTotal = itemData.quantity * (itemData.our_price || itemData.list_price);
		$(item).parent("td")
			.parents("tr")
			.find(".quantity .ourprice")
			.text("$" + extendedTotal.toFixed(2));
	}
};

//helper functions used when rendering jquery-tmpl templates		
var TemplateHelpers = {
    getPicture: function(size) {
		imageSizeSuffix = "._SS" + size + "_.jpg";
        var url = "http://ecx.images-amazon.com/images/I/" + this.data.img_url + imageSizeSuffix;
        return url;
    },
    formatPrice: function(price) {
        return "$" + price.toFixed(2);
    },
	getDiscountPercentage: function(listprice, ourprice) {
		var discount = (listprice - ourprice)/listprice * 100;
		return discount.toFixed(0) + "%";
	},
	formatURL: function(){
		return "http://www.amazon.com/gp/product/" + this.data.asin;
	},
	getUnitCount: function(items){
		var unitCount = 0;
		for (var i=0; i < items.length; i++) {
			unitCount += items[i].quantity;
		};
		return unitCount;
	},
	getExtendedPrice: function(){
		var extprice = (this.data.our_price || this.data.list_price) * this.data.quantity;
		return this.formatPrice(extprice);
	},
	getSubtotal: function(items){
		var subtotal = 0;
		for (var i=0; i < items.length; i++) {
			var asin = items[i];
			var price = asin.our_price || asin.list_price;
			subtotal = subtotal + (price * asin.quantity);
		};
		return subtotal;
	},
	formatReviewStarsClass: function(rating){
		var ratingStrings = {"0":"0_0", "0.5":"0_5", "1":"1_0", "1.5":"1_5", "2":"2_0", "2.5":"2_5", "3":"3_0", "3.5":"3_5", "4":"4_0", "4.5":"4_5", "5":"5_0"};
		return "star_" + ratingStrings[rating.toString()];
	},
	truncate: function(str, length, truncation) {
		//taken from Prototype.js
    	length = length || 30;
	    truncation = '...';
	    return str.length > length ? str.slice(0, length - truncation.length) + truncation : String(str);
  	}
};

$(document).ready(function(){
	
	/*
		PAGE SETUP 
	*/
	
	var dataURL = 'javascript/cartContentsData.js'; //data used by templates.
	
	//set up page state responses
	$.prototyper.init(
		[
			{
				text: "Customer types"
			},
			{
				state:"prime",
				text: "Prime customer (recognized)",
				response: function(){
					User.isPrime = true;
					User.zipcode = "98104";
				}
			},
			{
				state:"nonprime",
				text: "Non-Prime customer (recognized)",
				response: function(){
					User.isPrime = false;
					User.zipcode = "98126";
					$("body").toggleClass("nonprime");
				}
			},
			{
				state:"unrec",
				text: "Unrecognized customer",
				response: function(){
					User.isPrime = false;
					$("body").toggleClass("unrec");
				}
			},
			{
				text: "Cart contents"
			},
			{
				state: "manyitems",
				text: "Many items in Cart",
				response: function() {
					dataURL = 'javascript/cartContentsData-manyitems.js';
				}
			},
			{
				state: "fewitems",
				text: "Few items in Cart",
				response: function(){
					dataURL = 'javascript/cartContentsData-fewItems.js';
				}
			},
			{
				state:"pricealert",
				text: "Show price alerts",
				response: function(){
					$("#price-alert").show();
				}
			},
			{
				text: "Features"
			},
			{
				state:"pricealerttoggle",
				text: "Toggle price alerts",
				action:true,
				response: function(){
					$("#price-alert").toggle();
				}
			},	
			{
				state: "oneclick",
				text: "Toggle 1-Click",
				action:true,
				response: function(){
					$("#one-click, #one-click-prompt").toggle();
				}
			},
			{
				state: "visa",
				text: "Toggle credit card ad",
				action:true,
				response: function(){
					$("#visa-ad").toggle();
				}
			},
			{
				state: "newnav",
				text: "Toggle new/old nav",
				action:true,
				response: function(){
					$("body").toggleClass("newnav");
					$("#ptc-button").attr("src", "images/new-proceed-button.png");
				}
			},
			{
				text: "Design"
			},
			{
				state: "togglegrid",
				text: "Toggle grid",
				action: true,
				response: function(){
					$(".snapper").toggleClass("showgrid");
				}
			}
		]
	);
	
	
	//load jQuery-tmpl templates, load data, and perform 
	//templating stuff as needed
	$.get('templates/_cart.tmpl.htm',function(templates) {
	    // Inject all loaded templates at the end of the document
	    $('body').append(templates);
		
		//get data, pass it to templates, and build page content
	    $.getJSON(dataURL, function(json) {
			
	    $("#cartRowTemplate").tmpl(json.cartItems, TemplateHelpers).appendTo("tbody#cart-asins");
			$("#savedRowTemplate").tmpl(json.savedForLaterItems, TemplateHelpers).appendTo("tbody#saved-for-later-asins");
			$("#rviItemsTemplate").tmpl(json.recentlyViewedItems, TemplateHelpers).appendTo("ul#recently-viewed-items");
			$("#rviItemsTemplate").tmpl(json.reccommendedForYouItems, TemplateHelpers).appendTo("ul#reccommended-for-you-items");
	        
			//the Order Summary/Total area is refreshed on most user actions, so we do it via this method
			CartHelpers.calculateOrderTotal();
	    });		
	});
	
	/* 
		EVENT HANDLERS
	*/
	//respond to clicks on item-management actions: delete, move to cart, save for later, etc.
	$("#cart-asins, #saved-for-later-asins").delegate('div.buttons a', 'click', function(event) {
		
		event.preventDefault();
		var action = event.currentTarget.rel;		//what the button's behavior is
		var itemData = $(this).tmplItem().data;		//data about the clicked item
		var title = itemData.title;				
		var quantity = itemData.quantity;
		var row = $(this).parents("tr");			//row of the clicked item
		var message = "";							//will be a confirmation message
		var newTargetContext = ""; 					//will be either the top of the cart or the top of S4L (or nothing)
		
		//build appropriate action confirmation messaage
		if (action == "cartDelete"){
			message =  quantity + " of <b>" + title + "</b> was removed from your Shopping Cart. (<a href='#' class='undo'>Undo</a>)";
		
		} else if (action == "savedDelete"){
			message =  "<b>" + title + "</b> was removed from your Saved for Later list. (<a href='#' class='undo'>Undo</a>)";
		
		} else if (action == "saveForLater") {
			message = "<b>" + title + "</b> was moved to <a href='#' class='scroll-to-view' rel='saved'>your Saved for Later list.</a>";
		
		} else if (action == "moveToWishList"){
			message = "<b>" + title + "</b> was moved to <a href='http://www.amazon.com/wishlist'>your Wishlist</a>.";
		
		} else if (action == "moveToCart") {
			message = "<b>" + title + "</b> was moved to <a href='#' class='scroll-to-view' rel='cart'>your Shopping Cart.</a>";
		}
		
		//create a jQuery object, stick it into the DOM
		var newHTML = $("<tr class='action-message'><td colspan='4'><p>" + message  + "</p></td></tr>").appendTo("tbody#saved-for-later-asins");
		
		var targetMessageHeight = newHTML.find("p").height(); //store the "natural" height 
		
		newHTML.find("p").css({
			height:row.height() //start at full size, to shrink into final size
		});
		
		newHTML.remove(); //remove from the DOM--newHTML is now setup to insert below
		
		//collapse any existing action-messages already on the page
		$("tr.action-message td p").css("padding", 0).slideUp(500, "easeOutExpo", function(){
			$(this).parents("tr.action-message").remove();
		});
		
		//remove the row of the clicked item, and replace with the status message
		row.fadeOut(750, function(){
			//insert the *new* message just after the hidden row
			row.after(newHTML);
		
			$(newHTML).find("td p").animate({
				height:targetMessageHeight,
				opacity:1,
				backgroundColor:'#ffffdd'
			}, 1000, "easeOutExpo");
			
			//if it was moved (not deleted), create an entry for the item with the appropriate template and insert it
			if (action == "moveToCart") {
				$("#cartRowTemplate").tmpl(itemData, TemplateHelpers).prependTo("tbody#cart-asins");
			} else if (action == "saveForLater") {
				$("#savedRowTemplate").tmpl(itemData, TemplateHelpers).prependTo("tbody#saved-for-later-asins");
			}
			//and finally...
			CartHelpers.calculateOrderTotal();
		});
			
	}); // end item management delegation event handler
	
	
	//after a Delete action, user can "undo" the deletion and re-add the item in context
	$(".undo").live('click', function(e) {
		e.preventDefault();
		
		//find the adjacent hidden row of the "deleted" item, show it, then hide message row
		$(this).parents("tr").prev("tr:hidden").fadeIn("fast").end().hide(); 
	});
	
	//the "your Shopping Cart" & "your Saved for Later list" links for move-to-cart and save-for-later actions
	$(".scroll-to-view").live("click", function(e){
		e.preventDefault();
		
		//scroll to the right spot, and highlight the first (just-added) item
		if (e.target.rel == "cart"){
			CartHelpers.scrollCartIntoView(function(){
				$("#cart-asins tr:first").simpleColorHighlight()
			});
		} else if (e.target.rel == "saved"){
			CartHelpers.scrollSavedItemsIntoView(function(){
				$("#saved-for-later-asins tr:first").simpleColorHighlight();
			});
		}	
	});

	$("td.quantity input").live('keyup', function(e) {
		e.preventDefault();
		$(this).stopTime("quantity"); //timer used to make changes to the field not feel jumpy
		
		//on change of a quantity field, recalculate the line item's subtotal the the overal items total	
		//wait briefy for the user to stop typing, then respond
		$(this).oneTime(1000, "quantity", function(){
			var origQuantity = $(this).tmplItem().data.quantity;
            var field = $(this);
			
            if(e.keyCode == '38') {
                //up arow
                field.val(parseInt(field.val()) + 1);
            } else if (e.keyCode == '40'){
                //down arrow
                field.val(parseInt(field.val()) - 1);
            }

            //check for negative numbers or non numeric entry
            var newQuantity = parseInt(field.val());
			
			//if not a reasonable value, set the quantity to the original value of the field
            if( (newQuantity < 0) || (isNaN(newQuantity)))  {
                field.val(origQuantity);
				newQuantity = origQuantity;
            }
			
			//update the "model" with the new quantity 
			$(this).tmplItem().data.quantity = newQuantity;
			
			CartHelpers.calculateExtendedRowTotal(this);
			CartHelpers.calculateOrderTotal();
        });
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
	
	//clickable linked zip code that toggles an input field if the
	//user wants to edit it
	$("#zip-trigger").live('click', function(e) {
		e.preventDefault();
		$("#zip-row").fadeIn("fast");
	});
	
	$("#ship-cost-trigger").live('mouseover mouseout', function(e) {
		e.preventDefault();
		var newY = $(this).offset().top - $(this).offsetParent().offset().top + 20;
		var newX = -20;
		$("#shipping-details-popover").css({top:newY, left:newX}).fadeToggle("fast");
	});
	
	//hmm... keyup is annoying. Maybe needs an "ok" button to submit
	$("#shipping-zip").live('keyup', function(e){
		$(this).stopTime("calctotal");
		z = $(this).val();
		if (z.length == 5) {
			if(isZip(z)) {
	           User.zipcode = z;
	        } else {
				User.zipcode = "";
	        }

			$(this).oneTime(1200, "calctotal", function(){
	            CartHelpers.calculateOrderTotal();
	        });
		}                   
	  });
	
	$('a.new-window').live("click",function(){
		window.open(this.href, "help", "menubar=1,resizable=1,scrollbars=1,width=400,height=350");
	    return false;
	});
	
	checkResolution(); //snappa
	
	 
});  //end document.ready()
