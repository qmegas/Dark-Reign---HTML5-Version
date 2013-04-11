function CameraTowerBuilding(pos_x, pos_y, player)
{
	this._proto = CameraTowerBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(CameraTowerBuilding);

CameraTowerBuilding.res_key = 'camera_tower';
CameraTowerBuilding.obj_name = 'Camera Tower';
CameraTowerBuilding.cost = 200;
CameraTowerBuilding.build_time = 4;
CameraTowerBuilding.sell_cost = 100;
CameraTowerBuilding.sell_time = 2;
CameraTowerBuilding.health_max = 150;
CameraTowerBuilding.energy = 50;
CameraTowerBuilding.can_build = true;
CameraTowerBuilding.crater = 0;
CameraTowerBuilding.is_built_from_edge = true;

CameraTowerBuilding.cell_size = {x: 1, y: 2};
CameraTowerBuilding.cell_matrix = [1,1];
CameraTowerBuilding.move_matrix = [1,1];
CameraTowerBuilding.cell_padding = {x: 0, y: 1};
CameraTowerBuilding.images = {
	normal: {
		size: {x: 24, y: 48},
		padding: {x: 0, y: 0}
	},
	shadow: {
		size: {x: 34, y: 18},
		padding: {x: -11, y: -34}
	}
};
CameraTowerBuilding.hotpoints = [
	{x: 12, y: 12},
	{x: 13, y: 22}
];
CameraTowerBuilding.health_explosions = {
	0: 'building_0_explosion',
	60: 'building_60_explosion',
	80: 'building_80_explosion'
};
CameraTowerBuilding.death_sound = 'gxexpoc2';