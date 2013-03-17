function TrainingFacility2Building(pos_x, pos_y, player)
{
	this._proto = TrainingFacility2Building;
	this.player = player;
	
	this.state = 'UPGRADING';
	
	this.init(pos_x, pos_y);
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
TrainingFacility2Building.image_size = {x: 119, y: 107};
TrainingFacility2Building.image_padding = {x: 0, y: -4};
TrainingFacility2Building.image_animated = true;
TrainingFacility2Building.image_animation_frames = [1,2,3,2];
TrainingFacility2Building.shadow_image_size = {x: 114, y: 85};
TrainingFacility2Building.shadow_image_padding = {x: -10, y: -31};