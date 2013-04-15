var BridgeTypeBuilding = {
	drawBuildMouse: function(obj, x, y)
	{
		var i = -1, xx, yy, xxx, yyy;

		game.viewport_ctx.drawImage(
			game.resources.get(obj.res_key), 0, obj.images.normal.size.y, 
			obj.images.normal.size.x, obj.images.normal.size.y, 
			x*CELL_SIZE - game.viewport_x - obj.images.normal.padding.x + 12, 
			y*CELL_SIZE - game.viewport_y - obj.images.normal.padding.y + 12, 
			obj.images.normal.size.x, obj.images.normal.size.y
		);
		game.viewport_ctx.drawImage(
			game.resources.get(obj.res_key), obj.images.normal.size.x, obj.images.normal.size.y, 
			obj.images.normal.size.x, obj.images.normal.size.y, 
			x*CELL_SIZE - game.viewport_x - obj.images.normal.padding.x + 12, 
			y*CELL_SIZE - game.viewport_y - obj.images.normal.padding.y + 12, 
			obj.images.normal.size.x, obj.images.normal.size.y
		);

		if (BridgeTypeBuilding.isCorrectLandForBuild(x, y, obj.cell_size.x, obj.cell_size.y))
		{
			for (xx = 0; xx<obj.cell_size.x; ++xx)
			{
				xxx = xx+x;
				if (!MapCell.isCorrectX(xxx))
					continue;

				for (yy = 0; yy<obj.cell_size.y; ++yy)
				{
					++i;
					if (obj.cell_matrix[i] == 0)
						continue;

					yyy = yy+y;
					if (!MapCell.isCorrectY(yyy))
						continue;

					var cell = game.level.map_cells[xxx][yyy], unitid = MapCell.getSingleUserId(cell);
					if ((cell.type!=CELL_TYPE_EMPTY && cell.type!=CELL_TYPE_WATER) || (unitid!=-1 && unitid!=game.action_state_options.requested_unit))
					{
						game.viewport_ctx.drawImage(
							game.resources.get('clr'), 0, 0, CELL_SIZE, CELL_SIZE, 
							xxx*CELL_SIZE - game.viewport_x + 12, yyy*CELL_SIZE - game.viewport_y + 12, CELL_SIZE, CELL_SIZE
						);
					}
				}
			}
		}
		else
		{
			//Draw all red
			for (xx = 0; xx<obj.cell_size.x; ++xx)
			{
				xxx = xx+x;
				for (yy = 0; yy<obj.cell_size.y; ++yy)
				{
					++i;
					if (obj.cell_matrix[i] == 0)
						continue;

					yyy = yy+y;
					game.viewport_ctx.drawImage(
						game.resources.get('clr'), 0, 0, CELL_SIZE, CELL_SIZE, 
						xxx*CELL_SIZE - game.viewport_x + 12, yyy*CELL_SIZE - game.viewport_y + 12, CELL_SIZE, CELL_SIZE
					);
				}
			}
		}
	},
		
	canBuild: function(obj, x, y, unit)
	{
		var i = -1;

		if (!BridgeTypeBuilding.isCorrectLandForBuild(x, y, obj.cell_size.x, obj.cell_size.y))
			return false;

		for (var xx = 0; xx<obj.cell_size.x; ++xx)
		{
			var xxx = xx+x;
			if (!MapCell.isCorrectX(xxx))
				return false;

			for (var yy = 0; yy<obj.cell_size.y; ++yy)
			{
				++i;
				if (obj.cell_matrix[i] == 0)
					continue;

				var yyy = yy+y;
				if (!MapCell.isCorrectY(yyy))
					return false;

				var cell = game.level.map_cells[xxx][yyy], unitid = MapCell.getSingleUserId(cell);
				if ((cell.type!=CELL_TYPE_EMPTY && cell.type!=CELL_TYPE_WATER) || (unitid!=-1 && unitid!=unit))
					return false;
			}
		}

		return true;
	},
		
	isCorrectLandForBuild: function(x, y, width, height)
	{
		var xx, yy, water_found = false;

		//Should be at least one cell of the water
		xx = x;
		while (!water_found && (xx < x + width))
		{
			if (!MapCell.isCorrectX(xx))
				return false;

			yy = y;
			while (!water_found && (yy < y + height))
			{
				if (!MapCell.isCorrectY(yy))
					return false;

				if (game.level.map_cells[xx][yy].type == CELL_TYPE_WATER)
				{
					water_found = true;
					break;
				}
				++yy;
			}
			++xx;
		}

		if (!water_found)
			return false;

		//Check land near the bridge
		for (yy = y; yy < y + height; ++yy)
		{
			//left line
			if (MapCell.isCorrectCord(x-1, yy) && (game.level.map_cells[x-1][yy].type == CELL_TYPE_EMPTY))
				return true;
			//right line
			if (MapCell.isCorrectCord(x+width, yy) && (game.level.map_cells[x+width][yy].type == CELL_TYPE_EMPTY))
				return true;
		}
		for (xx = x; xx < x + width; ++xx)
		{
			//Top line
			if (MapCell.isCorrectCord(xx, y-1) && (game.level.map_cells[xx][y-1].type == CELL_TYPE_EMPTY))
				return true;
			//Bottom line
			if (MapCell.isCorrectCord(xx, y+height) && (game.level.map_cells[xx][y+height].type == CELL_TYPE_EMPTY))
				return true;
		}

		return false;
	},
		
	changeLandType: function(obj)
	{
		var i = -1, x, y, cell = obj.getCell();
		for (x=0; x<obj._proto.cell_size.x; ++x)
			for (y=0; y<obj._proto.cell_size.y; ++y)
			{
				++i;
				if ((obj._proto.cell_matrix[i] == 1) && (obj._proto.move_matrix[i] == 0))
					game.level.map_cells[cell.x+x][cell.y+y].type = CELL_TYPE_EMPTY;
			}
	},
		
	restoreLandType: function(obj)
	{
		var i = -1, x, y, cell = obj.getCell(), type, unitid;
		for (x=0; x<obj._proto.cell_size.x; ++x)
		{
			for (y=0; y<obj._proto.cell_size.y; ++y)
			{
				++i;
				if (obj._proto.cell_matrix[i] == 1)
				{
					type = game.level.map_cells[cell.x+x][cell.y+y].original_type;
					game.level.map_cells[cell.x+x][cell.y+y].type = type;
					
					if (type == CELL_TYPE_WATER)
					{
						unitid = game.level.map_cells[cell.x+x][cell.y+y].ground_unit;
						if (unitid != -1)
						{
							if (game.objects[unitid]._proto.move_mode == MOVE_MODE_GROUND)
								game.objects[unitid].applyDamage(game.objects[unitid].health);
						}
					}
				}
			}
		}
	}
};