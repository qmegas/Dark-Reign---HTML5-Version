function HeadquarterBuilding(pos_x, pos_y, player)
{
	this._proto = HeadquarterBuilding;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractBuilding.setBuildingCommonOptions(HeadquarterBuilding);

HeadquarterBuilding.res_key = 'headquarter';
HeadquarterBuilding.obj_name = 'Headquarter 1';
HeadquarterBuilding.cost = 750;
HeadquarterBuilding.build_time = 15;
HeadquarterBuilding.sell_cost = 375;
HeadquarterBuilding.sell_time = 7;
HeadquarterBuilding.health_max = 1440;

HeadquarterBuilding.energy = 100;
HeadquarterBuilding.enabled = true;
HeadquarterBuilding.can_build = true;
HeadquarterBuilding.crater = 4;

HeadquarterBuilding.cell_size = {x: 5, y: 4};
HeadquarterBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
HeadquarterBuilding.move_matrix = [0,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,0,1,1,1];
HeadquarterBuilding.cell_padding = {x: 2, y: 2};
HeadquarterBuilding.images = {
	normal: {
		size: {x: 105, y: 138},
		padding: {x: -11, y: 42}
	},
	shadow: {
		size: {x: 122, y: 88},
		padding: {x: -19, y: -6}
	}
};
HeadquarterBuilding.hotpoints = [
	{x: 24, y: -36},
	{x: 92, y: 52},
	{x: 88, y: 31},
	{x: 40, y: 8}
];
HeadquarterBuilding.upgradable = true;