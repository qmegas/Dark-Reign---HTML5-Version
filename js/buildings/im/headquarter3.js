function IMHeadquarter3Building(pos_x, pos_y, player)
{
	this._proto = IMHeadquarter3Building;
	this.state = BUILDING_STATE_UPGRADING;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(IMHeadquarter3Building);

IMHeadquarter3Building.res_key = 'im_headquarter3';
IMHeadquarter3Building.obj_name = 'Headquarter 3';
IMHeadquarter3Building.cost = 1250;
IMHeadquarter3Building.build_time = 25;
IMHeadquarter3Building.sell_cost = 1124;
IMHeadquarter3Building.sell_time = 12;
IMHeadquarter3Building.health_max = 4330;
IMHeadquarter3Building.energy = 100;
IMHeadquarter3Building.crater = 4;
IMHeadquarter3Building.seeing_range = 16;

IMHeadquarter3Building.cell_size = {x: 5, y: 4};
IMHeadquarter3Building.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
IMHeadquarter3Building.move_matrix = [0,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,0,1,1,1];
IMHeadquarter3Building.cell_padding = {x: 2, y: 2};
IMHeadquarter3Building.images = {
	normal: {
		size: {x: 119, y: 144},
		padding: {x: 5, y: 48}
	},
	shadow: {
		size: {x: 161, y: 76},
		padding: {x: 1, y: -37}
	}
};
IMHeadquarter3Building.hotpoints = [
	{x: 6, y: -36},
	{x: 11, y: 52},
	{x: 95, y: 85},
	{x: 27, y: 21}
];
IMHeadquarter3Building.health_explosions = {
	0: 'headquarter_0_explosion',
	33: 'headquarter_33_explosion',
	60: 'headquarter_60_explosion',
	80: 'headquarter_80_explosion'
};