function Player(map_color)
{
	this._money = 0;
	this._map_color = map_color;
	this._energy_max = 0;
	this._energy_current = 0;
	
	this.getMapColor = function()
	{
		return this._map_color;
	};
	
	this.addMoney = function(num)
	{
		this._money += parseInt(num);
		game.moneyDraw.setMoney(this._money);
	};
	
	this.decMoney = function(num)
	{
		this._money -= parseInt(num);
		game.moneyDraw.setMoney(this._money);
	};
	
	this.haveEnoughMoney = function(num)
	{
		return (num <= this._money);
	};
	
	this.energyAddMax = function(val)
	{
		game.energyDraw.energyAddToMax(val);
		this._energy_max += val;
		game.minimap.switchState();
	};
	
	this.energyAddCurrent = function(val)
	{
		game.energyDraw.energyAddToCurrent(val);
		this._energy_current += val;
		game.minimap.switchState();
	};
	
	this.energyLow = function()
	{
		return (this._energy_max==0 || this._energy_max<this._energy_current);
	};
}