function IMHeadquarter2Building(pos_x, pos_y, player)
{
	this._proto = IMHeadquarter2Building;
	this.state = BUILDING_STATE_UPGRADING;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(IMHeadquarter2Building);

IMHeadquarter2Building.res_key = 'im_headquarter2';
IMHeadquarter2Building.obj_name = 'Headquarter 2';
IMHeadquarter2Building.cost = 1000;
IMHeadquarter2Building.build_time = 20;
IMHeadquarter2Building.sell_cost = 656;
IMHeadquarter2Building.sell_time = 10;
IMHeadquarter2Building.health_max = 2880;

IMHeadquarter2Building.energy = 100;
IMHeadquarter2Building.crater = 4;

IMHeadquarter2Building.cell_size = {x: 5, y: 4};
IMHeadquarter2Building.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
IMHeadquarter2Building.move_matrix = [0,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,0,1,1,1];
IMHeadquarter2Building.cell_padding = {x: 2, y: 2};
IMHeadquarter2Building.images = {
	normal: {
		size: {x: 120, y: 144},
		padding: {x: 0, y: 48}
	},
	shadow: {
		size: {x: 162, y: 137},
		padding: {x: -5, y: 29}
	}
};
IMHeadquarter2Building.hotpoints = [
	{x: 12, y: -36},
	{x: 7, y: 52},
	{x: 101, y: 85},
	{x: 33, y: 21}
];
IMHeadquarter2Building.health_explosions = {
	0: 'headquarter_0_explosion',
	33: 'headquarter_33_explosion',
	60: 'headquarter_60_explosion',
	80: 'headquarter_80_explosion'
};

IMHeadquarter2Building.upgradable = true;