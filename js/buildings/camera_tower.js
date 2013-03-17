function CameraTowerBuilding(pos_x, pos_y, player)
{
	this._proto = CameraTowerBuilding;
	this.player = player;
	
	this.init(pos_x, pos_y);
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
CameraTowerBuilding.image_size = {x: 24, y: 48};
CameraTowerBuilding.image_padding = {x: 0, y: 0};
CameraTowerBuilding.shadow_image_size = {x: 34, y: 18};
CameraTowerBuilding.shadow_image_padding = {x: -11, y: -34};