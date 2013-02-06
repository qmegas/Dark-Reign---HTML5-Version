function TrainingFacility2Building(pos_x, pos_y, player)
{
	this._proto = TrainingFacility2Building;
	this.player = player;
	this.health = this._proto.health_max;
	
	this.state = 'UPGRADING';
	
	//Building animation
	this._draw_last_frame_change = 0;
	this._draw_cur_frame = 0;
	this._draw_from_to_pos = [1,2,3,2];
	
	this.init(pos_x, pos_y);
	this.setActionTime(this._proto.build_time);
	
	this.run = function()
	{
		switch (this.state)
		{
			case 'UPGRADING':
				this._runStandartConstruction();
				break;
				
			case 'PRODUCING':
				this._runStandartProducing();
				break;
				
			case 'NORMAL':
				if (this.producing_queue.length > 0)
				{
					this.producing_start = (new Date()).getTime();
					this.state = 'PRODUCING';
				}
				break;
				
			case 'SELL':
				this._runStandartSell();
				break;
		}
	}
	
	this.draw = function(cur_time)
	{
		if (this.state == 'UPGRADING')
		{
			game.objDraw.addElement(DRAW_LAYER_GBUILD, this.position.x, {
				res_key: this._proto.res_key,
				src_x: 0,
				src_y: 0,
				src_width: this._proto.image_size.x,
				src_height: this._proto.image_size.y,
				x: this.position.x - this._proto.image_padding.x - game.viewport_x,
				y: this.position.y - this._proto.image_padding.y - game.viewport_y
			});
			game.objDraw.addElement(DRAW_LAYER_TBUILD, this.position.x, {
				res_key: this._proto.res_key,
				src_x: this._proto.image_size.x,
				src_y: 0,
				src_width: this._proto.image_size.x,
				src_height: this._proto.image_size.y,
				x: this.position.x - this._proto.image_padding.x - game.viewport_x,
				y: this.position.y - this._proto.image_padding.y - game.viewport_y
			});
		}
		else
		{
			game.objDraw.addElement(DRAW_LAYER_GBUILD, this.position.x, {
				res_key: this._proto.res_key,
				src_x: 0,
				src_y: this._proto.image_size.y,
				src_width: this._proto.image_size.x,
				src_height: this._proto.image_size.y,
				x: this.position.x - this._proto.image_padding.x - game.viewport_x,
				y: this.position.y - this._proto.image_padding.y - game.viewport_y
			});
			game.objDraw.addElement(DRAW_LAYER_TBUILD, this.position.x, {
				res_key: this._proto.res_key,
				src_x: this._draw_from_to_pos[this._draw_cur_frame]*this._proto.image_size.x,
				src_y: this._proto.image_size.y,
				src_width: this._proto.image_size.x,
				src_height: this._proto.image_size.y,
				x: this.position.x - this._proto.image_padding.x - game.viewport_x,
				y: this.position.y - this._proto.image_padding.y - game.viewport_y
			});
			if ((cur_time - this._draw_last_frame_change)>200)
			{
				++this._draw_cur_frame;
				this._draw_cur_frame %= 4;
				this._draw_last_frame_change = cur_time;
			}
		}
	}
}

AbstractBuilding.setBuildingCommonOptions(TrainingFacility2Building);

TrainingFacility2Building.res_key = 'training_facility2';
TrainingFacility2Building.obj_name = 'Advanced Training Facility';
TrainingFacility2Building.cost = 750;
TrainingFacility2Building.sell_cost = 843;
TrainingFacility2Building.health_max = 1800;
TrainingFacility2Building.build_time = 15;
TrainingFacility2Building.energy = 100;

TrainingFacility2Building.cell_size = {x: 5, y: 5};
TrainingFacility2Building.cell_matrix = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1];
TrainingFacility2Building.move_matrix = [0,0,1,1,0,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,0];
TrainingFacility2Building.cell_padding = {x: 2, y: 2};
TrainingFacility2Building.image_size = {x: 119, y: 107};
TrainingFacility2Building.image_padding = {x: 0, y: -4};