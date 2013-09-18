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
		this._viewport_ctx.clearRect(0, 0, CurrentLevel.minimap.x, CurrentLevel.minimap.y);
		this._viewport_ctx.strokeStyle = '#ffffff';
		this._viewport_ctx.lineWidth = 1;
		this._viewport_ctx.strokeRect(
			parseInt(game.viewport_x/(CurrentLevel.size.x/CurrentLevel.minimap.x*CELL_SIZE)) + 0.5,  
			parseInt(game.viewport_y/(CurrentLevel.size.y/CurrentLevel.minimap.y*CELL_SIZE)) + 0.5, 
			CurrentLevel.minimap.rect_x, 
			CurrentLevel.minimap.rect_y
		);
	},
	
	drawObjects: function()
	{
		var i, pos, x, y, cell_on_mini = CurrentLevel.minimap.x / CurrentLevel.size.x;
		
		if (this._state_is_red)
			return;
		
		this._objects_ctx.drawImage(game.resources.get('minimap'), 0, 0);
		
		for (i in game.objects)
		{
			if (game.objects[i].is_effect)
				continue;
			
			pos = game.objects[i].getCell();
			x = parseInt((pos.x / CurrentLevel.size.x) * CurrentLevel.minimap.x);
			y = parseInt((pos.y / CurrentLevel.size.y) * CurrentLevel.minimap.y);
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
				if (CurrentLevel.map_cells[pos.x][pos.y].fog > 0)
					this._objects_ctx.fillRect(x, y, 1, 1); 
			}
		}
		
		this._drawFogShroud();
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
			CurrentLevel.minimap.x, 0, CurrentLevel.minimap.x, CurrentLevel.minimap.y,
			0, 0, CurrentLevel.minimap.x, CurrentLevel.minimap.y
		);
			
		this._drawFogShroud();
	},
		
	_drawFogShroud: function()
	{
		var x, y, x_prop = CurrentLevel.minimap.x / CurrentLevel.size.x, y_prop = CurrentLevel.minimap.y / CurrentLevel.size.y, cur_position = 0;
		var cell, img = this._objects_ctx.getImageData(0, 0, CurrentLevel.minimap.x, CurrentLevel.minimap.y);
		
		for (y = 0; y < CurrentLevel.minimap.y; ++y)
		{
			for (x = 0; x < CurrentLevel.minimap.x; ++x)
			{
				cell = CurrentLevel.map_cells[parseInt(x/x_prop)][parseInt(y/y_prop)];
				if (cell.shroud == 1)
				{
					img.data[cur_position] = 0;
					img.data[cur_position + 1] = 0;
					img.data[cur_position + 2] = 0;
				}
				else if (cell.fog == 0)
				{
					img.data[cur_position] *= 0.7;
					img.data[cur_position + 1] *= 0.7;
					img.data[cur_position + 2] *= 0.7;
				}
				cur_position += 4;
			}
		}
		this._objects_ctx.putImageData(img, 0, 0);
	}
};
