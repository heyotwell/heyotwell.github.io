/*
Prototype tools v3
	* moved all configuration into the .respondTo() setup functions
	
by: Andrew Otwell otwell@amazon.com

USAGE. 

PrototypeTools does two things: create notes that stick to any DOM object, and maintain a list of dynamic states of your prototype.

1. DESIGN NOTES are sticky note annotations next to any page element:

	Inside document.ready(), call createDesignNote() on any #id element:

	This puts a note next to the top right corner of the "#example" element:		
		$("#example").createDesignNote({
			content: "Text here, including HTML tags"
		});
	
	This puts a note next to the top LEFT corner of the "#example" element:

		$("#example").createDesignNote({
			content: "Text here, including HTML tags",
			align: "TL" //values can be "TR"(default), "TL", "BL", and "BR"
		});

	Design notes can be created for all elements of a class. Probably rarely useful:

		$(".special-features").createDesignNote({
			content: "Note applied to all instances of a class"
		});
	
2. DYNAMIC STATES allow your page to dynamically respond to different states. This is the main purpose of this plugin.

	Inside document.ready(), call $.prototyper.init([]) passing it an array of objects, one for each state you want to configure:
	
	$.prototyper.init([
		{
			state: "admin",
			text: "Show Admin-only features",
			response: function() {
				$(".admin").show();
				$("#welcome").html("<p>Welcome, <b>Administrator</b>.</p>");
			}
		},
		{
			state: "prime",
			text: "Toggle Prime",
			action: true,
			response: function() {
				$(".prime").toggle();
				$("#welcome").html("<p>You're Prime!</p>");
			}
		}
	]);
	
	* "state" is just a value to be set in the url, here "http://wwww.example.com/mypage.html?state=admin"
	* "text" is the linked text that appears in the yellow navigation post-it note at upper right of the page.
	* "response" is a function to run when the page is loaded in this state. For example, show/hide elements, set default form field values
	* if the "action" property is true, the "response" function will be run on the page without reloading it, this is useful
		for toggling things on and off in-page
	
	"state" and "response" are actually optional. This will just put a plain text label in the navigation post-it:
	
	$.prototyper.init([
		{
		text: "Use <b>ABC123</b> as a test promo code on this page"
		}
	]);
	
	Note that $.prototyper.init() builds your navigation postit links in the order they appear in the array parameter.
	
3. OTHER FUNCTIONS
 	- Click the close "x" on a design note or navigation postit to hide it
	- Command-Click in the upper ~200 pixels of the page (near the browser tab bar) to show/hide all notes
	- Check "Links hide notes by default?" in the navigation postit to hide notes by default on page load (useful for presentations)

*/

