// plugin definition
$.fn.showLoadingSpinner = function(options) {
	var self = $(this);
	var defaults = {
		delay: 2500,
		spinnerSize: "small",
		css: {
			border:'1px #A5CDEC solid',
			position:'absolute',
			padding:'10px',
			margin:0,
			textAlign:'center',
			backgroundColor:'#ffffff',
			lineHeight:0
		},
		onLoadingDone: function(){}
	};
	
	var opts = $.extend(defaults,options);
	
	//create it if we didn't already
	//http://g-ecx.images-amazon.com/images/G/01/ui/loadIndicators/loading-small.gif
	
	if($("#loading-spinner").length == 0) {
		(opts.spinnerSize == 'small') ? size = "loading-small.gif" : size = "loading-large.gif";
		var spinnerHTML = "<img id='loading-spinner' src='http://g-ecx.images-amazon.com/images/G/01/ui/loadIndicators/" + size + " />";
		$(spinnerHTML).appendTo("body").css(opts.css);
	};
	
	var spinner = $("#loading-spinner");
	var targetElement = $(this);
	var targetElementOffset = targetElement.offset();
	var targetElementHeight = targetElement.outerHeight();
	var targetElementWidth = targetElement.outerWidth();
	
	//figure out where the spinner should be positioned
	var ypos = targetElementOffset.top + targetElementHeight / 2 - 20;
	var xpos = targetElementOffset.left + targetElementWidth / 2 - 20;
	
	//show the spinner positioned in the middle of targetElement
	spinner.css({
		top:ypos,
		left:xpos
	}).fadeIn("fast");
	
	//fade this element to 50% opacity
	targetElement.fadeTo('fast', 0.33);
	
	setTimeout(function(){
		spinner.fadeOut("fast");
		targetElement.fadeTo('fast', '1');
		opts.onLoadingDone.call(self);
		spinner.remove();
	}, opts.delay);

};