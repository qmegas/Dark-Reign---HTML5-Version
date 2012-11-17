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