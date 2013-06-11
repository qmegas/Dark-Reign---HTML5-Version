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
	var options, is_set = false, overflow_size, scroll_size, current_pos, self = this;
	
	this.set = function(opt)
	{
		if (is_set)
			self._unsetHandlers();
		
		options = opt;
		
		overflow_size = $(options.scroll_element).height() - options.window_size;
		if (overflow_size <= 0)
			return;
		
		scroll_size = options.slider_bottom - options.slider_top;
		
		current_pos = 0;
		
		self._setHandlers();
	};
	
	this._setHandlers = function()
	{
		$(options.button_up).bind('mousedown', function(){
			current_pos -= 10;
			if (current_pos <= 0)
				current_pos = 0;
			
			self._scroll();
		});
		
		$(options.button_down).bind('mousedown', function(){
			current_pos += 10;
			if (current_pos > overflow_size)
				current_pos = overflow_size;
			
			self._scroll();
		});
		
		$(options.button_slider).show().css('top', options.slider_top + 'px');
		
		is_set = true;
	};
	
	this._unsetHandlers = function()
	{
		$(options.button_up).unbind('mousedown');
		$(options.button_down).unbind('mousedown');
		$(options.button_slider).hide();
		
		is_set = false;
	};
	
	this._scroll = function()
	{
		$(options.scroll_element).css('top', '-' + current_pos + 'px');
		$(options.button_slider).css('top', (parseInt(scroll_size/overflow_size*current_pos) + options.slider_top) + 'px');
	};
}