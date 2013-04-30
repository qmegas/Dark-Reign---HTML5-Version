function Player(map_color, start_position)
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
		//@todo Update interface only if human player
		InterfaceMoneyDraw.setMoney(this._money);
	};
	
	this.decMoney = function(num)
	{
		this._money -= parseInt(num);
		//@todo Update interface only if human player
		InterfaceMoneyDraw.setMoney(this._money);
	};
	
	this.haveEnoughMoney = function(num)
	{
		return (num <= this._money);
	};
	
	this.energyAddMax = function(val)
	{
		this._energy_max += val;
		//@todo Update interface only if human player
		InterfaceEnergyWaterDraw.energyAddToMax(val);
		InterfaceMinimap.switchState();
	};
	
	this.energyAddCurrent = function(val)
	{
		this._energy_current += val;
		//@todo Update interface only if human player
		InterfaceEnergyWaterDraw.energyAddToCurrent(val);
		InterfaceMinimap.switchState();
	};
	
	this.energyLow = function()
	{
		return (this._energy_max==0 || this._energy_max<this._energy_current);
	};
}