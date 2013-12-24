jQuery(document).ready(function($){
  // build catalog list 
  var catalog = $('.catalog-inner');
  var firstcat='';
  for (var cat in data) {
    if (firstcat) {
      catalog.clone().addClass ('catalog-'+cat).appendTo (catalog.parent());
    } else {
      firstcat = cat;
    }
  }
  catalog.addClass ('catalog-'+firstcat);
  // build product list for each catalog 
  for (var cat in data) {
    // product categories
    var years = {};
    var tags = {};
    var products = data[cat];
    var catalog = $('.catalog-'+cat);
    var ghost = $('.catalog-'+cat+' .product-ghost');
    var template = decodeURIComponent(ghost.html());  
    $(products).each (function(i, item){
      var product = template;
      // update value 
      for (attr  in item) {
        product = product.replace (new RegExp('{'+attr+'}', 'g'), item[attr]);
      }
      var p = $('<div>', {'class': 'product', 'html': product});
      // $('.products-wrap').append(p);
      p.insertBefore(ghost);
      // add class tags & year    
      p.addClass (item.tags).addClass('year-'+item.year);
      // add product to categories
      var _tags = item.tags.split(' ');
      $(_tags).each(function(i, tag){
        if (!tag || tag==' ') return;
        tags[tag] = tags[tag]?tags[tag]+1:1;
      });
      years[item.year] = years[item.year]?years[item.year]+1:1;
    });
    ghost.remove();
    // show years / tags filter
    var filter = catalog.find('.filter-years .filter-ghost:first').removeClass('filter-ghost');
    var filter_html = decodeURIComponent($( $('<div></div>').html(filter.clone())).html());
    var _years = $.map(years, function(value, key) {
      return key;
    }).sort().reverse();
    $(_years).each(function(i, y) {
      // update value 
      var nf_html = filter_html.replace(/{filter}/g, 'year-'+y).replace(/{text}/g, y).replace(/{counter}/g, years[y]);
      var nf = $(nf_html);
      // 
      if (i+1>visible_years) {
        nf.appendTo (catalog.find('.filter-years .more-childs'));
      } else {
        nf.insertBefore (filter);
      }
    });
    filter.remove();  
    // active the first (all)
    catalog.find('.filter-years .filter:first').addClass('current');
    
    // tags 
    var filter = catalog.find('.filter-categories .filter-ghost:first').removeClass('filter-ghost');
    var filter_html = decodeURIComponent($( $('<div></div>').html(filter.clone())).html());
    
    var _tags = visible_tags.slice();
    $.map(tags, function(value, key) {
      if ($.inArray(key, _tags)==-1) _tags.push (key);
    });
    $(_tags).each (function (i, t){
      if ($.inArray(t, visible_tags)>-1 || tags[t]>3) {
        var nf_html = filter_html.replace(/{filter}/g, t).replace(/{text}/g, t).replace(/{counter}/g, tags[t]);
        var nf = $(nf_html);
        if ($.inArray(t, visible_tags)>-1) {
          nf.insertBefore (filter);        
        } else {
          nf.appendTo (catalog.find('.filter-categories .more-childs'));
        }
      }
    });
    filter.remove();  
    // active the first (all)
    catalog.find('.filter-categories .filter:first').addClass('current');
  }
  // init lazy load
  $("img.lazy").lazyload({ 
    container: $('.products-wrap'),
    failure_limit : 10,
    threshold: 200
  });

  jQuery('.products-wrap-inner').metro({cols: 'auto'});  
  // Add filter event
  $('.filter').click(function(){
    var catalog = $(this).parents('.catalog-inner');
    var prop = this.hash.replace('#','');
    if (!prop || prop == 'all') prop = '*';
    else prop = '.'+prop;
    
    catalog.find('.filter').removeClass('current');
    catalog.find('.filter-more').removeClass ('current');
    $(this).addClass('current');
    // add active for parent
    if ($(this).parents('.filter-more').length) {
      $(this).parents('.filter-more').addClass('current');
    }
    if ($(this).parents('.filter-categories').length) {
      catalog.find('.filter-years .filter:first').addClass('current');
    } else {
      catalog.find('.filter-categories .filter:first').addClass('current');
    }
    
    // filter with this property
    catalog.find('.products-wrap .product').removeClass('hide').not(prop).addClass('hide');
    // update position_layout
    // position_layout();
    catalog.find('.products-wrap-inner').metro('reLayout');  
    return false;
  });
  
  // open product 
  var openproduct = function (product) {
    if (product != active_product) {
      // set current status 
      if (active_product) {
        active_product.removeClass ('current');
      }
      product.addClass('current');
      var url = product.find('.product-info').attr('rel');
      var title = product.find('.product-info h3:first').html();
      // update title
      $('#catalog-selector h3:first').html (title);
      // load
      $('#fraDemo').attr('src', url);
      // hide current
      $('#demo-overlay').addClass('active');
      $('#fraDemo').one ('load', function (){
        $('#demo-overlay').removeClass('active');
      });
      active_product = product;
    }    
  };
  // Select product
  $('.product').click(function(){
    var product = $(this);
    openproduct (product);
    // close 
    togglecatalog (active_catalog);
  });
  
  // height for catalog
  var pwHeight = function (){
    var catalog = $('#catalog');
    if (!catalog.hasClass('open')) return ;
    var h = $(window).height() - catalog.offset().top;
    $('.catalog-inner').height (h-50);
  }
  
  $(window).resize (function() {
    $('#catalog').resizeTimeout = setTimeout(
      function() {
        if ($('#catalog').resizeTimeout) {
          clearTimeout($('#catalog').resizeTimeout);
        }
        pwHeight();
      }, 300);
  });    
  // toggle selector
  var active_catalog = $('#catalog-types a.current').attr('rel');
  var active_product = '';
  var togglecatalog = function (cat) {
    var sel = $('#catalog-selector');
    if (cat == active_catalog) {
      // toggle it
      if (sel.hasClass('open')) {
        sel.removeClass ('open');
        $('#catalog').removeClass('open').removeClass('open-'+cat);
      } else {
        showcatalog(cat);
      }
    } else {
      // close old, open new 
      showcatalog(cat);
      active_catalog = cat;
    }
  };
  
  var showcatalog = function (cat) {
    if (cat != active_catalog) $('#catalog').removeClass('open-'+active_catalog);
    $('#catalog-selector').addClass('open');
    $('#catalog').addClass('open').addClass('open-'+cat); 
    pwHeight ();
    $('.catalog-'+cat+' .products-wrap-inner').metro('layout');  
  };
  
  $('#catalog-selector').click (function(){
    togglecatalog (active_catalog);
  });
  
  $('#catalog-types a').click (function(){
    $('#catalog-types a').removeClass ('current');
    $(this).addClass('current');
    togglecatalog (this.rel);
  });
  
  // open first product 
  openproduct ($('.catalog-'+active_catalog+' .product:first'));
  
  // hover item
  $('.product-inner').mouseenter(function(event){
    var $this = $(this);
    var x=event.pageX,
      y = event.pageY,
      t = $this.offset().top,
      l = $this.offset().left,
      w = $this.width(),
      h = $this.height();
    var cls = getPos(x,y,t,l,w,h);
    // stop animation to prepare position
    $this.removeClass ('animate');
    // setup position
    $this.removeClass('from-top from-left from-right from-bottom').addClass ('from-'+cls);
    // enable animation
    this.timeout = setTimeout(function(){$this.addClass ('animate').addClass('active')}, 0)  ;
  });
  
  $('.product-inner').mouseleave(function(event){
    clearTimeout(this.timeout);
    var $this = $(this);
    var x=event.pageX,
      y = event.pageY,
      t = $this.offset().top,
      l = $this.offset().left,
      w = $this.width(),
      h = $this.height();
    var cls = getPos(x,y,t,l,w,h);
    // update position class
    $this.removeClass('from-top from-left from-right from-bottom').addClass ('from-'+cls);
    // fly out
    $this.removeClass ('active');
  });
  
  /**
   * Get the mouse direction - base on the script at http://tympanus.net/TipsTricks/DirectionAwareHoverEffect/ 
  */
  getPos = function (x,y,t,l,w,h) {
			var _x = ( x - l - ( w/2 )) * ( w > h ? ( h/w ) : 1 ),
			_y = ( y - t  - ( h/2 )) * ( h > w ? ( w/h ) : 1 ),
		
			/** the angle and the direction from where the mouse came in/went out clockwise (TRBL=0123);**/
			/** first calculate the angle of the point, 
			add 180 deg to get rid of the negative values
			divide by 90 to get the quadrant
			add 3 and do a modulo by 4  to shift the quadrants to a proper clockwise TRBL (top/right/bottom/left) **/
			direction = Math.round( ( ( ( Math.atan2(_y, _x) * (180 / Math.PI) ) + 180 ) / 90 ) + 3 )  % 4;
      var directions = ['top','right','bottom','left'];
      return directions[direction];
  }
});


