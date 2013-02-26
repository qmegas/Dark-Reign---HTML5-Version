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
}

MapCell.getIdByType = function(cell, is_fly)
{
	if (is_fly)
		return cell.fly_unit;
	return cell.ground_unit;
}

MapCell.isCorrectX = function(x)
{
	return !(x<0 || x>game.level.size.x-1)
}

MapCell.isCorrectY = function(y)
{
	return !(y<0 || y>game.level.size.y-1)
}

MapCell.isCorrectCord = function(x, y)
{
	return (MapCell.isCorrectX(x) && MapCell.isCorrectY(y));
}

MapCell.getCellDistance = function(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

MapCell.getPixelDistance = function(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow((x2 - x1)*CELL_SIZE, 2) + Math.pow((y2 - y1)*CELL_SIZE, 2));
}