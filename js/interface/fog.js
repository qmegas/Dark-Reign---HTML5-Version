var InterfaceFogOfWar = {
	_fog_ctx: null,
	_layer_size: null,
	need_redraw: true,
	_img_indexes: [-1, -1, 1, 2, -1, -1, 3, 4, 5, 6, 7, 8, 5, 6, 9, 10, 11, 11, 11, 12, 11, 11, 12, 12, 34, 34, 13, 13, 34, 34, 13, 13, 14, 14, 15, 16, 17, 17, 18, 19, 20, 21, 22, 23, 168, 24, 25, 26, 108, 108, 27, 27, 108, 108, 27, 27, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 1, 2, -1, -1, 3, 4, 28, 29, 30, 31, 28, 29, 32, 33, 11, 11, 12, 12, 11, 11, 12, 12, 34, 34, 13, 13, 34, 34, 13, 13, 14, 14, 15, 16, 17, 17, 18, 19, 35, 36, 37, 38, 39, 40, 41, 42, 108, 108, 27, 27, 108, 108, 27, 27, 0, 0, 0, 0, 0, 0, 0, 0, 43, 43, 44, 45, 43, 43, 46, 47, 48, 49, 50, 51, 48, 49, 52, 53, 128, 128, 0, 0, 128, 128, 0, 0, 79, 79, 0, 0, 79, 79, 0, 0, 54, 54, 55, 56, 57, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 143, 143, 0, 0, 143, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 68, 69, 70, 68, 68, 71, 72, 73, 74, 75, 76, 73, 74, 77, 78, 128, 128, 0, 0, 128, 128, 0, 0, 79, 79, 0, 0, 79, 79, 0, 0, 80, 80, 81, 82, 83, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 143, 143, 0, 0, 143, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 1, 2, -1, -1, 3, 4, 5, 6, 7, 8, 5, 6, 9, 10, 11, 11, 12, 12, 11, 11, 12, 12, 34, 34, 13, 13, 34, 34, 13, 13, 94, 94, 95, 96, 97, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 108, 27, 27, 108, 108, 27, 27, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 1, 2, -1, -1, 3, 4, 28, 29, 30, 31, 28, 29, 32, 33, 11, 11, 12, 12, 11, 11, 12, 12, 34, 34, 13, 13, 34, 34, 13, 13, 94, 94, 95, 96, 97, 97, 98, 99, 109, 110, 111, 112, 113, 114, 115, 116, 108, 108, 27, 27, 108, 108, 27, 27, 0, 0, 0, 0, 0, 0, 0, 0, 117, 117, 118, 119, 117, 117, 120, 121, 122, 123, 124, 125, 122, 123, 126, 127, 128, 128, 0, 0, 128, 128, 0, 0, 79, 79, 0, 0, 79, 79, 0, 0, 129, 129, 130, 131, 132, 123, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 143, 0, 0, 143, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 144, 145, 146, 144, 144, 147, 148, 149, 150, 145, 151, 149, 150, 152, 153, 128, 128, 0, 0, 128, 128, 0, 0, 79, 79, 0, 0, 79, 79, 0, 0, 154, 154, 155, 156, 157, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 143, 143, 0, 0, 143, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	_redraw_indexes: null,
	_last_x: 0,
	_last_y: 0,
	_fog_img_offsets: [],
	_first_draw: true,
		
	init: function()
	{
		this._fog_ctx = document.getElementById('map_fog').getContext('2d');
		this._fog_ctx.fillStyle = '#000';
		
		this._layer_size = {x: CELL_SIZE*CurrentLevel.size.x, y: CELL_SIZE*CurrentLevel.size.y};
		this._last_x = CurrentLevel.size.x - 2;
		this._last_y = CurrentLevel.size.y - 2;
		
		//Precalculate offsets
		for (var i=0; i<this._img_indexes.length; ++i)
			this._fog_img_offsets.push({
				x: (i%13) * CELL_SIZE,
				y: parseInt(i/13) * CELL_SIZE
			});
	},
		
	drawShroud: function()
	{
		if (!GAMECONFIG.shroud)
			return;
	},
	
	_addCellToRedraw: function(x, y)
	{
		if (!this._redraw_indexes[x])
			this._redraw_indexes[x] = {};
		if (!this._redraw_indexes[x][y])
			this._redraw_indexes[x][y] = 1;
	},
	
	_checkIfRedrawRequired: function(cell, x, y)
	{
		var value = cell.fog, new_value = cell.fog_new_state;
		
		if (this._first_draw || value != new_value)
		{
			if (MapCell.isCorrectCord(x, y))
			{
				if (new_value > 0)
					CurrentLevel.map_cells[x][y].shroud = 0;
				CurrentLevel.map_cells[x][y].fog = new_value;
			}
			
			if (value==0 || new_value==0)
			{
				this._addCellToRedraw(x-1, y-1);
				this._addCellToRedraw(x, y-1);
				this._addCellToRedraw(x+1, y-1);
				
				this._addCellToRedraw(x-1, y);
				this._addCellToRedraw(x, y);
				this._addCellToRedraw(x+1, y);
				
				this._addCellToRedraw(x-1, y+1);
				this._addCellToRedraw(x, y+1);
				this._addCellToRedraw(x+1, y+1);
			}
		}
	},
	
	_getSpriteId: function(x, y)
	{
		var sum = 0;
		
		sum |= this._getCellFogState(x-1, y-1);
		sum <<= 1;
		sum |= this._getCellFogState(x, y-1);
		sum <<= 1;
		sum |= this._getCellFogState(x+1, y-1);
		sum <<= 1;
		
		sum |= this._getCellFogState(x-1, y);
		sum <<= 1;
		sum |= this._getCellFogState(x, y);
		sum <<= 1;
		sum |= this._getCellFogState(x+1, y);
		sum <<= 1;
		
		sum |= this._getCellFogState(x-1, y+1);
		sum <<= 1;
		sum |= this._getCellFogState(x, y+1);
		sum <<= 1;
		sum |= this._getCellFogState(x+1, y+1);
		
		return this._img_indexes[sum];
	},
		
	_getCellFogState: function(x, y)
	{
		if (x < 0)
			x = 0;
		if (x > this._last_x)
			x = this._last_x;
		if (y < 0)
			y = 0;
		if (y > this._last_y)
			y = this._last_y;
		
		return (CurrentLevel.map_cells[x][y].fog > 0) ? 0 : 1;
	},
	
	_redrawCell: function(x, y)
	{
		var pixel_pos, spriteid = this._getSpriteId(x, y), correct_cell = MapCell.isCorrectCord(x, y);
		
		if (!correct_cell || (CurrentLevel.map_cells[x][y].fog_image != spriteid))
		{
			pixel_pos = MapCell.cellToPixel({x: x, y: y});
			
			if (this._first_draw && GAMECONFIG.shroud && correct_cell && CurrentLevel.map_cells[x][y].shroud==1)
			{
				this._fog_ctx.fillRect(pixel_pos.x, pixel_pos.y, CELL_SIZE, CELL_SIZE);
			}
			else
			{
				this._fog_ctx.clearRect(pixel_pos.x, pixel_pos.y, CELL_SIZE, CELL_SIZE);
				if (spriteid != -1)
					this._fog_ctx.drawImage(
						game.resources.get('fogofwar'), 
						this._fog_img_offsets[spriteid].x, this._fog_img_offsets[spriteid].y, CELL_SIZE, CELL_SIZE,
						pixel_pos.x, pixel_pos.y, CELL_SIZE, CELL_SIZE
					);
			}
			
			if (correct_cell)
				CurrentLevel.map_cells[x][y].fog_image = spriteid;
		}
	},
		
	redrawFog: function()
	{
		if (!this.need_redraw)
			return;
		
		var x, y;
		
		this._redraw_indexes = {};
		
		//Check redraw
		for (x = 0; x < CurrentLevel.size.x; ++x)
			for (y = 0; y < CurrentLevel.size.y; ++y)
				this._checkIfRedrawRequired(CurrentLevel.map_cells[x][y], x, y);
		
		//Redraw corners
		for (x in this._redraw_indexes)
		{
			for (y in this._redraw_indexes[x])
				this._redrawCell(parseInt(x), parseInt(y));
		}
		
		this.need_redraw = false;
		this._first_draw = false;
	}
};