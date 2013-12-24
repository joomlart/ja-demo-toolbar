jQuery(document).ready(function($) {
	var active_catalog = '',
		active_product = null,
		total_pages = 1,
		resizeSid = null;

	// update navigation
	updatenav = function() {
		var products = $('.catalog-' + active_catalog + ' .products-wrap-inner');
		var active_page = products.data('active_page') || 0;

		if (!products.length) {
			return;
		}

		total_pages = Math.floor((products.find(':first').height() - 50) / products.height()) + 1;
		var navitems = $('.active ul.pagination li');
		navitems.filter(':gt(' + total_pages + ')').not('.next').addClass('hide');
		navitems.filter(':lt(' + (total_pages + 1) + ')').removeClass('hide');
		// current page
		navitems.removeClass('current');

		var new_active_page = active_page;
		if (active_page < 1) {
			new_active_page = 1;
		} else if (active_page > total_pages) {
			new_active_page = total_pages;
		}
		gotopage(new_active_page);

		// hide the pagination if total_pages lt 2
		if (total_pages < 2) {
			$('.pagination').addClass ('invisible');
		} else {
			$('.pagination').removeClass ('invisible');
		}

		// navitems.eq (active_page).addClass ('current');
	},

	// events 
	gotopage = function(page) {
		if (page > total_pages || page < 1) {
			return;
		}
		var products = $('.catalog-' + active_catalog + ' .products-wrap-inner');
		if (!products.length) {
			return;
		}

		var active_page = products.data('active_page') || 0;

		var pages = $('.active ul.pagination li');
		products.removeClass('page' + active_page).addClass('page' + page);
		pages.removeClass('current').eq(page).addClass('current');

		if (page == 1) {
			pages.filter('.prev').addClass('inactive');
		} else {
			pages.filter('.prev').removeClass('inactive');
		}

		if (page == total_pages) {
			pages.filter('.next').addClass('inactive');
		} else {
			pages.filter('.next').removeClass('inactive');
		}

		products.data('active_page', page);
	},

	// open product 
	openproduct = function(product) {
		if (product != active_product) {

			var jprod = $(product),
				url = jprod.data('url'),
				name = jprod.data('name'),
				title = jprod.find('.product-info h3:first').html(),
				badge = jprod.data('badge'),
				curr_badge = $(active_product).data('badge');

			if (!url) {
				return ; // do nothing
			}
			
			jprod.addClass('current');
			// set current status 
			if (active_product) {
				$(active_product).removeClass('current');
			}

			// update title
			$('#catalog-selector h3:first').html(title);
			$(document.body).addClass('demo-loading');
			// load
			//update selector badge class
                        var catalogSelector = $('#catalog-selector');
			if (curr_badge) catalogSelector.removeClass(curr_badge);
			catalogSelector.addClass(badge);

			//should check if the demo frame is exist or not. based on context
			$('#fraDemo').attr('src', url).one('load', function() {
				$(document.body).removeClass('demo-loading');
			});

			// Add link for remove iframe
			$('.btn-close').attr('href', url);

			active_product = product;
			location.hash = name;
		}
	},

	// toggle selector
	togglecatalog = function(cat) {
		if (cat == active_catalog) {
			// toggle it
			if ($('#catalog-selector').hasClass('open')) {
				hidecatalog(cat);
				activecatalog($(active_product).parents('.catalog-inner').data('catalog'));
			} else {
				showcatalog(cat);
			}
		} else {
			// close old, open new 
			hidecatalog(active_catalog);
			showcatalog(cat);
			active_catalog = cat;
		}
	},

	showcatalog = function(cat) {
		var jcat = $('#catalog'),
			jacat = $('.catalog-' + cat);

		if (cat != active_catalog) {
			jcat.removeClass('open-' + active_catalog);
		}

		jcat.addClass('open').addClass('open-' + cat);
		$('#catalog-selector').addClass('open');
		jacat.addClass('active').removeClass('hidding');

		// Trigger show event for lazy load
		if (!jacat.data('trigger-showimg')) {
			$('img.lazy', jacat).trigger('showimg');
			jacat.data('trigger-showimg', 1)
		}
		// add class to body
		$(document.body).addClass('catalog-open');
		// update pagination
		setTimeout(updatenav, 100);

		// bind arrow key
		$(document).bind('keydown', arrowpress);
	},

	hidecatalog = function(cat) {
		var products = $('.catalog-' + active_catalog + ' .products-wrap-inner'),
			active_page = products.data('active_page') || 0;
		$('ul.pagination li.current').removeClass('current');
		// $('.products-wrap-inner').removeClass('page' + active_page);
		$('#catalog-selector').removeClass('open');
		$('#catalog').removeClass('open').removeClass('open-' + cat);
		$('.catalog-' + cat).removeClass('active').addClass('hidding');
		$(document.body).removeClass('catalog-open');

		// unbind arrow key
		$(document).unbind('keydown', arrowpress);
	};

	activecatalog = function(cat) {
		if (active_catalog == cat) return;
		$('#catalog-types a').removeClass('current');
		$('#catalog-types a.type-' + cat).addClass('current');
		active_catalog = cat;
	}
        
        changeDownloadUrl = function(download_url){
          $('.btn-get-it-now').attr('href',download_url);
        }

	// init lazy load
	$('img.lazy', this).lazyload({
		event: "showimg",
		failure_limit: 10
	});


	// Add filter event
	$('.filter').click(function() {
		var catalog = $(this).closest('.catalog-inner'),
			prop = this.hash.substr(1);

		prop = (!prop || prop == 'all') ? '*' : ('.' + prop);

		catalog.find('.filter, .filter-more').removeClass('current');
		$(this).addClass('current');

		// add active for parent
		$(this).closest('.filter-more').addClass('current');
		catalog.find($(this).closest('.filter-categories').length ? '.filter-years .filter:first' : '.filter-categories .filter:first').addClass('current');

		// filter with this property
		// hide products to prepare showing
		catalog.find('.products-wrap').addClass('hidding');
		setTimeout(function() {
			catalog.find('.products-wrap .product').removeClass('hide').not(prop).addClass('hide');
			catalog.find('.products-wrap').removeClass('hidding');
			updatenav();
		}, 600);

		return false;
	});

	// bind event for nav 
	$('ul.pagination li').click(function() {
		var jpitem = $(this),
			action = jpitem.text().toLowerCase();

		if (jpitem.hasClass('inactive') || jpitem.hasClass('hide')) {
			return;
		}

		var products = $('.catalog-' + active_catalog + ' .products-wrap-inner'),
			active_page = products.data('active_page') || 0;

		switch (action) {
		case 'prev':
			gotopage(active_page - 1);
			break;
		case 'next':
			gotopage(active_page + 1);
			break;
		default:
			gotopage(parseInt(action));
			break;
		}
	});

	// scroll event
	$('.products-wrap-inner').bind('mousewheel', function(event, delta, deltaX, deltaY) {		
		var $this = $(this),
			products = $this,
			active_page = products.data('active_page') || 0;
		if ($this.data ('timeout')) {
			clearTimeout ($this.data ('timeout'));
		}
		$this.data ('timeout', setTimeout (
			function () {
				gotopage(active_page - delta);
			},
			300
		));
	});
	// bind arrow key
	var arrowpress = function (e) {
		var products = $('.catalog-' + active_catalog + ' .products-wrap-inner'),
			active_page = products.data('active_page') || 0,
			delta = 0;
	    if (e.keyCode == 37 || e.keyCode == 38) {
	    	// left/up = prev
	       	delta = 1;
	    }
	    if (e.keyCode == 39 || e.keyCode == 40) { 
	    	// right/down = next
	       	delta = -1;
	    }
	    gotopage(active_page - delta);
	}

	// Select product
	$('.product').click(function(event) {
		// do nothing if there's no url
		if (!$(this).data('url')) return;

		event.preventDefault();
                changeDownloadUrl($(this).attr('data-download-url'));
		openproduct(this);
		// close 
		togglecatalog(active_catalog);
	});

/********************************************/
	current_url = window.location.href;
	parts = current_url.split("#");
	if (parts.length == 2) {
		current_product_name = parts[1];
		$('.product').each(function(){
			if(current_product_name == $(this).attr('data-name')) {
				changeDownloadUrl($(this).attr('data-download-url'));
			}
		});
	}
	else {
		$('.product').eq(0).each(function(){
		  changeDownloadUrl($(this).attr('data-download-url'));;
		});
	}
/********************************************/

	// click on link inside product
	$('.product a').click(function(event) {
		event.stopPropagation();
	});

	$(window).resize(function() {
		clearTimeout(resizeSid);
		resizeSid = setTimeout(updatenav, 300);
	});

	$('#catalog-selector').click(function(event) {
		event.preventDefault();
		togglecatalog(active_catalog);
	});

	$('#catalog-types a').click(function(event) {
		event.preventDefault();
		$('#catalog-types a').removeClass('current');
		$(this).addClass('current');
		togglecatalog($(this).data('catalog'));
	});

	// open first product
	var pname = location.hash.replace(/\#/g, ''),
		jinitprod = $(pname ? '.product[data-name="'+pname+'"]' : '.product:first');

	if (!jinitprod.length) {
		jinitprod = $('.product:first');
	}
	// detect active catalog base on active product
	activecatalog(jinitprod.parents('.catalog-inner').data('catalog'));

	if (jinitprod.length) {
		$(window).load (function () {
			openproduct(jinitprod[0]);
		});
	}

	// click outsite the open catalog
	$('#demo-overlay, #demo-page .main').click(function(event) {
		event.preventDefault();
		// if loading demo, return
		if ($('body').hasClass ('demo-loading')) return;
		togglecatalog(active_catalog);
	});

	$('#demo-page .main > div').click(function(event) {
		event.stopPropagation();
	});

	// special for touch devices

	if( 'ontouchstart' in document.documentElement ) {
		var clickable_product = null;
		var events = $('.product').data('events');
		if (events && events['click'] && events['click'].length) {
			// bind current click event to doclick
			$.each (events['click'], function (i, f) {
				$('.product').bind ('doclick', f.handler);
			});

			// unbind click event and replace by touchstrt
			$('.product').unbind ('click').bind ('touchstart', function (event) {
				event.stopPropagation();
				if (clickable_product != this) {
					// first touch
					clickable_product = this;
				} else {
					// second touch - trigger doclick 
					$(this).trigger ('doclick');
					clickable_product = null;
				}
			});

			// touch outside
			$(document).bind ('touchstart', function (event) {
				clickable_product = null;
			});
		}
	}

	// open wall tour 
	$('#wall-tour').click(function(event){
		event.preventDefault();
		if (!$('#jawall-wrap').length) {
			// add css
			$('<link/>', {rel: 'stylesheet', type: 'text/css', href: 'http://www.joomlart.com/templates/ja_v2/core/themes/wall/css/template.css'}).appendTo ('head');
			// Add wall intro into body
			var jawall_wrap = $('<div/>', {id: 'jawall-wrap'}).appendTo ('body');
			$('<div/>', {id: 'jawall-inner'}).appendTo (jawall_wrap).append (
					$ ('<iframe/>', {id: 'jawall-iframe', src: 'http://www.joomlart.com/wall/'}) );
		}
		// add skip to home button after 10s
		$('body').addClass ('jawall-intro');
		setTimeout (function(){
			$('#jawall-wrap').addClass ('show');
		}, 100);
		// wait 2' to show the intro
		setTimeout (function(){
			$('#jawall-inner').addClass ('show');
			$('#jawall-iframe').focus();
		}, 2000);		
	})
});

// close jawall intro
var jawall_close = function () {	
	$('#jawall-inner').addClass('hide').removeClass ('show');
	// remove intro after 2s
	$('#jawall-wrap').removeClass('show');
	setTimeout (function(){
		$('body').removeClass ('jawall-intro');
		$('#jawall-wrap').remove();
	}, 2000);
};
