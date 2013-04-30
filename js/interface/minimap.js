var InterfaceMinimap = {
	_state_is_red: false,
	_viewport_ctx: null,
	_objects_ctx: null,
	
	init: function()
	{
		this._viewport_ctx = $('#minimap_viewport').get(0).getContext('2d');
		this._objects_ctx = $('#minimap_objects').get(0).getContext('2d');
	},
	
	drawViewport: function()
	{
		this._viewport_ctx.clearRect(0, 0, game.level.minimap.x, game.level.minimap.y);
		this._viewport_ctx.strokeStyle = '#ffffff';
		this._viewport_ctx.lineWidth = 1;
		this._viewport_ctx.strokeRect(
			parseInt(game.viewport_x/(game.level.size.x/game.level.minimap.x*CELL_SIZE)) + 0.5,  
			parseInt(game.viewport_y/(game.level.size.y/game.level.minimap.y*CELL_SIZE)) + 0.5, 
			game.level.minimap.rect_x, 
			game.level.minimap.rect_y
		);
	},
	
	drawObjects: function()
	{
		var i, pos, x, y, cell_on_mini = game.level.minimap.x / game.level.size.x;
		
		if (this._state_is_red)
			return;
		
		this._objects_ctx.drawImage(game.resources.get('minimap'), 0, 0);
		
		for (i in game.objects)
		{
			if (game.objects[i].is_effect)
				continue;
			
			pos = game.objects[i].getCell();
			x = parseInt((pos.x / game.level.size.x) * game.level.minimap.x);
			y = parseInt((pos.y / game.level.size.y) * game.level.minimap.y);
			this._objects_ctx.fillStyle = game.players[game.objects[i].player].getMapColor();
				
			if (game.objects[i].is_building)
				this._objects_ctx.fillRect(
					x, y, 
					Math.round(game.objects[i]._proto.cell_size.x*cell_on_mini), 
					Math.round(game.objects[i]._proto.cell_size.y*cell_on_mini)
				); 
			else
				this._objects_ctx.fillRect(x, y, 1, 1); 
		}
	},
	
	switchState: function()
	{
		if (game.players[PLAYER_HUMAN].energyLow())
		{
			if (!this._state_is_red)
			{
				this._drawRedMap();
				this._state_is_red = true;
			}
		}
		else
			this._state_is_red = false;
	},
	
	_drawRedMap: function()
	{
		this._objects_ctx.drawImage(
			game.resources.get('minimap'), 
			game.level.minimap.x, 0, game.level.minimap.x, game.level.minimap.y,
			0, 0, game.level.minimap.x, game.level.minimap.y
		);
	}
};
