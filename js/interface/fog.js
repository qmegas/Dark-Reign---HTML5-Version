var InterfaceFogOfWar = {
	_fog_ctx: null,
	_layer_size: null,
	need_redraw: true,
		
	init: function()
	{
		this._fog_ctx = document.getElementById('map_fog').getContext('2d');
		this._layer_size = {x: CELL_SIZE*game.level.size.x, y: CELL_SIZE*game.level.size.y};
	},
		
	redrawFog: function()
	{
		if (!this.need_redraw)
			return;
		
		var x, y, value, new_value, pixel_pos, tmp_cell;
		
		for (x = -1; x <= game.level.size.x; ++x)
		{
			for (y = -1; y <= game.level.size.y; ++y)
			{
				if (x < 0 || y < 0 || x == game.level.size.x || y == game.level.size.y)
				{
					if (x==-1 && y==-1)
						tmp_cell = game.level.map_cells[0][0];
					else if (x==-1 && y==game.level.size.y)
						tmp_cell = game.level.map_cells[0][game.level.size.y-1];
					else if (x==game.level.size.x && y==-1)
						tmp_cell = game.level.map_cells[game.level.size.x-1][0];
					else if (x==game.level.size.x && y==game.level.size.y)
						tmp_cell = game.level.map_cells[game.level.size.x-1][game.level.size.y-1];
					else if (x == -1)
						tmp_cell = game.level.map_cells[0][y];
					else if (x == game.level.size.x)
						tmp_cell = game.level.map_cells[game.level.size.x-1][y];
					else if (y == -1)
						tmp_cell = game.level.map_cells[x][0];
					else
						tmp_cell = game.level.map_cells[x][game.level.size.y-1];
					
					value = tmp_cell.fog;
					new_value = tmp_cell.fog_new_state;
				}
				else
				{
					value = game.level.map_cells[x][y].fog;
					new_value = game.level.map_cells[x][y].fog_new_state;
				}
				
				if (value != new_value)
				{
					if (value==0 || new_value==0)
					{
						pixel_pos = MapCell.cellToPixel({x: x, y: y});
						if (new_value == 0)
							this._fog_ctx.drawImage(game.resources.get('fogofwar'), pixel_pos.x, pixel_pos.y);
						else
							this._fog_ctx.clearRect(pixel_pos.x, pixel_pos.y, CELL_SIZE, CELL_SIZE);
							
					}
					
					if (MapCell.isCorrectCord(x, y))
						game.level.map_cells[x][y].fog = new_value;
				}
			}
		}
		
		this.need_redraw = false;
	}
};