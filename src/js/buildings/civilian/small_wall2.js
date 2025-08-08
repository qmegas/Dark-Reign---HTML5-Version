function CivilianSmallWall2(pos_x, pos_y, player)
{
	this._proto = CivilianSmallWall2;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(CivilianSmallWall2);

CivilianSmallWall2.res_key = 'small_wall2';
CivilianSmallWall2.res_multicolor = false;
CivilianSmallWall2.obj_name = 'Barricade';
CivilianSmallWall2.cost = 100;
CivilianSmallWall2.build_time = 2;
CivilianSmallWall2.sell_cost = 50;
CivilianSmallWall2.sell_time = 1;
CivilianSmallWall2.health_max = 100;
CivilianSmallWall2.crater = 0;

CivilianSmallWall2.cell_size = {x: 2, y: 2};
CivilianSmallWall2.cell_matrix = [1,1,1,1];
CivilianSmallWall2.move_matrix = [1,1,1,1];
CivilianSmallWall2.cell_padding = {x: 1, y: 1};
CivilianSmallWall2.images = {
	normal: {
		size: {x: 46, y: 52},
		padding: {x: -1, y: 3}
	},
	shadow: {
		size: {x: 150, y: 85},
		padding: {x: -7, y: -18},
		static_img: true
	}
};
CivilianSmallWall2.hotpoints = [
	{x: 0, y: 0}, 
	{x: 42, y: 22}, 
	{x: 18, y: 38}, 
	{x: 4, y: 44}
];
CivilianSmallWall2.health_explosions = {
	0: 'building_0_explosion'
};
CivilianSmallWall2.death_sound = '';