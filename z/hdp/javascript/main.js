const animationDuration = 500;

const msNarrowWidth = 228,
		msWideWidth = 750,
		dataWideWidth = 1024,
		dataNarrowWidth = 500,
		dataWideMarginLeft = -522,
		dataNarrowMarginLeft = 0;

const contentScrollPointsNarrow = {
	'#overview': 0,
	'#ff': 790,
	'#building-permit':2796,
	'#zestimate': 4023,
	'#price':4611,
	'#monthly':5385,
	'#neighborhood': 6002,
	'#schools': 7079,
	'#footer':7875
};

const contentScrollPointsWide = {
	'#overview': 0,
	'#ff': 434,
	'#building-permit':1681,
	'#zestimate': 2516,
	'#price':3030,
	'#monthly':3564,
	'#neighborhood': 4148,
	'#schools': 4603,
	'#footer':4861
};

const scrollSpyConfig = {
	axis: 'x',
	margin: true,
	over:{left:-1.0}
};

$().ready(function (){

	//updates all the images inside data-view
	function setPageComponentSize(size) {
		$("#scrolling-data img").each(function(index) {
			var path = '/images/data-' + size + '/' + $(this).prop('id') + '.png';
			$(this).prop('src', path);
		});

		$("#chip").prop('src', '/images/data-'+ size + '/chip.png');

		if (size == "wide"){
			//media stream -> media strip
			$("#media-stream img").prop('src', '/images/media-narrow.png');
			$("#chip-container").removeClass("min").addClass("wide")
		} else {
			//media strip -> media stream
			$("#media-stream img").prop('src', '/images/media-wide.png');
			$("#chip-container").removeClass("wide");
		}
	};

	//view-control toggles between skinny data + media stream -> wide data + media strip
	$("#view-control").click(function() {

		var el = $(this);

		//when in standard media-forward layout
		if (el.hasClass("narrow")) {

			setPageComponentSize("wide");

			$("#media-stream").animate({
		  		width: msNarrowWidth,
			}, animationDuration);

			$("#data-view").animate({
		  		width: dataWideWidth,
		  		marginLeft: dataWideMarginLeft
			}, animationDuration);

			el.removeClass().addClass("wide"); //default data view is narrow

		//or in data-forward layout
		} else {
			setPageComponentSize("narrow");

			$("#media-stream").animate({
		  		width: msWideWidth
			}, animationDuration);

			$("#data-view").animate({
		  		width: dataNarrowWidth,
		  		marginLeft: dataNarrowMarginLeft
			}, animationDuration);

			el.removeClass().addClass("narrow");

		};
	});


	$(".nav .nav-link").on("click", function(e){
		var el = $(this);

		if($("#view-control").hasClass('narrow')) {
			var scrollPoints = contentScrollPointsNarrow;
		} else {
			var scrollPoints = contentScrollPointsWide;
		};

		//jump to correct contnet
		$("#scrolling-data").scrollTop(scrollPoints[e.currentTarget.hash]);
		//adjust jumplinks to make sure next/prev are mostly always visible
		$("#toc").scrollTo(el, 200, scrollSpyConfig);
		//so browser doesn't navigate
		event.preventDefault();
	});

	//scroll the correct nav tab into view
	//prevents active tab ending up off screen
	$('[data-spy="scroll"]').on('activate.bs.scrollspy',function(e) {
		var curr = $("#toc").find("a.active");
		$("#toc").scrollTo(curr, 200, scrollSpyConfig);
	});

	//track scroll direction to decide when to minimize el chip
	let oldScrollValue = 0;

	$("#scrolling-data").on("scroll", function(e){

		newScrollValue = this.scrollTop;

		if ($("#view-control").hasClass("narrow")) {
			if (oldScrollValue - newScrollValue < 0){
				//scrolling up, so minimize chip
				$("#chip-container").addClass("min")
	    } else if(newScrollValue < 100){
	      //scrolled near top again, so maximize
				$("#chip-container").removeClass("min")
	    }
	    // Update the old value
	    oldScrollValue = newScrollValue;
		}
	});


	//useful for recording scroll scrollPoints
	// $("#scrolling-data").on("scroll", function(e){
	// 	console.log(this.scrollTop)
	// })

});
