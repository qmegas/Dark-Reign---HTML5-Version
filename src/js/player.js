function Player(map_color, unit_color, type)
{
	var is_human = (type == PLAYER_HUMAN);
	
	this.default_tactic = {
		order: TACTIC_ORDER_DEFAULT,
		pursuit: TACTIC_LOW,
		tolerance: TACTIC_HIGH,
		independance: TACTIC_MED
	};
	
	this.type = type;
	this._money = 0;
	this._map_color = map_color;
	this._energy_max = 0;
	this._energy_current = 0;
	
	this.getUnitColor = function()
	{
		return unit_color;
	};
	
	this.getMapColor = function()
	{
		return this._map_color;
	};
	
	this.addMoney = function(num)
	{
		this._money += parseInt(num);
		if (is_human)
			InterfaceMoneyDraw.setMoney(this._money);
	};
	
	this.decMoney = function(num)
	{
		this._money -= parseInt(num);
		if (is_human)
			InterfaceMoneyDraw.setMoney(this._money);
	};
	
	this.haveEnoughMoney = function(num)
	{
		return (num <= this._money);
	};
	
	this.energyAddMax = function(val)
	{
		this._energy_max += val;
		if (is_human)
		{
			InterfaceEnergyWaterDraw.energyAddToMax(val);
			InterfaceMinimap.switchState();
		}
	};
	
	this.energyAddCurrent = function(val)
	{
		this._energy_current += val;
		if (is_human)
		{
			InterfaceEnergyWaterDraw.energyAddToCurrent(val);
			InterfaceMinimap.switchState();
		}
	};
	
	this.energyLow = function()
	{
		return (this._energy_max==0 || this._energy_max<this._energy_current);
	};
	
	this.isEnemy = function(player)
	{
		var player_id = (player instanceof Player) ? player.type : player;
		
		return ((player_id != PLAYER_NEUTRAL) && (player_id != this.type));
	};
}