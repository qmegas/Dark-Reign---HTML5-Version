function CivilianHorizontalBridge(pos_x, pos_y, player)
{
	this._proto = CivilianHorizontalBridge;
	
	this.init(pos_x, pos_y, player);
	
	this.onConstructedCustom = function()
	{
		BridgeTypeBuilding.changeLandType(this);
	};
	
	this.onObjectDeletion = function() 
	{
		this.markCellsOnMap(-1);
		BridgeTypeBuilding.restoreLandType(this);
	};
}

AbstractBuilding.setBuildingCommonOptions(CivilianHorizontalBridge);

CivilianHorizontalBridge.res_key = 'civilian_horizontal_bridge';
CivilianHorizontalBridge.res_multicolor = false;
CivilianHorizontalBridge.obj_name = 'Horizontal Bridge';
CivilianHorizontalBridge.cost = 100;
CivilianHorizontalBridge.build_time = 2;
CivilianHorizontalBridge.sell_cost = 50;
CivilianHorizontalBridge.sell_time = 1;
CivilianHorizontalBridge.health_max = 4000;
CivilianHorizontalBridge.crater = 5;
CivilianHorizontalBridge.is_bridge = true;
CivilianHorizontalBridge.is_built_from_edge = true;

CivilianHorizontalBridge.cell_size = {x: 6, y: 4};
CivilianHorizontalBridge.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
CivilianHorizontalBridge.move_matrix = [1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1];
CivilianHorizontalBridge.cell_padding = {x: 3, y: 2};
CivilianHorizontalBridge.images = {
	normal: {
		size: {x: 144, y: 91},
		padding: {x: -1, y: 1}
	},
	shadow: {
		size: {x: 150, y: 85},
		padding: {x: -1, y: -18},
		static_img: true
	}
};
CivilianHorizontalBridge.hotpoints = [
	{x: 70, y: 40}
];
CivilianHorizontalBridge.health_explosions = {
	0: 'bridge2_explosion'
};
CivilianHorizontalBridge.death_sound = '';