/**
 * Option parameters:
 * - button_up: element id
 * - button_down: element id
 * - button_slider: element_id
 * - scroll_element: element id
 * - window_size: int
 * - slider_top: int
 * - slider_bottom: int
 */
function ScrollWidget()
{
	var options, is_set = false, overflow_size, scroll_size, current_pos, self = this, slider_hold = false;
	
	this.set = function(opt)
	{
		this.unset();
		
		options = opt;
		
		overflow_size = $(options.scroll_element).attr('height') - options.window_size;
		if (overflow_size <= 0)
			return;
		
		scroll_size = options.slider_bottom - options.slider_top;
		
		current_pos = 0;
		
		self._setHandlers();
	};
	
	this.unset = function()
	{
		if (is_set)
			this._unsetHandlers();
	};
	
	this._setHandlers = function()
	{
		$(options.button_up).bind('mousedown touchstart', function(){
			current_pos -= 10;
			if (current_pos <= 0)
				current_pos = 0;
			
			self._scroll();
		});
		
		$(options.button_down).bind('mousedown touchstart', function(){
			current_pos += 10;
			if (current_pos > overflow_size)
				current_pos = overflow_size;
			
			self._scroll();
		});

		// desktop scroll
		$(options.scroll_element).bind( 'mousewheel DOMMouseScroll', function ( e ) {
		    e.preventDefault();
		    var e0 = e.originalEvent,
		    delta = e0.wheelDelta || -e0.detail;

		    current_pos += (delta * -1)  / scroll_size * overflow_size;
			self._scroll();
		});

		var lastY;
		var currentY;

		// reset touch position on touchstart
		$(options.scroll_element).bind('touchstart', function (e){
		    e.preventDefault();
		    var currentY = e.originalEvent.touches[0].clientY;
		    lastY = currentY;
		});

		// get movement and scroll the same way
		$(options.scroll_element).bind('touchmove', function (e){
		    e.preventDefault();
		    var currentY = e.originalEvent.touches[0].clientY;
		    delta = currentY - lastY;

		    current_pos += (delta * -1);
			self._scroll();
		    lastY = currentY;
		});
		
		$(options.button_slider)
			.bind('mousedown touchstart', function(){
				slider_hold = true;
			})
			.bind('mouseup mouseleave touchend', function(){
				slider_hold = false;
			})
			.bind('mousemove touchmove', function(event){
				if (slider_hold)
				{
					
					var y = event.pageY - 8;
					if (y >= options.slider_top && y <= options.slider_bottom)
					{
						current_pos = (y - options.slider_top) / scroll_size * overflow_size;
						self._scroll();
					}
				}
			})
			.show()
			.css('top', options.slider_top + 'px');
		
		is_set = true;
	};
	
	this._unsetHandlers = function()
	{
		$(options.button_up).unbind('mousedown touchstart');
		$(options.button_down).unbind('mousedown  touchstart');
		$(options.button_slider).unbind('mousedown touchstart mouseup touchend touchmove').hide();
		
		is_set = false;
		slider_hold = false;
	};
	
	this._scroll = function()
	{
		if (current_pos > overflow_size)
				current_pos = overflow_size;

		if (current_pos < 0)
			current_pos = 0

		$(options.scroll_element).css('top', '-' + current_pos + 'px');
		$(options.button_slider).css('top', (parseInt(scroll_size/overflow_size*current_pos) + options.slider_top) + 'px');
	};
}