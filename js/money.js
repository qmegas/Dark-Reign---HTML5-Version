function MoneyDraw()
{
	this.money_current = 0;
	this.money_was = 0;
	this.money_display = 0;
	
	this.dom_pointers = [];
	
	this.addMoney = function(num)
	{
		this.setMoney(this.money_current + num);
	}
	
	this.decMoney = function(num)
	{
		this.setMoney(this.money_current - num);
	}
	
	this.setMoney = function(num)
	{
		this.money_was = this.money_current;
		this.money_display = this.money_was;
		this.money_current = num;
	}
	
	this.draw = function()
	{
		if (this.money_current == this.money_was)
			return;
		
		var full_change = this.money_current - this.money_was,
			toadd = ((this.money_current - this.money_display)/full_change)*0.1*full_change,
			view_zero = false, numbers = [], tmp;
			
		if (Math.abs(toadd)<1)
		{
			this.money_was = this.money_current;
			this.money_display = this.money_current;
		}
		else
			this.money_display += parseInt(toadd);
		
		tmp = this.money_display;
		for (var i = 8; i>=0; --i)
		{
			numbers[i] = tmp % 10;
			tmp = parseInt(tmp/10);
		}
		
		for (i = 0; i<9; ++i)
		{
			if (numbers[i]==0 && !view_zero)
				this.dom_pointers[i].attr('class', 'num empty');
			else
			{
				if (numbers[i]!=0)
					view_zero = true;
				this.dom_pointers[i].attr('class', 'num d'+numbers[i]);
			}
		}
	}
	
	//Init function
	for (var i=0; i<9; ++i)
		this.dom_pointers[i] = $('#money'+(i+1));
}