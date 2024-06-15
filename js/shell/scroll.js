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
		$(options.button_up).bind('mousedown pointerup', function(){
			current_pos -= 10;
			if (current_pos <= 0)
				current_pos = 0;
			
			self._scroll();
		});
		
		$(options.button_down).bind('mousedown pointerup', function(){
			current_pos += 10;
			if (current_pos > overflow_size)
				current_pos = overflow_size;
			
			self._scroll();
		});
		
		$(options.button_slider)
			.bind('mousedown pointerup', function(){
				slider_hold = true;
			})
			.bind('mouseup pointerup', function(){
				slider_hold = false;
			})
			.bind('mousemove mousemove', function(event){
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
		$(options.button_up).unbind('mousedown');
		$(options.button_down).unbind('mousedown');
		$(options.button_slider).unbind('mousedown mouseup mousemove').hide();
		
		is_set = false;
		slider_hold = false;
	};
	
	this._scroll = function()
	{
		$(options.scroll_element).css('top', '-' + current_pos + 'px');
		$(options.button_slider).css('top', (parseInt(scroll_size/overflow_size*current_pos) + options.slider_top) + 'px');
	};
}