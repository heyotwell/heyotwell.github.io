// if(typeof(jQuery) !== 'undefined')
// {
//     (function($)
//     {
//         var debug = false;
//         var useCache = false;
// 
//         var initFromHtml = function(html)
//         {
// 
//             if($('#navbar').length > 0)
//             {
// 
//                 $('#navbar').after(html);
// 
// 
//         
//                 $.fn.nav.onAllResourcesLoaded();
// 
// 
//                 var nav = $('#nav');
//                 var navHeight = nav.outerHeight();
// 
// 
//                 $('body').css({
//                     margin:'0px 10px',
//                     paddingTop:navHeight
//                 });
// 
// 
// 
//                 var navCartCount = $('#navCartCount').text();
//                 if(navCartCount === null || navCartCount.length === 0) navCartCount = 0;
// 
//                 var recognized = $('#navidWelcomeMsg').text().match(/New customer/m) === null;
//                 var name = null;
// 
//                 if(recognized)
//                 {
//                     var text = $('#navidWelcomeMsg .navMessage:last').text();
//                     name = text.substring(5, text.length-2);
//                     //console.log(name);
//                     $('#nav [navID=yaName]').text(name);
//                 }
// 
//                 nav.attr('state', recognized ? 'rec' : 'unrec');
// 
//                 $('#nav [navid=cart] .cartCount').attr('count', navCartCount).text(navCartCount);
//                 $('#nav [navid=cart]').attr('count', navCartCount);
// 
// 
// 
//                 var selectedAlias =  $('#searchDropdownBox').find('[selected]').text();
//                 nav.find('.dropdown .contents tr[text="' + selectedAlias + '"]').click();
// 
//                 var searchText = $('input.searchSelect').val();
//                 if(searchText !== null && searchText.length > 0)
//                 {
//                     nav.find('input.searchInput')
// 
//                     .val(searchText)
//                     .attr('search', searchText)
//                     .attr('typed', searchText);
//                 }
// 
//                 // hacks for chrome rendering
//                 nav.hide();
//                 window.setTimeout(function()
//                 {
//                     nav.show();
//                     $(window).scrollTop(1).scrollTop(0);
//                     $('body').css('opacity', 1).hide().show();
//                 }, 0);
//         
//             }
//             else
//             {
//                 $('body').css('opacity', 1)
//             }
// 
//         };
// 
// 
// 
//         //$(document).ready(function()
//         {
//             var isAmazon = window.location.host.match(/amazon\.com/) !== null
//             var isLocal = debug || !isAmazon;
//             var baseUrl = 'https://design.amazon.com/mockups/dishlip/gw/proto/current/';
// 
//             /*console.log('debug: ' + debug);
//          //console.log('isAmazon: ' + isAmazon);
//          //console.log('isLocal: ' + isLocal);*/
// 
//             if(window.location.host.match(/www\.amazon\.com/) !== null)
//             {
//                 $('body').addClass('quirks');
//             }
// 
//             //var isGateway = window.location.href.match(/http:\/\/www.amazon.com\/?(ref=.*)?$/) !== null;
// 
//             if($('map[name=dtcp-mappedgatewayletter]').length > 0)
//             {
//                 $('body').addClass('letter');
//             }
// 
// 
//             // $("head").append('<link href="' + baseUrl + 'nav/css/navProto-gm.css" rel="stylesheet" type="text/css" />');
//       
//       
//             var addScript = function(path)
//             {
//                 var script = document.createElement( 'script' );
//                 script.type = 'text/javascript';
//                 script.src = baseUrl + path;
//                 document.body.appendChild( script );
//             };
//         
//             //addScript('js/customDropdown.js');
//             //addScript('js/jquery.searchSuggest.js');
//             //addScript('nav/js/navProto-gm.js');
// 
// 
//             // $.getScript(baseUrl + 'js/customDropdown.js', function()
//             //            {
//             //                $.getScript(baseUrl + 'js/jquery.searchSuggest.js', function()
//             //                {
//             //                    $.getScript(baseUrl + 'nav/js/navProto-gm.js', function()
//             //                    {
//             //                        ready();
//             //                    });
//             //                });
//             //            });
// 
// 			ready();
// 
// 
//             //$(window).load(function()
//             function ready()
//             {
//                 //console.log('ready()');
//                 var htmlUrl =   baseUrl + 'test/json_html_test.php?callback=?';
//                 //console.log(htmlUrl);
// 
//                 var html = localStorage['navHtml'];
//                 if(useCache && !debug && html !== null)
//                 {
//                     //console.log('html cached');
//                     initFromHtml(html);
//                 }
//                 else
//                 {
//                     //console.log('html cache miss');
//                     $.getJSON(htmlUrl, function(data)
//                     {
//                         //console.log(data);
//                         //console.log('caching html');
//                         localStorage['navHtml'] = data.html;
//                         initFromHtml(data.html);
// 
//                     });
//                 }
//             };
// 
//         }//);
//     })(jQuery);
// 
// }
// else
// {
//     document.body.style.opacity = '1';
//     var nav = document.getElementById('navbar');
//     if(nav !== null)
//     {
//         nav.style.display = 'block';
//     }
//     
// }
// 

