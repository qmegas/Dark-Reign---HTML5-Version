function InterfaceDialog()
{
	this._options = {};
	
	this.show = function()
	{
		$('#dialog_text').attr('src', game.fontDraw.getDataUrl(this._options.text));

		$('#d_button1')
			.css('margin-left', '54px')
			.on('click touchstart', this._options.buttons[0].callback)
			.show();


		$('#d_button1_img').attr('src', game.fontDraw.getDataUrl(this._options.buttons[0].text))
				
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
			$('#d_button1_img').attr('src', game.fontDraw.getDataUrl(this._options.buttons[1].text))
		}
		
		$('#dialog_simple, #dialog_box').show();
	}
	
	this.hide = function()
	{
		$('#dialog_simple, #dialog_box, #d_button1, #d_button2').hide();


		$('#d_button1')
			.off('click touchstart', this._options.buttons[0].callback)
	}
	
	this.setOptions = function(options)
	{
		this._options = options;
	}
}