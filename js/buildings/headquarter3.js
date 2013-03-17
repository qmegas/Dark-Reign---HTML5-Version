function Headquarter3Building(pos_x, pos_y, player)
{
	this._proto = Headquarter3Building;
	this.player = player;
	
	this.state = 'UPGRADING';
	
	this.init(pos_x, pos_y);
}

AbstractBuilding.setBuildingCommonOptions(Headquarter3Building);

Headquarter3Building.res_key = 'headquarter3';
Headquarter3Building.obj_name = 'Headquarter 3';
Headquarter3Building.cost = 1250;
Headquarter3Building.build_time = 25;
Headquarter3Building.sell_cost = 1124;
Headquarter3Building.sell_time = 12;
Headquarter3Building.health_max = 4330;
Headquarter3Building.energy = 100;
Headquarter3Building.crater = 4;

Headquarter3Building.cell_size = {x: 5, y: 4};
Headquarter3Building.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
Headquarter3Building.move_matrix = [0,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,0,1,1,1];
Headquarter3Building.cell_padding = {x: 2, y: 2};
Headquarter3Building.image_size = {x: 119, y: 144};
Headquarter3Building.image_padding = {x: 5, y: 48};
Headquarter3Building.shadow_image_size = {x: 161, y: 76};
Headquarter3Building.shadow_image_padding = {x: 1, y: -37};