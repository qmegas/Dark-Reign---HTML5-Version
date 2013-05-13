function MapCell()
{
}

MapCell.getSingleUserId = function(cell)
{
	if (cell.fly_unit != -1)
		return cell.fly_unit;
	if (cell.ground_unit != -1)
		return cell.ground_unit;
	if (cell.building != -1)
		return cell.building;
	
	return -1;
};

MapCell.getAllUserIds = function(cell)
{
	var ids = [];
	
	if (cell.fly_unit != -1)
		ids.push(cell.fly_unit);
	if (cell.ground_unit != -1)
		ids.push(cell.ground_unit);
	if (cell.building != -1)
		ids.push(cell.building);
	
	return ids;
};

MapCell.getIdByType = function(x, y, is_fly)
{
	var cell = game.level.map_cells[x][y];
	
	if (is_fly)
		return cell.fly_unit;
	return cell.ground_unit;
};

MapCell.getIdsByLayer = function(x, y, layer)
{
	var cell = game.level.map_cells[x][y], ids = [];
	
	if (layer == MOVE_MODE_FLY)
	{
		if (cell.fly_unit != -1)
			ids.push(cell.fly_unit);
	}
	else
	{
		if (cell.ground_unit != -1)
			ids.push(cell.ground_unit);
		if (cell.building != -1)
			ids.push(cell.building);
	}
	return ids;
};

MapCell.canStepInto = function(x, y, move_mode)
{
	var cell = game.level.map_cells[x][y];
	
	if (cell.type==CELL_TYPE_WATER && move_mode==MOVE_MODE_GROUND)
		return false;
	if ((cell.type==CELL_TYPE_NOWALK || cell.type==CELL_TYPE_BUILDING) && move_mode!=MOVE_MODE_FLY)
		return false;
	
	return true;
};

MapCell.isCorrectX = function(x)
{
	return !(x<0 || x>=game.level.size.x-1);
};

MapCell.isCorrectY = function(y)
{
	return !(y<0 || y>=game.level.size.y-1);
};

MapCell.isCorrectCord = function(x, y)
{
	return (MapCell.isCorrectX(x) && MapCell.isCorrectY(y));
};

MapCell.getPixelDistance = function(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

MapCell.pixelToCell = function(pixel_pos)
{
	return {
		x: Math.floor((pixel_pos.x - 12) / CELL_SIZE),
		y: Math.floor((pixel_pos.y - 12) / CELL_SIZE)
	};
};

MapCell.cellToPixel = function(cell_pos)
{
	return {x: cell_pos.x*CELL_SIZE + 12, y: cell_pos.y*CELL_SIZE + 12};
};