function initMenu(menu, clickHandler)
{
   (function($)
    {
        var id = menu.attr('id');
        menu.find('.summary, .contents tr').unbind();

        menu.find('.summary').click(function()
        {
            $('.menu[id != ' + id + '] .contents').hide();
        
            var contents = menu.find('.contents');
            contents.toggle();
        
            if(contents.is(':visible')) menu.addClass('open');
            else menu.removeClass('open');

            return false;
        });
    
        menu.blur(function()
        {
            menu.hide();
        })



        //Source:  http://stackoverflow.com/questions/1403615/use-jquery-to-hide-div-when-click-outside-it
        //////////////
        var mouse_is_inside = false;


        menu.hover(
            function()
            {
                mouse_is_inside = true;
            },
            function()
            {
                mouse_is_inside = false;
            });

        $("body").mouseup(function()
        {
            if(!mouse_is_inside)
            {
                menu.removeClass('open').find('.contents').hide();
            }
        });

        //////////////
    
        menu.find('.contents tr').click(function()
        {
            var text = $(this).attr('display');
            if(text == null) text = $(this).attr('text');

            menu.find('.summary .val').text(text).attr('value', $(this).attr('value')).attr('text', $(this).attr('text'));
            menu.find('.contents tr').removeClass('active');
            $(this).addClass('active');

            menu.find('.contents').hide();
            menu.removeClass('open');

            if(clickHandler != null)
            {
                clickHandler($(this));
            }
        });

        menu.find('.contents tr:first').click();
        menu.find('.contents').show();


        menu.find('.contents table').css({
            width: 'auto'
        });
        //menu.width(menu.find('.contents table').width());
        menu.find('.contents').width(menu.find('.contents table').width());
        menu.find('.contents table').css({
            width: '100%'
        });
        menu.find('.contents').hide();


        if($('body').hasClass('quirks'))
        {
        
            menu.find('.summary').hover(function()
            {
            
                $(this).addClass('hover');
            }, function()
            {
                $(this).removeClass('hover');
            });
        }
    })(jQuery);
}

