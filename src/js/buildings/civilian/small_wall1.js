function CivilianSmallWall1(pos_x, pos_y, player)
{
	this._proto = CivilianSmallWall1;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(CivilianSmallWall1);

CivilianSmallWall1.res_key = 'small_wall1';
CivilianSmallWall1.res_multicolor = false;
CivilianSmallWall1.obj_name = 'Barricade';
CivilianSmallWall1.cost = 100;
CivilianSmallWall1.build_time = 2;
CivilianSmallWall1.sell_cost = 50;
CivilianSmallWall1.sell_time = 1;
CivilianSmallWall1.health_max = 100;
CivilianSmallWall1.crater = 0;

CivilianSmallWall1.cell_size = {x: 2, y: 2};
CivilianSmallWall1.cell_matrix = [1,1,1,1];
CivilianSmallWall1.move_matrix = [1,1,1,1];
CivilianSmallWall1.cell_padding = {x: 1, y: 1};
CivilianSmallWall1.images = {
	normal: {
		size: {x: 47, y: 50},
		padding: {x: -2, y: 6}
	},
	shadow: {
		size: {x: 56, y: 30},
		padding: {x: -6, y: -14},
		static_img: true
	}
};
CivilianSmallWall1.hotpoints = [
	{x: 0, y: 0}, 
	{x: 2, y: 21}, 
	{x: 26, y: 35}, 
	{x: 43, y: 46}
];
CivilianSmallWall1.health_explosions = {
	0: 'building_0_explosion'
};
CivilianSmallWall1.death_sound = '';