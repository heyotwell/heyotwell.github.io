// prototyping tools

//paths to assets, relative to the HTML file where the note will appear (not relative to this .js file)
var pathToCloseImg 			= "../design-note/close-box.gif";
var pathToDesignNoteCSS	= "../design-note/design-note.css";

//check URL path for param to hide the design note
if ($(document).getUrlParam("hidenote") == "true") {
	var startClosed = true;
} else {
	var startClosed = false;
}

/* add a global convenience method for setting an href */
jQuery.fn.linkto = function(newURL) {
	if(newURL == undefined) { 
		console.error("No value for newURL"); return;
	}
	return this.attr("href", newURL);
};

$(document).ready(function(){
													 
	/* designNoteContent is an array of objects like:
		var designNoteContent = [
			{href:"../path/to/file1.html",					text:"File 1"},
			{href:"../path/to/file2.html",					text:"File 2"},
			{href:"../path/to/file.html?state=new",	text:"New State"}
		]
		define this on the page where the design note will appear 
	*/
	
	if (window.designNoteContent) {

		//add the design-note css automatically.
		if ($('link[href*="design-note"]').length != 1) {
			var designNoteStyleSheet = $("<link rel='stylesheet' type='text/css' href=" + pathToDesignNoteCSS + " />");
			var lastStylesheetLink = $('link[@rel*="style"]:last');
			designNoteStyleSheet.insertAfter(lastStylesheetLink);
		};
		
		//setup container div
		$("<div id='design-note' tabindex='-1'><img src=" + pathToCloseImg +  " alt='close' /><div><ul></ul></div></div>").appendTo("body");
		if(startClosed == true) {$("#design-note").hide()};
												 
		//build the list of links shown in the note 
		for(i=0;i < designNoteContent.length; i++){
			if (designNoteContent[i].href == undefined) {
				$("#design-note ul").append("<li><p>" + designNoteContent[i].text + "</p></li>");
			} else {
				$("#design-note ul").append("<li><a href=" + designNoteContent[i].href + " >" + designNoteContent[i].text + "</a></li>");
			}
		}
		
		//use Ctrl+click in upper area to bring back a closed design-note
		$("body").click(function(e) {
			if(e.pageY < 200 && e.metaKey) {
				if($("#design-note").is(":hidden")) { $("#design-note").fadeIn("fast"); }
			}
		});
	
		//close design note with the X image @ its upper right
		$("#design-note img").click(function() {
			$("#design-note").fadeOut("fast");
		});
		
		
	} else {
		console.warn("No designNoteContent array was provided for design-note");
	}
	
	/* /non-Firefox warning stripe
	if ($.browser.msie) {
		$("body").prepend("<p id='browser-warning'>This mockup may not work correctly in <b>Internet Explorer</b>!</p>");
	};
	*/
	
	
});