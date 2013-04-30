var InterfaceMoneyDraw = {
	_money_current: 0,
	_money_was: 0,
	_money_display: 0,
	_dom_pointers: [],
	
	init: function()
	{
		for (var i=0; i<9; ++i)
			this._dom_pointers[i] = $('#money'+(i+1));
	},
	
	setMoney: function(num)
	{
		if (num < 0)
			num = 0;
		
		this._money_was = this._money_current;
		this._money_display = this._money_was;
		this._money_current = num;
	},
	
	draw: function()
	{
		if (this._money_current == this._money_was)
			return;
		
		var full_change = this._money_current - this._money_was,
			toadd = ((this._money_current - this._money_display)/full_change)*0.1*full_change,
			view_zero = false, numbers = [], tmp;
			
		if (Math.abs(toadd)<1)
		{
			this._money_was = this._money_current;
			this._money_display = this._money_current;
		}
		else
			this._money_display += parseInt(toadd);
		
		tmp = this._money_display;
		for (var i = 8; i>=0; --i)
		{
			numbers[i] = tmp % 10;
			tmp = parseInt(tmp/10);
		}
		
		for (i = 0; i<9; ++i)
		{
			if (i!=8 && numbers[i]==0 && !view_zero)
				this._dom_pointers[i].attr('class', 'num empty');
			else
			{
				if (numbers[i]!=0)
					view_zero = true;
				this._dom_pointers[i].attr('class', 'num d'+numbers[i]);
			}
		}
	}
};
