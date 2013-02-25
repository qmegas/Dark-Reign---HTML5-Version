function BridgeTypeBuilding()
{
}

BridgeTypeBuilding.drawBuildMouse = function(obj, x, y)
{
	var i = -1, xx, yy, xxx, yyy;
	
	x -= obj.cell_padding.x;
	y -= obj.cell_padding.y;
	
	game.viewport_ctx.drawImage(
		game.resources.get(obj.res_key), 0, obj.image_size.y, 
		obj.image_size.x, obj.image_size.y, 
		x*CELL_SIZE - game.viewport_x - obj.image_padding.x, 
		y*CELL_SIZE - game.viewport_y - obj.image_padding.y, 
		obj.image_size.x, obj.image_size.y
	);
	game.viewport_ctx.drawImage(
		game.resources.get(obj.res_key), obj.image_size.x, obj.image_size.y, 
		obj.image_size.x, obj.image_size.y, 
		x*CELL_SIZE - game.viewport_x - obj.image_padding.x, 
		y*CELL_SIZE - game.viewport_y - obj.image_padding.y, 
		obj.image_size.x, obj.image_size.y
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
						xxx*CELL_SIZE - game.viewport_x, yyy*CELL_SIZE - game.viewport_y, CELL_SIZE, CELL_SIZE
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
					xxx*CELL_SIZE - game.viewport_x, yyy*CELL_SIZE - game.viewport_y, CELL_SIZE, CELL_SIZE
				);
			}
		}
	}
};

BridgeTypeBuilding.canBuild = function(obj, x, y, unit)
{
	var i = -1;
	
	if (!game.players[PLAYER_HUMAN].haveEnoughMoney(obj.cost))
		return false;
	
	if (!obj.enabled)
		return false;
	
	x -= obj.cell_padding.x;
	y -= obj.cell_padding.y;
	
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
			if (!MapCell.isCorrectX(yyy))
				return false;
			
			var cell = game.level.map_cells[xxx][yyy], unitid = MapCell.getSingleUserId(cell);
			if ((cell.type!=CELL_TYPE_EMPTY && cell.type!=CELL_TYPE_WATER) || (unitid!=-1 && unitid!=unit))
				return false;
		}
	}
	
	return true;
};

BridgeTypeBuilding.isCorrectLandForBuild = function(x, y, width, height)
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
}