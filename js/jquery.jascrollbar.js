( function( $ ) 
{
    $.tiny = $.tiny || { };

    $.tiny.scrollbar = {
        options: {
                axis       : 'y'    // vertical or horizontal scrollbar? ( x || y ).
            ,   size       : 'auto' // set the size of the scrollbar to auto or a fixed number.
            ,   viewport   : '.viewport'   // Viewport selector
            ,   scrollbar  : '.scrollbar'  // scrollbar selector
            ,   track      : '.track'      // track selector
        }
    };

    $.fn.jascrollbar = function( params )
    {
        var options = $.extend( {}, $.tiny.scrollbar.options, params );
        
        this.each( function()
        { 
            $( this ).data('tsb', new Scrollbar( $( this ), options ) ); 
        });

        return this;
    };

    $.fn.jascrollbar_update = function(sScroll)
    {
        return $( this ).data( 'tsb' ).update( sScroll ); 
    };

    function Scrollbar( root, options )
    {
        var oSelf       = this
        ,   oWrapper    = root
        ,   oViewport   = $( options.viewport, root )
        ,   oScrollbar  = $( options.scrollbar, root ) 
        ,   oTrack      = $( options.track, oScrollbar )
        ,   sAxis       = options.axis === 'x'
        ,   sDirection  = sAxis ? 'left' : 'top'
        ,   sSize       = sAxis ? 'Width' : 'Height'
        ,   sCssSize       = sAxis ? 'width' : 'height'
        ,   sPos       = sAxis ? 'Left' : 'Top'
        ,   iPosition   = { start: 0, now: 0 }
        ,   iMouse      = {min: 0, max: 0}
        ,   touchEvents = ( 'ontouchstart' in document.documentElement ) ? true : false
        ,   view_size = 0
        ,   content_size = 0
        ,   content_pos = 0
        ,   ratio = 0
        ;
        
        
        function initialize()
        {
            oSelf.update();
            setEvents();
            // interval check if need update_layout
            setInterval(function() {
              var updatecheck = oSelf.needUpdate();
              if (updatecheck == 1) oSelf.update();
              if (updatecheck == 2) oSelf.updatePos();
            }, 500);
            return oSelf;
        }
        
        this.needUpdate = function () {
          return (oViewport[0][ 'offset'+ sSize ] != view_size || oViewport[0][ 'scroll'+ sSize ] != content_size) ? 1 : content_pos != oViewport[0][ 'scroll'+ sPos ] ? 2 : 0;
        };

        this.update = function( sScroll )
        {
            view_size = oViewport[0][ 'offset'+ sSize ] ;
            content_size = oViewport[0][ 'scroll'+ sSize ];
            ratio = view_size / content_size;
            
            oScrollbar.toggleClass( 'disable', ratio >= 1 );
            
            // set scrollbar size
            oScrollbar.css( sCssSize, options.size === 'auto' ? view_size : options.size );
            oTrack.css( sCssSize, Math.round(ratio * view_size) );
            
            // mouse range
            iMouse.max = view_size - Math.round(ratio * view_size);
            
            this.updatePos();
        };
        
        this.updatePos = function () {
            content_pos = oViewport[0][ 'scroll'+ sPos ];
            oTrack.css( sDirection, Math.round(content_pos/content_size * view_size) );
        };

        function setEvents()
        {
            if( ! touchEvents )
            {
                oTrack.bind( 'mousedown', start );
                oScrollbar.bind( 'mouseup', drag );                
            }
            else
            {
                oViewport[0].ontouchstart = function( event )
                {   
                    if( 1 === event.touches.length )
                    {
                        start( event.touches[ 0 ] );
                        event.stopPropagation();
                    }
                };
            }
        }

        function start( event )
        {
            iMouse.start    = sAxis ? event.pageX : event.pageY;
            iMouse.offset   = iMouse.start - parseInt( oTrack.css( sDirection ), 10 );
            
            if( ! touchEvents )
            {
                $( document ).bind( 'mousemove', drag );
                $( document ).bind( 'mouseup', end );
                oTrack.bind( 'mouseup', end );
            }
            else
            {
                document.ontouchmove = function( event )
                {
                    event.preventDefault();
                    drag( event.touches[ 0 ] );
                };
                document.ontouchend = end;        
            }
            event.preventDefault();
        }

        function drag( event )
        {
            if( ratio < 1 )
            {
                iMouse.now    = sAxis ? event.pageX : event.pageY;
                iPosition.now = iMouse.now < iMouse.min + iMouse.offset ? iMouse.min : iMouse.now > iMouse.max + iMouse.offset ? iMouse.max : iMouse.now - iMouse.offset ;
                
                // upadte content position
                oViewport[0][ 'scroll'+ sPos ] = iPosition.now / view_size * content_size;
                oTrack.css( sDirection, iPosition.now );
                event.preventDefault();
            }
        }
        
        function end()
        {
            $( document ).unbind( 'mousemove', drag );
            $( document ).unbind( 'mouseup', end );
            oTrack.unbind( 'mouseup', end );
            document.ontouchmove = document.ontouchend = null;
        }

        return initialize();
    }

}(jQuery));