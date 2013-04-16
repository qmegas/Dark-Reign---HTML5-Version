function TrainingFacility2Building(pos_x, pos_y, player)
{
	this._proto = TrainingFacility2Building;
	this.state = 'UPGRADING';
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(TrainingFacility2Building);

TrainingFacility2Building.res_key = 'training_facility2';
TrainingFacility2Building.obj_name = 'Advanced Training Facility';
TrainingFacility2Building.cost = 750;
TrainingFacility2Building.build_time = 15;
TrainingFacility2Building.sell_cost = 843;
TrainingFacility2Building.sell_time = 7;
TrainingFacility2Building.health_max = 1800;
TrainingFacility2Building.energy = 100;
TrainingFacility2Building.crater = 2;

TrainingFacility2Building.cell_size = {x: 5, y: 5};
TrainingFacility2Building.cell_matrix = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1];
TrainingFacility2Building.move_matrix = [0,0,1,1,0,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,0];
TrainingFacility2Building.cell_padding = {x: 2, y: 2};
TrainingFacility2Building.images = {
	normal: {
		size: {x: 119, y: 107},
		padding: {x: 0, y: -4},
		animated: true,
		frames: [1,2,3,2]
	},
	shadow: {
		size: {x: 129, y: 88},
		padding: {x: 0, y: -30}
	}
};
TrainingFacility2Building.hotpoints = [
	{x: 11, y: 13},
	{x: 58, y: 38},
	{x: 87, y: 77},
	{x: 60, y: 62}
];