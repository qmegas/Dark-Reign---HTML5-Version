function AssemblyPlantBuilding(pos_x, pos_y, player)
{
	this._proto = AssemblyPlantBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(AssemblyPlantBuilding);

AssemblyPlantBuilding.res_key = 'assembly_plant';
AssemblyPlantBuilding.obj_name = 'Assembly Plant';
AssemblyPlantBuilding.cost = 2200;
AssemblyPlantBuilding.build_time = 44;
AssemblyPlantBuilding.sell_cost = 1100;
AssemblyPlantBuilding.sell_time = 22;
AssemblyPlantBuilding.health_max = 1200;
AssemblyPlantBuilding.energy = 100;
AssemblyPlantBuilding.can_build = true;
AssemblyPlantBuilding.crater = 4;

AssemblyPlantBuilding.cell_size = {x: 5, y: 5};
AssemblyPlantBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
AssemblyPlantBuilding.move_matrix = [0,0,1,1,0,0,1,1,0,1,0,1,0,1,1,0,1,1,1,0,0,1,1,1,0];
AssemblyPlantBuilding.cell_padding = {x: 2, y: 2};
AssemblyPlantBuilding.images = {
	normal: {
		size: {x: 119, y: 117},
		padding: {x: -1, y: -3}
	},
	shadow: {
		size: {x: 117, y: 75},
		padding: {x: -7, y: -62}
	}
};
AssemblyPlantBuilding.hotpoints = [
	{x: 12, y: 12},
	{x: 69, y: 91},
	{x: 88, y: 79},
	{x: 15, y: 60},
	{x: 70, y: 42}
];

AssemblyPlantBuilding.upgradable = true;