(function($) {
						
	$.fn.createDesignNote = function(options) {
	
		// build main options before element iteration
 		var opts = $.extend({}, $.prototyper.designNoteDefaults, options);
		
		//iterate over all elements in case we want to attatch the same note to each (rare, I guess)
		return this.each(function() {
   			$this = $(this);
			
			switch(true) {
				case (opts.align == "TL"):
					var ypos = $this.offset().top;
					var xpos = $this.offset().left - 210;
					break;
				case (opts.align == "TR"):
					var ypos = $this.offset().top;
					var xpos = $this.offset().left + $this.width() + 50;
					break;
				case (opts.align == "BR"):
					var ypos = $this.offset().top + $this.outerHeight();
					var xpos = $this.offset().left + $this.outerWidth() + 5;
					break;
				case (opts.align == "BL"):
					var ypos = $this.offset().top + $this.outerHeight();
					var xpos = $this.offset().left - 210;
					break;
			}			
			var $note = $("<div class='design-note' tabindex='-1'><p class='close-box'</p><div>" + opts.content + "</div></div>")
				.appendTo("body")
				.css({
					top: ypos, 
					left: xpos
				});
				
			if($.prototyper.startClosed == true || $.prototyper.startClosed == 1) { $note.hide() };
			
		});
	};
	
	
	//prototyper builds the statelist and sets up event handling for all notes
	$.prototyper = {
		//configuration options
		pathToDesignNoteCSS: "javascript/design-note/design-note.css",
		startClosed: false,
		
		states: [],
		
		designNoteDefaults: {
			content: 'Enter content for your notes.',
			align: "TR"
		},
		
		checkDefaultVisibility: function() {
			if(typeof $(document).getUrlParam =='function') {
				this.startClosed = $(document).getUrlParam("hidenotes") || false;
			} else {
				console.warn("Hiding design notes by default and responding to states requires jquery.getUrlParams.js.");
			}
		},
		
		injectRequiredCss: function() {
			//add design-note.css if not present
			if ($('link[href*="design-note"]').length != 1) {
				var designNoteStyleSheet = $("<link rel='stylesheet' type='text/css' href=" + this.pathToDesignNoteCSS + " />");
				designNoteStyleSheet.appendTo("head");
			};
		},
		
		//statelist is the yellow post it list of links to other states of the page
		//logic for responding to these states would be in other code
		createStateList: function(contentArray) {
			
			this.states = contentArray;
			this.states.unshift({state: "default", text: "Default"}); // make sure the Default state comes first
			
			$statelist = $("<div class='design-note statelist' tabindex='-1'><p class='close-box'</p><div><ul></ul><p><input type='checkbox' id='hidenotes-checkbox' style='vertical-align:middle'/> Links hide notes by default?</p></div></div>").appendTo("body");
			
			//build the list of links and text to show in the state list 
			for(i=0;i < this.states.length; i++){
				if (this.states[i].state == "default") {
					//default state gets special url
					$("ul", $statelist).append("<li><a href='?'>" + this.states[i].text + "</a></li>");
				
				} else if (this.states[i].state == undefined) {
					//for text-only entries
					$("ul", $statelist).append("<li><h5>" + this.states[i].text + "</h5></li>");
				
				} else {
					if(this.states[i].action == true) {
						//handle states tagged as "actions", which don't reload the page, but just run their "response" function
						$("ul", $statelist).append("<li><a href='#' id='" + this.states[i].state + "'>" + this.states[i].text + "</a></li>");
						
						//ok, hold your hats: set the click event of this link to the response function associated with this state.
						//passed via the event.data map to keep track of context of this closure.
						//#gottabeabettahway
						$("#" + this.states[i].state).click({responseFunction:this.states[i].response}, function(e) {
							e.data.responseFunction();
						});		
					} else {
						//normal state links
						$("ul", $statelist).append("<li><a href='?state=" + this.states[i].state + "'>" + this.states[i].text + "</a></li>");
					}
				}
			}
			
			function appendHideNotesParam(){
				$("div.statelist a").each(function(){
					$(this).attr("href", $(this).attr("href") + "&hidenotes=1");
				});
			};
			
			function removeHideNotesParam(){
				$("div.statelist a").each(function(){
					//reset href to remove the hidenotes parameter
					pos = $(this).attr("href").indexOf("&hidenotes=1");
					newhref = $(this).attr("href").substring(0, pos);
					$(this).attr("href", newhref);
				});
			};
			
			if(this.startClosed == true || this.startClosed == 1) {
				//when hiding this note, we want keep hiding it on subsequent clicks
				//until the user un-checks the checkbox.
				$statelist.hide();
				$("#hidenotes-checkbox").attr("checked", true);
				appendHideNotesParam();
			 };
			
			//watch for Ctrl+click near top of page to hide and show all notes
			$("html").click(function(e) {
				if(e.metaKey && e.pageY < 20) {
					if ($(".design-note:hidden").length >= 1) {
						$(".design-note").fadeIn("fast");
					} else {
						$(".design-note").fadeOut("fast");
					}
				}
			});
				
			//set the checkbox to control whether links open the design notes shown or hidden
			$("#hidenotes-checkbox").click(function(){
				if ($(this).attr("checked") == true || $(this).attr("checked") == 1) {
					appendHideNotesParam();
				} else {
					removeHideNotesParam();
				}
			});
			
			//define a click behavior for all future close box buttons in design notes
			$(".design-note p.close-box").live("click", function(){
				$(this).parent().fadeOut("fast");
			})
		},
		
		respondTo: function(stateObject) {
			//todo: this recieves stateObjects one at a time
			//need to create a function that accepts an array of them instead
			//i.e. accepts contentArray directly into: 	$.prototyper.init(stateObjectArray)
			this.states.push(stateObject);
		},
		
		respondToCurrentState: function() {
			if(typeof $(document).getUrlParam =='function') {
				//figure out the current state
				var currstate = $(document).getUrlParam("state") || null;
				if (currstate == null) { return };
				if (this.states.length == 0) {return };
				
				//console.info("Current state should be: " + currstate);
				//run the "response" function associated with this state
				for(i=0; i<this.states.length; i++) { 
					if (this.states[i].state == currstate) {
						$("title").text(this.states[i].text);
						this.states[i].response(); 
					}
				}
			//couldn't run the getUrlParam function
			} else {
				console.warn("Responding to states requires jquery.getUrlParams.js.");
			}
			
		},
		browserCheck: function() {
			if ($.browser.msie) {
				$("body").prepend("<p id='browser-warning'>Uh oh! This prototype probably won't work in Internet Explorer.</p>");
				setTimeout(function(){
					$("#browser-warning").slideUp("slow");
				}, 2000);
			}
			
		},
		
		init: function(stateObjectArray) {
			this.injectRequiredCss();
			this.checkDefaultVisibility();
			this.createStateList(stateObjectArray);
			this.respondToCurrentState(); 
			this.browserCheck();
		}
	};

})(jQuery);