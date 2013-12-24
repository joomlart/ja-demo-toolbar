(function( window, $, undefined ){
  // our "Widget" object constructor
  $.Metro = function( options, element, callback ){
    this.element = $( element );
    this._create( options );
    this._init( callback );
  };

  $.Metro.settings = {
    exceptItems: '.hide',
    cols: 'auto',
    updateContainerHeight: true
  };
  
  $.Metro.prototype = {
    // sets up widget
    _create : function( options ) {
      this.options = $.extend( {}, $.Metro.settings, options );
      var instance = this;
      this.blocks = this.element.children();
      // get each block col-span & row-span base on class cs-x & rs-x
      var cols = this.getCols();
      this.blocks.each(function(i,block){
        var cs=1, rs=1;
        if (match = block.className.match(/(\s|^)cs-full(\s|$)/)) {
          cs = cols;
        } else if (match = block.className.match(/(\s|^)cs-(\d+)(\s|$)/)) {
          cs = match[2];
          if (cs > cols) cs = cols;
        }
        if (match = block.className.match(/(\s|^)rs-(\d+)(\s|$)/)) {
          rs = match[2];
        }
        $.data(block, 'col-span', cs);
        $.data(block, 'row-span', rs);
      });      
    },
    
    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init : function( callback ) {
      var instance = this;
      this._sort();
      this.layout( callback );
      // bind resize event 
      $(window).resize (function() {
        instance.resizeTimeout = setTimeout(
          function() {
            if (instance.resizeTimeout) {
              clearTimeout(instance.resizeTimeout);
            }
            instance.updateLayout ();
          }, 300);
      });      
    },
    
    _sort: function () {
      var instance = this;
      this.blocks = this.element.children().not(this.options.exceptItems);
      var used = [], min_brick = 0, max_brick = 0;
      var cols = this.getCols();
      $.data(this, 'columns', cols);
      this.blocks.each(function(i,block){
        var cs = $.data(this, 'col-span')
            rs = $.data(this, 'row-span');
        var bricks = [];
        for (j=0;j<cs;j++) {
          for (k=0;k<rs;k++) {
            bricks.push (k*cols+j);
          }
        }
        // find the first free space 
        var fit = false;
        var first = min_brick;
        while (!fit) {
          // check if this block can put at this position
          if (first % cols + cs <= cols) {
            fit = true;
            for (k=0;k<bricks.length;k++) {
              if ($.inArray(bricks[k]+first, used)>-1) {
                fit = false;
                break;
              }
            }
          }
          first++;
        }
        first--;
        // update used bricks 
        for (k=0;k<bricks.length;k++) {
          used.push (bricks[k]+first);
        }
        if (bricks[bricks.length-1]+first > max_brick) max_brick = bricks[bricks.length-1]+first;
        // update min_brick
        while ($.inArray(min_brick, used)>-1) min_brick++;
        // store position for this block
        $.data(this, 'col', first % cols);
        $.data(this, 'row', Math.floor(first / cols));
      });
      $.data(this, 'max-used', max_brick);
    },
    layout: function (callback) {
      if (!this.blocks.length) return;
      var cols = this.getCols();
      this.element.addClass('grid'+cols);
      this.blocks.addClass ('metro');
      // get first block
      var block = this.blocks[0];
      var rs = $.data(block, 'row-span');
      var cs = $.data(block, 'col-span');
      var w = Math.ceil(this.element.width()/cols);
      var h = Math.ceil($(block).outerHeight()/rs);
      
      this.blocks.each (function(i,block){
        $(block).css ({
          'top': $.data(block, 'row')*h,
          'left': $.data(block, 'col')*w
        })
      });
      
      // update container
      if (this.options.updateContainerHeight) {
        this.element.height(Math.ceil(($.data(this, 'max-used') + 1)/cols) * h);
      }
    },
    
    reLayout: function (callback) {
      this._sort();
      this.layout( callback );
    }, 
    
    updateLayout: function (callback) {
      if (this.getCols() != $.data(this, 'columns')) this._sort();
      this.layout( callback );
    },
    
    getCols: function () {
      if (this.options.cols === 'auto') {
        // auto calculate num of column
        var block = this.blocks[0];
        var cs = $.data(block, 'col-span');
        var cols = Math.round($(this.element).outerWidth()/$(block).outerWidth()*cs);       
        return cols;
      }
      return this.options.cols;
    }
    
  };
  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Metro constructor
  // Get from http://isotope.metafizzy.co

  $.fn.metro = function( options, callback ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'metro' );
        if ( !instance ) {
          logError( "cannot call methods on metro prior to initialization; " +
              "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for metro instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'metro' );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init( callback );
        } else {
          // initialize new instance
          $.data( this, 'metro', new $.Metro( options, this, callback ) );
        }
      });
    }
    // return jQuery object
    // so plugin methods do not have to
    return this;
  };  
})( window, jQuery );