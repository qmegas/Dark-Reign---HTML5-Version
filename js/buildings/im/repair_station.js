function RepairStationBuilding(pos_x, pos_y, player)
{
	this._proto = RepairStationBuilding;
	
	this.init(pos_x, pos_y, player);
	
	this.onHealed = function()
	{
		game.resources.playOnPosition('fixed', false, this.position, true);
		var pos = PathFinder.findNearestEmptyCell(this.action.target_position.x + 5, this.action.target_position.y, this._proto.move_mode);
		this.orderMove(pos.x, pos.y);
	};
}

AbstractBuilding.setBuildingCommonOptions(RepairStationBuilding);

RepairStationBuilding.res_key = 'repair_station';
RepairStationBuilding.obj_name = 'Repair Station';
RepairStationBuilding.cost = 800;
RepairStationBuilding.build_time = 16;
RepairStationBuilding.sell_cost = 400;
RepairStationBuilding.sell_time = 8;
RepairStationBuilding.health_max = 720;
RepairStationBuilding.energy = 100;
RepairStationBuilding.can_build = true;
RepairStationBuilding.crater = 3;
RepairStationBuilding.is_fixer = true;

RepairStationBuilding.cell_size = {x: 4, y: 4};
RepairStationBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
RepairStationBuilding.move_matrix = [1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0];
RepairStationBuilding.cell_padding = {x: 2, y: 2};
RepairStationBuilding.images = {
	normal: {
		size: {x: 94, y: 89},
		padding: {x: -1, y: -3}
	},
	shadow: {
		size: {x: 14, y: 19},
		padding: {x: -81, y: -61}
	}
};
RepairStationBuilding.hotpoints = [
	{x: 12, y: 12},
	{x: 81, y: 61},
	{x: 34, y: 73},
	{x: 77, y: 67}
];