(function($)
    {
        var timeoutId = null;
        var field = null;
        var suggestionsDiv = null;
        var suggestionsList = null;
        var lastISSQuery = null;
        var container = null;
        var baseUrl = window.location.hostname == 'design.amazon.com' ? 'https://design.amazon.com/mockups/dishlip/gw/proto/current/shared_includes/' : 'http://localhost:8888/gw/shared_includes/';
        //var mouseIsDown = false;
        var totalWidth = 0;

        var config =
        {
            delay: '100',
            maxSuggestions: 10,
            maxCategorySuggestions: 3,
            showCats: true,
            mode: 'standard',
            searchButton: null
        };

        var searchIndeces =
        {
            "All Departments":"aps",
            "Amazon Instant Video":"amazontv",
            "Appliances":"appliances",
            "Appstore for Android":"mobile-apps",
            "Arts, Crafts & Sewing":"arts-crafts",
            "Automotive":"automotive",
            "Baby":"baby-products",
            "Beauty":"beauty",
            "Books":"stripbooks",
            "Cell Phones & Accessories":"mobile",
            "Clothing & Accessories":"apparel",
            "Electronics":"electronics",
            "Grocery & Gourmet Food":"grocery",
            "Health & Personal Care":"hpc",
            "Home, Garden & Pets":"garden",
            "Industrial & Scientific":"industrial",
            "Jewelry":"jewelry",
            "Kindle Store":"digital-text",
            "Magazine Subscriptions":"magazines",
            "Movies & TV":"dvd",
            "MP3 Downloads":"digital-music",
            "Music":"popular",
            "Musical Instruments":"mi",
            "Office Products & Supplies":"office-products",
            "Shoes":"shoes",
            "Software":"software",
            "Sports & Outdoors":"sporting",
            "Tools & Home Improvement":"tools",
            "Toys & Games":"toys-and-games",
            "VHS":"vhs",
            "Video Games":"videogames",
            "Watches":"watches"
        }

        // Source: http://www.somacon.com/p355.php
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g,"");
        }
        String.prototype.ltrim = function() {
            return this.replace(/^\s+/,"");
        }
        String.prototype.rtrim = function() {
            return this.replace(/\s+$/,"");
        }

        $.fn.searchSuggest = function(settings)
        {
            
            if (settings) $.extend(config, settings);

            this.config = config;

            container = $(this);
            field = container.find('input.searchInput');
            field.attr('search', '');
            
            suggestionsDiv = container.find('.panel').hide();
            suggestionsList = container.find('.suggestionsList');

            field.keyup(function(e)
            {
                handleKeyup(e);
            });

            field.keydown(function(e)
            {
                handleKeydown(e);
            });
            
            field.keypress(function(e)
            {
                handleKeypress(e);
            });



            var dropdown = container.find('.menu.dropdown');

            field.focus(function(e)
            {
                //console.log('field.focus');
                if(field.attr('search').length === 0)//field.val() == field.attr('prompt'))
                {
                    field.val('');
                }
            });

            field.blur(function(e)
            {
                
                suggestionsDiv.hide();

                //console.log('field.blur');
                window.setTimeout(function()
                {
                    //console.log('field.blur.callback');
                    if(field.attr('search').length === 0 && !dropdown.hasClass('open'))
                    {
                        //console.log(field.attr('search').length === 0);
                        //console.log(dropdown.hasClass('open'));
                        field.val(field.attr('prompt'));
                    }
                }, 200);
                
            });

            if(config.searchButton !== null)
            {
                config.searchButton.click(function()
                {
                    doSearch();
                });
            }

            initDropdown();

            window.addEventListener("pageshow", resetPage, false);
            resetPage();
           
            field.attr('typed', '')

            return this;

        };

        function resetPage()
        {
            setSelectedSearchAlias('aps');
            suggestionsDiv.hide();

            field.val(field.attr('prompt')).attr('search', '');
        }


        function initDropdown()
        {
            var dropdown = container.find('.menu.dropdown');

            var table = dropdown.find('table');
            table.find('tr').remove();

            for(var key in searchIndeces)
            {
                var tr = $('<tr/>');
                var td = $('<td/>');
                tr.attr('text', key);
                tr.attr('display',  searchIndeces[key] === 'aps' ? 'Search in' : key);
                tr.attr('value', searchIndeces[key]);
                td.text(key);
                tr.append(td);
                table.append(tr);
            }
       
            initMenu(dropdown, function(tr)
            {
                onDropdownClick(tr);
            });

            
            setSelectedSearchAlias('aps');
			$(window).load(function(){
				dropdown.find('.contents').width(dropdown.find('.contents').width() + 20);
	            field.width(field.width() - dropdown.width());
				totalWidth = container.find('.inputWrap').width();
                resizeElements();
			});
				
            $(window).resize(function()
			{
				totalWidth = container.find('.inputWrap').width();
                resizeElements();
             });
       			

        }

        function resizeElements()
        {
            var dropdown = container.find('.menu.dropdown');
            field.width(totalWidth - dropdown.width());
        }

        function onDropdownClick(tr)
        {
            field.removeAttr('node');
            field.attr('alias', tr.attr('value'));
            resizeElements();
        }

        function handleKeydown(e)
        {
            var key = e.keyCode;

            switch(key)
            {
                case 40: // down arrow
                    moveDown();
                    e.stopPropagation();
                    break;
                case 38: // up arrow
                    moveUp();
                    e.stopPropagation();
                    break;
            }

        //console.log(field.attr('search'));
        }

        function moveDown()
        {
            moveHighlight(1);
        }

        function moveUp()
        {
            moveHighlight(-1);
        }

        function handleKeyup(e)
        {
            var key = e.keyCode;
            switch(key)
            {

                case 40: // down arrow
                    break;
                case 38: // up arrow
                    break;
                case 37: //left arrow
                    break;
                case 39: //right arrow
                    break;
                default:
                    if(timeoutId !== null) window.clearTimeout(timeoutId);
                    timeoutId = window.setTimeout(function(){
                        //searchSuggest(field)
                        suggest()
                    }, config.delay);
                    var query = getQuery();
                    field.removeAttr('node');
                    //field.attr('typed', query === null ? '' : query);
                    // TODO...this might be right thing to do if need to have custom text in search box
                    var typed = query === null ? '' : query;

                    field.attr('typed', typed).attr('search', typed);
                    break;
            }

        //console.log(field.attr('search'));

        }

        function handleKeypress(e)
        {
            var key = e.keyCode;

            switch(key)
            {
                case 13: // enter key
                    doSearch();
                    break;
            }
        }

        function doSearch()
        {
            //suggestionsDiv.hide();

            if(config.searchHandler != null)
            {
                var query = field.attr('search');
                if(query != null)
                {
                    config.searchHandler(query, field.attr('alias'), field.attr('node'));
                }
            }
        }

        function getNumSuggestions()
        {
            return suggestionsList.find('li').length;
        }

        function getHighlightIndex()
        {
            var index = -1;
            
            var highlight = suggestionsList.find('.highlight');
            
            if(highlight.length > 0)
            {
                index = Number(highlight.attr('index'));
            }

            return index;
        }

        function clearHighlight()
        {
            suggestionsList.find('.highlight').removeClass('highlight');
        }

        function moveHighlight(delta)
        {
            var numSuggestions = getNumSuggestions();

            var newIndex = (getHighlightIndex() + 1 + delta + numSuggestions + 1) % (numSuggestions + 1);
            
            clearHighlight();
            

            if(newIndex !== 0)
            {
                highlightIndex(newIndex - 1);
            }
            else
            {
                field
                .removeAttr('node')
                .attr('alias', getSelectedSearchAlias())
                .attr('search', field.attr('typed'))
                .val(field.attr('typed'));
            }
        }

        function getSelectedSearchAlias()
        {
            return searchIndeces[container.find('.menu.dropdown .summary .val').attr('text')];
        }

        function setSelectedSearchAlias(alias)
        {
            //console.log('setSelectedSearchAlias(' + alias + ')');
            container.find('.menu.dropdown .contents tr[value=' + alias + ']').click();
        //console.log(container.find('.menu.dropdown .contents tr[value=' + alias + ']'));
        }

        function highlightIndex(index)
        {
            field.removeAttr('node').removeAttr('alias');
            
            var highlightedSuggestion = suggestionsList.find('li:eq(' + index + ')');
            //console.log(highlightedSuggestion);
            highlightedSuggestion.addClass('highlight');

            var search = highlightedSuggestion.attr('suggestion');
            field.val(search).attr('search', search);

            if(highlightedSuggestion.attr('node') !== undefined)
            {
                field.attr('node', highlightedSuggestion.attr('node'));
            }
            else
            {

                var alias = highlightedSuggestion.attr('alias') 
                //console.log('alias: ' + alias)

                field.attr('alias', alias);
                setSelectedSearchAlias(alias);

            }
        }

        
        function suggest()
        {
            var query = getQuery();

            if(query !== null && query.toLowerCase() !== lastISSQuery)
            {

                lastISSQuery = query;
                var alias = getSelectedSearchAlias();

                if(config.mode !== 'standard')
                {
                    $.getJSON(baseUrl + 'ajax_smart_search.php?callback=?',
                    {
                        "keywords": query,
                        "alias": alias,
                        "mode": config.mode
                    },
                    function(data)
                    {
                        searchCallback(data);
                    });
                }
                else // standard
                {

                    var url = 'http://completion.amazon.com/search/complete?method=completion&q=' + escape(query) +
                    '&search-alias=' + escape(alias) +
                    '&mkt=1&sc=1&x=' + escape('jQuery.fn.searchSuggest.done');

                    $.getScript(url, function()
                    {
                        $.fn.searchSuggest.updateISSCompletion(query, alias);
                    });

                }

            }
            else if(query == null)
            {
                suggestionsDiv.hide();
            }
        }

        // just a dummy function for ISS
        $.fn.searchSuggest.done = function() {}

        function searchCallback(data)
        {
            var query = getQuery();

            if(data.keywords === query)
            {
                var suggestions = data.list;


                suggestionsList.html('');

                if(suggestions.length > 0)
                {
                    var index = 0;

                    for(var i in suggestions)
                    {
                        var suggestion = suggestions[i];
                        suggestionsList.append(createPopoverItem(suggestion, query, index++));
                    }

                    suggestionsDiv.show();
                }

                else
                {
                    suggestionsDiv.hide();
                }

                lastISSQuery = null;

                suggestionsList.find('li').each(function()
                {
                    var li = $(this);

                    li.hover(
                        function()
                        {
                            //console.log('hover');
                            clearHighlight();
                            $(this).addClass('highlight');
                        },
                        function()
                        {
                            clearHighlight();
                        });

                    li.mousedown(function(e)
                    {
                        highlightIndex($(this).attr('index'));
                        doSearch();

                    });
                });
            }
        }

        



        /*
        completion =
        [
            "avatar", //[0]
            [//[1]
                "avatar",
                "avatar 3d",
                "avatar the last airbender",
                "avatar blu-ray",
                "avatar 3d blu ray",
                "avatar the last airbender complete series",
                "avatar dvd",
                "avatar soundtrack",
                "avatar poster",
                "avatar toys"
            ],
            [//[2]
                { //[2][0]
                    "nodes":
                     [
                        {
                            "name": "Movies & TV",
                            "alias": "dvd"
                        },
                        {
                            "name": "Toys & Games",
                            "alias": "toys-and-games"
                        }
                    ]
                },
                {},//[2][1]
                {},//[2][2]
                {},//[2][3]
                {},//[2][4]
                {},//[2][5]
                {},//[2][6]
                {},//[2][7]
                {},//[2][8]
                {}
            ],
            []
        ];
        */

        function getISSCallback(alias)
        {
            return function()
            {
                $.fn.searchSuggest.updateISSCompletion(alias);
            };
        }

        $.fn.searchSuggest.updateISSCompletion = function(query, alias)
        {

            //console.log('updateISSCompletion(' + alias + ')');
            
            var data = {};

            data.keywords = query;
            data.suggestions = []
 
            data.suggestions = completion[1];
            data.indeces = {};
            data.nodes = [];
            data.list = [];


            var i;

            for(i in completion[1])
            {
                data.suggestions.push(completion[1][i]);
            }

            if(completion[2][0] !== undefined && completion[2][0].nodes !== undefined)
            {
                var nodes = completion[2][0].nodes;
                
                for(i in nodes)
                {
                    data.indeces[nodes[i].name] = nodes[i].alias;
                }
            }


            if(data.suggestions.length > 0)
            {
                // create suggestions list
                data.list.push(
                {
                    keywords: data.suggestions[0],
                    scopeType: 'alias',
                    scope: alias
                });

                i = 0;
                for(name in data.indeces)
                {
                    if(i >= config.maxCategorySuggestions) break;

                    data.list.push(
                    {
                        keywords: data.suggestions[0],
                        scopeType: 'alias',
                        scope: data.indeces[name],
                        category: name
                    });

                    i++;
                }

                for(i = 1; i < data.suggestions.length && data.list.length < config.maxSuggestions; i++)
                {
                    data.list.push(
                    {
                        keywords: data.suggestions[i],
                        scopeType: 'alias',
                        scope: alias
                    });
                }
            }
            

            searchCallback(data);
        }

        function createPopoverItem(suggestion, query, index)
        {
            var li = $('<li/>');

            var value = suggestion.keywords.replace(new RegExp('^(' + query + ')'), '<b>$1</b>');

            if(suggestion.scopeType === 'alias')
            {
                if(suggestion.scope !== 'aps' && suggestion.category !== undefined)
                {
                    value += '<span class="label"> in ' + suggestion.category + '</span>';
                }
                li.attr('alias', suggestion.scope);
            }
            else if(suggestion.scopeType === 'node')
            {
                value += '<span class="label"> in <span class="storeContextName">' + suggestion.storeContextName + '</span>&nbsp;';
                
                if(!suggestion.storeContextName.match(new RegExp(suggestion.category + '$', 'i')))
                {
                    value += '(' + suggestion.category + ')';
                }

                value += '</span>';


                li.attr('node', suggestion.scope);
            }



            li.html(value);
            li.attr('index', index);
            li.attr('suggestion', suggestion.keywords.replace('"', '&quot;'));

            li.hover(function()
            {
                //console.log('hover');
                clearHighlight();
                $(this).addClass('highlight');
            },function()
            {
                clearHighlight();
            });

            li.mousedown(function(e)
            {
                highlightIndex($(this).attr('index'));
                window.setTimeout(function() {
                    doSearch();
                }, 0);
                

            });

            return li;
        }



        function getQuery()
        {
            var query = field.val();
            return query == null || query.length == 0 ? null : query;
        }
 
    })(jQuery);




                //*$.getJSON("http://bls-smartcat-na.integ.amazon.com:2500/?callback=?",

                // browse
