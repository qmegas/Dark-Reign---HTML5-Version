function FGHeadquarterBuilding(pos_x, pos_y, player)
{
	this._proto = FGHeadquarterBuilding;

	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(FGHeadquarterBuilding);

FGHeadquarterBuilding.res_key = 'fg_headquarter';
FGHeadquarterBuilding.obj_name = 'Headquarter 1';
FGHeadquarterBuilding.cost = 750;
FGHeadquarterBuilding.build_time = 15;
FGHeadquarterBuilding.sell_cost = 375;
FGHeadquarterBuilding.sell_time = 7;
FGHeadquarterBuilding.health_max = 1200;

FGHeadquarterBuilding.energy = 100;
FGHeadquarterBuilding.enabled = Array.factory(PLAYERS_COUNT, true);
FGHeadquarterBuilding.can_build = true;
FGHeadquarterBuilding.crater = 4;

FGHeadquarterBuilding.cell_size = {x: 5, y: 4};
FGHeadquarterBuilding.cell_matrix = [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
FGHeadquarterBuilding.move_matrix = [1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0];
FGHeadquarterBuilding.cell_padding = {x: 2, y: 2};
FGHeadquarterBuilding.images = {
	normal: {
		size: {x: 119, y: 125},
		padding: {x: 0, y: 29}
	},
	shadow: {
		size: {x: 117, y: 70},
		padding: {x: -1, y: -10}
	}
};
FGHeadquarterBuilding.hotpoints = [
	{x: 13, y: -36},
	{x: 32, y: 25},
	{x: 40, y: 40},
	{x: 50, y: 18},
	{x: 49, y: 56},
	{x: 78, y: 23},
	{x: 89, y: 34}
];
FGHeadquarterBuilding.health_explosions = {
	0: 'headquarter_0_explosion',
	33: 'headquarter_33_explosion',
	60: 'headquarter_60_explosion',
	80: 'headquarter_80_explosion'
};

//FGHeadquarterBuilding.upgradable = true;
