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
			{
				this._objects_ctx.fillRect(
					x, y, 
					Math.round(game.objects[i]._proto.cell_size.x*cell_on_mini), 
					Math.round(game.objects[i]._proto.cell_size.y*cell_on_mini)
				); 
			}
			else
			{
				if (game.level.map_cells[x][y].fog > 0)
					this._objects_ctx.fillRect(x, y, 1, 1); 
			}
		}
		
		var x, y, x_prop = game.level.minimap.x / game.level.size.x, y_prop = game.level.minimap.y / game.level.size.y, cur_position = 0;
		var img = this._objects_ctx.getImageData(0, 0, game.level.minimap.x, game.level.minimap.y);
		
		for (y = 0; y < game.level.minimap.y; ++y)
		{
			for (x = 0; x < game.level.minimap.x; ++x)
			{
				if (game.level.map_cells[parseInt(x/x_prop)][parseInt(y/y_prop)].fog == 0)
				{
					img.data[cur_position] *= 0.7;
					img.data[cur_position + 1] *= 0.7;
					img.data[cur_position + 2] *= 0.7;
				}
				cur_position += 4;
			}
		}
		this._objects_ctx.putImageData(img, 0, 0);
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
