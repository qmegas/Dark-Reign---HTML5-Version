function TrainingFacilityBuilding(pos_x, pos_y)
{
	this._proto = TrainingFacilityBuilding;
	this.health = this._proto.health_max;
	
	this.setPosition(pos_x, pos_y);
	this.setActionTime(this._proto.build_time);
	
	this.run = function()
	{
		switch (this.state)
		{
			case 'CONSTRUCTION':
				this._runStandartConstruction();
				break;
				
			case 'PRODUCING':
				this._runStandartProducing();
				break;
				
			case 'NORMAL':
				if (this.producing_queue.length > 0)
				{
					this.producing_start = (new Date).getTime();
					this.state = 'PRODUCING';
				}
				break;
		}
	}
}

TrainingFacilityBuilding.prototype = new AbstractBuilding();

TrainingFacilityBuilding.res_key = 'training_facility';
TrainingFacilityBuilding.obj_name = 'Training Facility';
TrainingFacilityBuilding.cost = 1500;
TrainingFacilityBuilding.sell_cost = 750;
TrainingFacilityBuilding.health_max = 1500;
TrainingFacilityBuilding.build_time = 15;
TrainingFacilityBuilding.energy = 100;
TrainingFacilityBuilding.enabled = false;
TrainingFacilityBuilding.count = 0;
TrainingFacilityBuilding.cell_size = {x: 5, y: 5};
TrainingFacilityBuilding.cell_matrix = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1];
TrainingFacilityBuilding.move_matrix = [0,0,1,1,0,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,0];
TrainingFacilityBuilding.cell_padding = {x: 2, y: 2};
TrainingFacilityBuilding.image_size = {x: 113, y: 100};
TrainingFacilityBuilding.image_padding = {x: 0, y: 0};
TrainingFacilityBuilding.require_building = [HeadquarterBuilding];

TrainingFacilityBuilding.loadResources = function(){
	AbstractBuilding.loadResources(this);
};