/*


                 if(storeContextNamesLoaded())
                {
                 $.getJSON("http://bls-smartcat-na.integ.amazon.com:2500/?JSONCallBack=?",
                  {
                    "tracker.clientID": "729894",
                    "tracker.host": "foo",
                    "tracker.programName": "foo",
                    "marketplaceID": "1",
                    "keywords": query,
                    "Operation": "getLookupNodesForKeywords",
                    "ContentType": "JSON",
                    "maxResults": "30",
                    "storedFieldNames.member.1": "nodename",
                    "storedFieldNames.member.2": "docname"


                  },
                  function(data)
                  {
                    var nodes = data.getLookupNodesForKeywordsResponse.getLookupNodesForKeywordsResult.lookupNodes;
                    //nodes.sort(nodeCompare);

                    if(nodes.length > 0)
                    {
                        var nodeCount = nodes.length;
                        for(var i = 0; i < nodeCount; i++)

                        {
                            var node = nodes[i];
                            if(node.score >= 0)
                            {
                                console.log(storeContextNames[node['browseID']] + " : " + node.score);
                            }

                        }
                    }
                    else
                        {
                            console.log("NONE");
                        }
                  }

             );


    function searchCallback(data)
        {
            var query = getQuery();

            if(data.keywords === lastISSQuery)
            {
                var suggestions = data.suggestions;

                suggestionsList.html('');

                if(suggestions.length > 0)
                {
                    var index = 0;

                    for(var i in suggestions)
                    {
                        var suggestion = suggestions[i];
                        suggestionsList.append(createPopoverItem(suggestion, query, index));

                        index++;

                        if(i == 0 && config.showCats)
                        {
                            for(var j in data.indeces)
                            {
                                suggestionsList.append(createPopoverItem(suggestion, query, index, data.indeces[j]));
                                index++;

                                if(j == config.maxCategorySuggestions-1) break;
                            }
                        }

                        if(index === config.maxSuggestions) break;
                    }
                    suggestionsDiv.show();
                }
                else
                {
                    suggestionsDiv.hide();
                }

                lastISSQuery = null;

                suggestionsList.find('li')
                .hover(
                    function()
                    {
                        clearHighlight();
                        $(this).addClass('highlight');
                    },
                    function()
                    {
                        clearHighlight();
                    })
                .click(function()
                {
                    field.val($(this).attr('suggestion'));
                    doSearch();

                });
            }
        }

                }*/

    /*function searchCallback(data)
        {
            //data['nodes'].sort(nodeCompare)

            var query = getQuery();

            if(data.keywords === lastISSQuery)
            {
                var suggestions = data.suggestions;

                suggestionsList.html('');

                if(suggestions.length > 0)
                {
                    var index = 0;

                    for(var i in suggestions)
                    {
                        var suggestion = suggestions[i];
                        suggestionsList.append(createPopoverItem(suggestion, query, index));

                        index++;

                        if(i == 0 && config.showSmartCats)
                        {
                            for(var j = 0; j < data.nodes.length; j++)
                            {
                                var node = data.nodes[j];
                                //console.log(node);

                                var type = node.type;
                                if(type === 'Department') type = node.category;
                                else type = node.category + ' ' + type;

                                //suggestionsList.append(createPopoverItem('&nbsp;&nbsp;&nbsp;&nbsp;' + node.storeContextName + ' [' + type + ']', query, index));

                                var item = createPopoverItem(suggestion, query, index, node);
                                //console.log(item);
                                item.addClass('subcat');
                                suggestionsList.append(item);


                                index++;


                                if(index > config.maxNodes) break;
                            }


                        }


                        if(i == 0 && config.showCats)
                        {
                            for(var name in data.indeces)
                            {

                                suggestionsList.append(createPopoverItem(suggestion, query, index, {
                                    name:name,
                                    alias:data.indeces[name]
                                    }));
                                index++;

                                if(j == config.maxCategorySuggestions-1) break;
                            }
                        }

                        if(index === config.maxSuggestions) break;
                    }
                    suggestionsDiv.show();
                }
                else
                {
                    suggestionsDiv.hide();
                }

                lastISSQuery = null;




                suggestionsList.find('li').each(function()
                {
                    var li = $(this);

                    li.hover(
                        function()
                        {
                            //console.log('hover');
                            clearHighlight();
                            $(this).addClass('highlight');
                        },
                        function()
                        {
                            clearHighlight();
                        });

                    li.mousedown(function(e)
                    {
                        //console.log(e);
                        //mouseIsDown = true;
                        highlightIndex($(this).attr('index'));
                        doSearch();

                    });

                });


            }
        }*/

    // query
        // menuLabel
        // textboxLabel
        /*function createPopoverItem(suggestion, query, index, node)
        {
            var li = $('<li/>');

            var value = suggestion.replace(new RegExp('^(' + query + ')'), '<b>$1</b>');


            if(node)
            {
                li.addClass('subcat');
                if(node.alias)
                {
                    li.attr('alias', node.alias);

                    value += '<span class="label"> in ' + node.name + '</span>';
                }
                else
                {
                    li.attr('node', node.id);

                    value += '<span class="label"> in <span class="storeContextName">' + node.storeContextName + '</span>&nbsp;';

                    //var categoryWords = node.category.split(' ');
                    //console.log(categoryWords[categoryWords.length - 1]);

                    if(!node.storeContextName.match(new RegExp(node.category + '$', 'i')))
                    {
                        value += '(' + node.category + ')';
                    }

                    value += '</span>';
                }


            }
            else
            {
                li.attr('alias', 'aps');
            }

            li.html(value);
            li.attr('index', index);
            li.attr('suggestion', suggestion.replace('"', '&quot;'));

            return li;
        }*/


     /*function standardSuggest()
        {
            searchTimeoutId = null;

            var query = getQuery();

            if(query != null && query != lastISSQuery)
            {

                lastISSQuery = query;

                $.getJSON(baseUrl + 'ajax_smart_search.php?',
                {
                    "keywords": query,
                    "alias": getSelectedSearchAlias(),
                    "mode": config.showSmartCats ? 'smartCats' : 'standard'
                },
                function(data)
                {
                    searchCallback(data);
                });

            }
            else if(query == null)
            {
                suggestionsDiv.hide();
            }
        }*/



        /*function smartSuggest()
        {
            searchTimeoutId = null;

            var query = getQuery();

            if(query != null && query != lastISSQuery)
            {

                lastISSQuery = query;

                $.getJSON(baseUrl + 'ajax_smart_search.php?',
                {
                    "keywords": query,
                    "alias": getSelectedSearchAlias(),
                    "mode": config.showSmartCats ? 'smartCats' : 'standard'
                },
                function(data)
                {
                    //console.log('data');
                    searchCallback(data);
                });

            }
            else if(query == null)
            {
                suggestionsDiv.hide();
            }
        }*/

    /*function searchSuggest()
        {
            searchTimeoutId = null;

            var query = getQuery();

            if(query != null && query != lastISSQuery)
            {

                lastISSQuery = query;

                var url = 'http://completion.amazon.com/search/complete?method=completion&search-alias=aps&mkt=1&sc=1&x=' + escape('$.fn.searchSuggest.updateISSCompletion') + '&q=' + escape(query);

                $.getScript(url);
            }
            else if(query == null)
            {
                suggestionsDiv.hide();
            }
        }

        function browseSuggest(keywords)
        {

            $.getJSON(baseUrl + 'ajax_smart_cats.php?callback=?',
            {
                "keywords": keywords
            },
            function(data)
            {
                if(suggestionsList.is(':visible'))
                {
                    var secondItem = suggestionsList.find('li:eq(1)');

                    for(var i in data.nodes)
                    {
                        var nodeSuggestion = data.nodes[i].storeContextName;
                        secondItem.before('<li>&nbsp;&nbsp;' + nodeSuggestion + '</li>');
                    }
                }

            });

        }

        function nodeCompare(a, b)
        {
            return b.score - a.score;
        }*/

		var hoverDelay = 500;


		(function($)
		{
		    var baseUrl = 'https://design.amazon.com/mockups/dishlip/gw/proto/current/';

		    function preload_image(url)
		    {
		        //console.log('preload');
		        var img = new Image();
		        img.src = baseUrl + url;

		    }


		/*

		    preload_image('nav/images/browse-trigger.png');
		    preload_image('nav/images/browse-trigger-active.png');
		    preload_image('nav/images/ya-trigger.png');
		    preload_image('nav/images/ya-trigger-active.png');
		    preload_image('nav/images/cart-trigger.png');
		    preload_image('nav/images/cart-trigger-active.png');
		    preload_image('nav/images/wishlist-trigger.png');
		    preload_image('nav/images/wishlist-trigger-active.png');
		    */

		   /*
		    preload_image('nav/images/nav-bg.png');
		    preload_image('nav/images/logo.png');
		    preload_image('nav/images/search-button.png');
		    preload_image('images/down-arrow.png');
		    */

		    $.fn.nav = function(settings)
		    {
		        var config =
		        {
		            hideDelay: -1
		        };

		        if (settings) $.extend(config, settings);

		        return this.each(function()
		        {
		            var nav = $(this);
		            nav.attr('state', 'unrec');

		            /*nav.find('*').andSelf().each(function()
		            {
		                var elem = $(this);



		                elem.mouseover(function()
		                {
		                    nav.addClass('hovering');
		                    nav.attr('hovering', 1);
		                });

		                if(config.hideDelay !== -1)
		                {
		                    elem.mouseout(function()
		                    {
		                        nav.removeAttr('hovering');

		                        window.setTimeout(function()
		                        {
		                            if(nav.attr('hovering') === undefined)
		                            {
		                                nav.removeClass('hovering');

		                            }
		                        }, config.hideDelay);
		                    });
		                }

		            });*/


		            var subNavSource = $('#navSubnavRowTR');
		            var hasSubNav = subNavSource.css('display') !== 'none';


		            if(hasSubNav)
		            {
		                nav.attr('subNav',1);
		                var subNav = $('<div navID="subNav"><table><tr> </td></table></div>');
		                nav.append(subNav);
		                var tr = subNav.find('tr');

		                subNavSource.find('a.navCatA, a.navSubA').each(function()
		                {
		                    var link = $(this);

		                    var td = $('<td><a> </a></td>');
		                    var a = td.find('a');

		                    a.attr('href', link.attr('href')).text(link.text());

		                    if(link.hasClass('navCatA'))
		                    {
		                        a.addClass('cat');
		                    }

		                    tr.append(td);

		                });
		            }
		        });   
		    };


		    $.fn.nav.onSearch = function(keywords, alias, node)
		    {

		        var location = 'http://www.amazon.com/s?keywords=' + escape(keywords);

		        if(node !== undefined)
		        {
		            location += ('&node=' + escape(node));
		        }
		        else
		        {
		            location += ('&search-alias=' + escape(alias !== undefined ? alias : 'aps'));
		        }

		        window.location = location;
		    };

		    $.fn.nav.onAllResourcesLoaded = function()
		    {
		        var nav = $('#nav');

		        nav.find('.flyoutMenu').flyoutMenu();

		        window.suggest = nav.find('.searchSuggest').searchSuggest(
		        {
		            searchHandler: $.fn.nav.onSearch,
		            mode: 'standard',
		            searchButton: nav.find('[navID=searchButton]')
		        });

		        nav.nav();

		        nav.find('[navID=browse] .flyout').browseFlyout();


		        $('#nav [navID=cart] .trigger a').append('<div class="cartCount" count="0">0</div>');


		        $('.triangle').each(function()
		        {
		            $(this).attr('width', 9).attr('height', 5);
		            var canvas = this;
		            var ctx = canvas.getContext('2d');
		            ctx.fillStyle = $(this).attr('color');
		            ctx.beginPath();
		            ctx.moveTo(0,0);
		            ctx.lineTo(9,0);
		            ctx.lineTo(4.5,5);
		            ctx.lineTo(0,0);
		            ctx.fill();
		        });
		    };

		    $.fn.flyoutMenu = function(settings)
		    {
		        var config =
		        {
		            hideDelay: 500,
		            showDelay: 250,
		            mode: 'hover'
		        };

		        localStorage['keys'] = '';



		        if (settings) $.extend(config, settings);

		        return this.each(function()
		        {
		            var timer = null;
		            var menu = $(this);
		            var trigger = menu.find('.trigger');
		            if(trigger.length === 0)
		            {
		                trigger = $('<div class="trigger"> </div>');
		            }

		            var mode = menu.attr('mode');
		            if(mode === undefined) mode = config.mode;

		            //console.log('mode: ' + mode);

		            var flyout = menu.find('.flyout');


		            menu.prepend(trigger).append(flyout);



		            trigger.hover(function()
		            // trigger enter
		            {
		                //console.log(menu.attr('navID') + ' - in')
		                showMenu(true);

		            }, function()
		            // trigger leave
		            {
		                //console.log(menu.attr('navID') + ' - out')
		                hideMenu(true);
		            });

		            flyout.hover(function()
		            // flyout enter
		            {
		                flyout.attr('active', 1);
		            }, function()
		            // flyout leave
		            {
		                hideMenu(true);
		                flyout.removeAttr('active');
		            });


		            if(mode === 'click')
		            {
		                trigger.find('a').click(function(e)
		                {
		                    e.preventDefault();
		                });

		                trigger.click(function(e)
		                // flyout enter
		                {


		                    if(menu.attr('active') === undefined)
		                    {
		                        showMenu(false);
		                    }
		                    else
		                    {
		                        //hideMenu(false);

		                    }
		                });
		            }

		            var hideOtherMenus = function()
		            {
		                $('.flyoutMenu[navID!=' + menu.attr('navID') +']').each(function()
		                {
		                    resetMenu($(this));
		                });
		            };

		            var clearTimer = function()
		            {
		                //console.log('clear timer');
		                if(timer !== null)
		                {
		                    window.clearTimeout(timer);
		                //console.log('clear timer')
		                }
		            };

		            var hideMenu = function(delayed)
		            {
		                //console.log(['hideMenu', menu.attr('navID')]);

		                clearTimer();
		                //console.log('hide: start timer');
		                var action = function()
		                {
		                    //console.log(['hide timer done', menu.attr('navID')]);
		                    if(flyout.is(':visible') && flyout.attr('active') === undefined)//trigger.attr('active') === undefined && flyout.attr('active') === undefined)
		                    {
		                        logEvent('hide');
		                        resetMenu(menu);
		                    }
		                };

		                if(delayed) timer = window.setTimeout(action, config.hideDelay);
		                else action();
		            };

		            var showMenu = function(delayed)
		            {

		                //console.log(['showMenu', menu.attr('navID')]);

		                clearTimer();

		                //console.log('show: start timer');
		                var action = function()
		                {
		                    //console.log(['show timer done', menu.attr('navID')]);
		                    if(!flyout.is(':visible'))//trigger.attr('active') === undefined && flyout.attr('active') === undefined)
		                    {
		                        logEvent('show');
		                        hideOtherMenus();
		                        menu.attr('active', 1);
		                        flyout.show();
		                    }
		                };


		                if(delayed) timer = window.setTimeout(action, config.showDelay);
		                else action();
		            };

		            var logEvent = function(event)
		            {
		                var key = new Date().getTime();
		                if(localStorage['keys'] === undefined) localStorage['keys'] = key;
		                else localStorage['keys'] = localStorage['keys'] + ',' + key;
		                localStorage[key] = [event, menu.attr('navID')];

		            }



		            var resetMenu = function(menu)
		            {
		                menu.find('.flyout').hide();//.removeAttr('active');
		                menu.find('.trigger');//.removeAttr('active');//.css('opacity', 1).
		                menu.removeAttr('active').removeAttr('timer');
		            }
		        });
		    }


		    $.fn.browseFlyout = function(settings)
		    {
		        var config =
		        {
		        };

		        if (settings) $.extend(config, settings);

		        return this.each(function()
		        {
		            var flyout = $(this);


		            var left = flyout.find('[navID=browseLeft]');
		            var right = flyout.find('[navID=browseRight]');

		            flyout.find('li').hover(function()
		            {
		                $(this).addClass('hover');
		            },function()
		            {
		                $(this).removeClass('hover');
		            });

		            // change to proper html structure later
		            right.find('li').click(function()
		            {
		                window.location = $(this).find('a').attr('href');
		            });


		            flyout.show();
		            //right.find('.browseMenuPanel').not('.multiColumn').removeClass('hide');
		            //var maxWidth = 240;
		            //right.find('.browseMenuPanel').not('.multiColumn').addClass('hide').find('ul').css('width', maxWidth);


		            right.find('.browseMenuPanel').removeClass('hide');
		            var maxWidth = 240;
		            right.find('.browseMenuPanel').addClass('hide').find('ul').css('width', maxWidth);

		            right.css('overflow', 'hidden').css('height', left.height());



		            right.hover(function()
		            {
		                right.css('overflow', 'auto');
		            },
		            function()
		            {
		                right.css('overflow', 'hidden');
		            });

		            flyout.hide();



		            left.find('li').each(function()
		            {
		                var li = $(this);
		                var a = li.find('a');
		                if(a.attr('href') === '#')
		                {

		                    li.click(function(e)
		                    {
		                        left.find('li').removeClass('selected');
		                        li.addClass('selected');

		                        flyout.find('.browseMenuPanel').addClass('hide');
		                        var menuID = li.find('a').text().replace(/[^a-zA-Z]/g, '');
		                        var content = right.find('[menuID=' + menuID + ']');
		                        content.removeClass('hide');

		                        if(flyout.attr('showRight') === undefined)
		                        {

		                            flyout.attr('showRight', 1);

		                            // hacks to get working in chrome correctly when used in context
		                            // of website (chrome extension).  not sure why this happens!
		                            right.css('border', 'none');
		                            left.css('border', 'none');
		                            // end hacks

		                            var rightWidth = right.width();

		                            var marginSave = right.css('margin-left')
		                            right.css({
		                                marginLeft: -rightWidth-40,
		                                opacity:.5
		                            });
		                            flyout.css({
		                                overflow: 'hidden'
		                            });

		                            right.animate({
		                                marginLeft:marginSave,
		                                opacity:1
		                            }, 250, 'swing', function()

		                            {
		                                    flyout.css('overflow', '');

		                                    console.log('width: ' +right.width());

		                                });
		                            //}, 200);
		                        }

		                        e.preventDefault();

		                    });
		                }
		            });

		        });

		    };

		})(jQuery);
		
		$(document).ready(function() {
			  $.fn.nav.onAllResourcesLoaded();

	            $('.triangle').each(function()
	            {
	                $(this).attr('width', 9).attr('height', 5);
	                var canvas = this;
	                var ctx = canvas.getContext('2d');
	                ctx.fillStyle = $(this).attr('color');
	                ctx.beginPath();
	                ctx.moveTo(0,0);
	                ctx.lineTo(9,0);
	                ctx.lineTo(4.5,5);
	                ctx.lineTo(0,0);
	                ctx.fill();
	            });

	        function drawTriangle(id, color)
	        {
	            var canvas = document.getElementById(id);
	            var ctx = canvas.getContext('2d');
	            ctx.fillStyle = color;
	            ctx.beginPath();
	            ctx.moveTo(0,0);
	            ctx.lineTo(9,0);
	            ctx.lineTo(4.5,5);
	            ctx.lineTo(0,0);
	            ctx.fill();
	        }
		
			$('body').css({
				margin:'0px 10px',
				paddingTop:$("#nav").outerHeight()
			});
			
		});
		

		
		