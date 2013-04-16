function AssemblyPlant2Building(pos_x, pos_y, player)
{
	this._proto = AssemblyPlant2Building;
	this.state = 'UPGRADING';
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(AssemblyPlant2Building);

AssemblyPlant2Building.res_key = 'assembly_plant2';
AssemblyPlant2Building.obj_name = 'Advenced Assembly Plant';
AssemblyPlant2Building.cost = 2500;
AssemblyPlant2Building.build_time = 50;
AssemblyPlant2Building.sell_cost = 1762;
AssemblyPlant2Building.sell_time = 25;
AssemblyPlant2Building.health_max = 2400;
AssemblyPlant2Building.energy = 100;
AssemblyPlant2Building.crater = 4;

AssemblyPlant2Building.cell_size = {x: 5, y: 5};
AssemblyPlant2Building.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
AssemblyPlant2Building.move_matrix = [0,0,1,1,0,0,1,1,0,1,0,1,0,1,1,0,1,1,1,0,0,1,1,1,0];
AssemblyPlant2Building.cell_padding = {x: 2, y: 4};
AssemblyPlant2Building.images = {
	normal: {
		size: {x: 119, y: 120},
		padding: {x: -1, y: -3}
	},
	shadow: {
		size: {x: 143, y: 92},
		padding: {x: -1, y: -45}
	}
};
AssemblyPlant2Building.hotpoints = [
	{x: 12, y: 14},
	{x: 45, y: 115},
	{x: 111, y: 67},
	{x: 82, y: 26}
];