function Player(map_color)
{
	this._money = 0;
	this._map_color = map_color;
	
	this.getMapColor = function()
	{
		return this._map_color;
	}
}