/* Fancy Select */
$(document).ready(function(){
	
	// The select element to be replaced:
	var select = $('select.makeMeFancy');

	var selectBoxContainer = $('<div>',{
		width		: select.outerWidth(),
		className	: 'fancy',
		html		: '<div class="selectBox"></div>'
	});

	var dropDown = $('<ul>',{className:'dropDown'});
	var selectBox = selectBoxContainer.find('.selectBox');
	
	// Looping though the options of the original select element
	
	select.find('option').each(function(i){
		var option = $(this);
		
		if(i==select.attr('selectedIndex')){
			selectBox.html(option.text());
		}
		
		// As of jQuery 1.4.3 we can access HTML5 
		// data attributes with the data() method.
		
		if(option.data('skip')){
			return true;
		}
		
		// Creating a dropdown item according to the
		// data-icon and data-html-text HTML5 attributes:
		
		var li = $('<li>',{
			html:	'<img src="'+option.data('icon')+'" /><span>'+
					option.data('html-text')+'</span>'
		});
				
		li.click(function(){
			
			selectBox.html(option.text());
			dropDown.trigger('hide');
			
			// When a click occurs, we are also reflecting
			// the change on the original select element:
			select.val(option.val());
			
			return false;
		});
		
		dropDown.append(li);
	});
	
	selectBoxContainer.append(dropDown.hide());
	select.hide().after(selectBoxContainer);
	
	// Binding custom show and hide events on the dropDown:
	
	dropDown.bind('show',function(){
		
		if(dropDown.is(':animated')){
			return false;
		}
		
		selectBox.addClass('expanded');
		dropDown.slideDown();
		
	}).bind('hide',function(){
		
		if(dropDown.is(':animated')){
			return false;
		}
		
		selectBox.removeClass('expanded');
		dropDown.slideUp();
		
	}).bind('toggle',function(){
		if(selectBox.hasClass('expanded')){
			dropDown.trigger('hide');
		}
		else dropDown.trigger('show');
	});
	
	selectBox.click(function(){
		dropDown.trigger('toggle');
		return false;
	});

	// If we click anywhere on the page, while the
	// dropdown is shown, it is going to be hidden:
	
	$(document).click(function(){
		dropDown.trigger('hide');
	});
});