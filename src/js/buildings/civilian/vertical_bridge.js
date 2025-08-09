function CivilianVerticalBridge(pos_x, pos_y, player)
{
	this._proto = CivilianVerticalBridge;
	
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

AbstractBuilding.setBuildingCommonOptions(CivilianVerticalBridge);

CivilianVerticalBridge.res_key = 'civilian_vertical_bridge';
CivilianVerticalBridge.res_multicolor = false;
CivilianVerticalBridge.obj_name = 'Vertical Bridge';
CivilianVerticalBridge.cost = 100;
CivilianVerticalBridge.build_time = 2;
CivilianVerticalBridge.sell_cost = 50;
CivilianVerticalBridge.sell_time = 1;
CivilianVerticalBridge.health_max = 4000;
CivilianVerticalBridge.crater = 6;
CivilianVerticalBridge.is_bridge = true;
CivilianVerticalBridge.is_built_from_edge = true;

CivilianVerticalBridge.cell_size = {x: 4, y: 6};
CivilianVerticalBridge.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
CivilianVerticalBridge.move_matrix = [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1];
CivilianVerticalBridge.cell_padding = {x: 2, y: 3};
CivilianVerticalBridge.images = {
	normal: {
		size: {x: 82, y: 144},
		padding: {x: -7, y: 0}
	},
	shadow: {
		size: {x: 110, y: 146},
		padding: {x: -11, y: 0},
		static_img: true
	}
};
CivilianVerticalBridge.hotpoints = [
	{x: 40, y: 70}
];
CivilianVerticalBridge.health_explosions = {
	0: 'bridge_explosion'
};
CivilianVerticalBridge.death_sound = '';