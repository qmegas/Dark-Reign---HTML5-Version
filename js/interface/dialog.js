function InterfaceDialog()
{
	this._options = {};
	
	this.show = function()
	{
		$('#dialog_text').attr('src', 'images/interface/texts/' + this._options.text + '.png');
		$('#d_button1')
			.css('margin-left', '54px')
			.click(this._options.buttons[0].callback)
			.show();
		$('#d_button1_img').attr('src', 'images/interface/texts/' + this._options.buttons[0].text + '.png');
				
		if (this._options.buttons.length == 1)
		{
			$('#d_button1').css('margin-left', '54px');
		}
		else
		{
			$('#d_button1').css('margin-left', '9px')
			$('#d_button2')
				.css('margin-left', '19px')
				.click(this._options.buttons[1].callback)
				.show();
			$('#d_button2_img').attr('src', 'images/interface/texts/' + this._options.buttons[1].text + '.png');
		}
		
		$('#dialog_simple, #dialog_box').show();
	}
	
	this.hide = function()
	{
		$('#dialog_simple, #dialog_box, #d_button1, #d_button2').hide();
	}
	
	this.setOptions = function(options)
	{
		this._options = options;
	}
}