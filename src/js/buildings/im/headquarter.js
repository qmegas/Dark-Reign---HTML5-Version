function IMHeadquarterBuilding(pos_x, pos_y, player)
{
	this._proto = IMHeadquarterBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(IMHeadquarterBuilding);

IMHeadquarterBuilding.res_key = 'im_headquarter';
IMHeadquarterBuilding.obj_name = 'Headquarter 1';
IMHeadquarterBuilding.cost = 750;
IMHeadquarterBuilding.build_time = 15;
IMHeadquarterBuilding.sell_cost = 375;
IMHeadquarterBuilding.sell_time = 7;
IMHeadquarterBuilding.health_max = 1440;

IMHeadquarterBuilding.energy = 100;
IMHeadquarterBuilding.enabled = Array.factory(PLAYERS_COUNT, true);
IMHeadquarterBuilding.can_build = true;
IMHeadquarterBuilding.crater = 4;

IMHeadquarterBuilding.cell_size = {x: 5, y: 4};
IMHeadquarterBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
IMHeadquarterBuilding.move_matrix = [0,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,0,1,1,1];
IMHeadquarterBuilding.cell_padding = {x: 2, y: 2};
IMHeadquarterBuilding.images = {
	normal: {
		size: {x: 109, y: 138},
		padding: {x: -11, y: 42}
	},
	shadow: {
		size: {x: 122, y: 88},
		padding: {x: -19, y: -6}
	}
};
IMHeadquarterBuilding.hotpoints = [
	{x: 24, y: -36},
	{x: 92, y: 52},
	{x: 88, y: 31},
	{x: 40, y: 8}
];
IMHeadquarterBuilding.health_explosions = {
	0: 'headquarter_0_explosion',
	33: 'headquarter_33_explosion',
	60: 'headquarter_60_explosion',
	80: 'headquarter_80_explosion'
};

IMHeadquarterBuilding.upgradable = true;
