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
		
		var x, y, last_x = game.level.size.x - 1, last_y = game.level.size.y - 1;
		
		//Redraw corners
		this.redrawCell(game.level.map_cells[0][0], -1, -1); //Top-left
		this.redrawCell(game.level.map_cells[0][last_y-1], -1, last_y); //Bottom-left
		this.redrawCell(game.level.map_cells[last_x - 1][0], last_x, -1); //Top-right
		this.redrawCell(game.level.map_cells[last_x - 1][last_y - 1], last_x, last_y); //Bottom-right
		
		//Redraw edges
		for (x = 0; x < last_x; ++x)
		{
			this.redrawCell(game.level.map_cells[x][0], x, -1);
			this.redrawCell(game.level.map_cells[x][last_y - 1], x, last_y);
		}
		for (y = 0; y < last_y; ++y)
		{
			this.redrawCell(game.level.map_cells[0][y], -1, y);
			this.redrawCell(game.level.map_cells[last_x - 1][y], last_x, y);
		}
		
		//Other cells
		for (x = 0; x < last_x; ++x)
			for (y = 0; y < last_y; ++y)
				this.redrawCell(game.level.map_cells[x][y], x, y);
		
		this.need_redraw = false;
	},
		
	redrawCell: function(cell, x, y)
	{
		var pixel_pos, value = cell.fog, new_value = cell.fog_new_state;
		
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
};