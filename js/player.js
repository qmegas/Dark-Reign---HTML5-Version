function Player(map_color, is_human)
{
	this._money = 0;
	this._map_color = map_color;
	this._energy_max = 0;
	this._energy_current = 0;
	this._is_human = is_human;
	
	this.getMapColor = function()
	{
		return this._map_color;
	};
	
	this.addMoney = function(num)
	{
		this._money += parseInt(num);
		if (this._is_human)
			InterfaceMoneyDraw.setMoney(this._money);
	};
	
	this.decMoney = function(num)
	{
		this._money -= parseInt(num);
		if (this._is_human)
			InterfaceMoneyDraw.setMoney(this._money);
	};
	
	this.haveEnoughMoney = function(num)
	{
		return (num <= this._money);
	};
	
	this.energyAddMax = function(val)
	{
		this._energy_max += val;
		if (this._is_human)
		{
			InterfaceEnergyWaterDraw.energyAddToMax(val);
			InterfaceMinimap.switchState();
		}
	};
	
	this.energyAddCurrent = function(val)
	{
		this._energy_current += val;
		if (this._is_human)
		{
			InterfaceEnergyWaterDraw.energyAddToCurrent(val);
			InterfaceMinimap.switchState();
		}
	};
	
	this.energyLow = function()
	{
		return (this._energy_max==0 || this._energy_max<this._energy_current);
	};
}