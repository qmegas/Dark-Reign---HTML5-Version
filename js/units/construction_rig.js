function ConstructionRigUnit(pos_x, pos_y)
{
	this._proto = ConstructionRigUnit;
	
	this.health = 100;
	this.speed = 1.2;
	
	this.move_direction = 0; //[E, NE, N, NW, W, SW, S, SE]
	this.direction_matrix = [3, 4, 5, -1, 2, -1, 6, -1, 1, 0, 7];
	this.move_path = [];
	
	this.startAnimation = 0; 
	
	this.build_pos = {};
	this.build_obj = {};
	
	this.setPosition(pos_x, pos_y);
	
	this.build = function(x, y, build)
	{
		this.build_pos = {x: x, y: y};
		this.build_obj = build;
		
		this.move(x, y, true);
		this.state = 'BUILD';
	}
	
	this.draw = function(current_time) 
	{
		var top_x = this.position.x - game.viewport_x, top_y = this.position.y - game.viewport_y;
		
		//Draw unit
		switch (this.state)
		{
			case 'STAND':
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: this._proto.resource_key + '_stand',
					src_x: this.move_direction * this._proto.imgage_size.width,
					src_y: 0,
					src_width: this._proto.imgage_size.width,
					src_height: this._proto.imgage_size.height,
					x: top_x,
					y: top_y
				});
				break;
			
			case 'BUILD':
			case 'MOVE':
				var diff = (parseInt((current_time - this.startAnimation) / 50) % 6);
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: this._proto.resource_key + '_move',
					src_x: this.move_direction * this._proto.imgage_size.width,
					src_y: diff * this._proto.imgage_size.height,
					src_width: this._proto.imgage_size.width,
					src_height: this._proto.imgage_size.height,
					x: top_x,
					y: top_y
				});
				break;
		}
	}
	
	this.run = function() 
	{
		switch (this.state)
		{
			case 'STAND':
				//Do nothing
				break;
				
			case 'BUILD':
			case 'MOVE':
				if (this.move_path.length == 0)
				{
					if (this.state == 'BUILD')
					{
						var cell = this.getCell();
						if (cell.x==this.build_pos.x && cell.y==this.build_pos.y)
						{
							if (AbstractBuilding.canBuild(this.build_obj, cell.x, cell.y, this.uid))
							{
								AbstractBuilding.createNew(this.build_obj, cell.x, cell.y);
								if (this.is_selected)
									game.constructor.drawUnits();
								game.kill_objects.push(this.uid);
							}
						}
					}
					
					this.state = 'STAND';
					return;
				}
				var next_cell = this.move_path[0], x_movement = 0, y_movement = 0, next_x = next_cell.x * CELL_SIZE, 
					next_y = next_cell.y * CELL_SIZE, change;
				
				if (next_x != this.position.x)
				{
					x_movement = (next_x>this.position.x) ? 1 : -1;
					change = Math.min(this.speed, Math.abs(next_x - this.position.x));
					this.position.x += x_movement * change;
				}
				if (next_y != this.position.y)
				{
					y_movement = (next_y>this.position.y) ? 1 : -1;
					change = Math.min(this.speed, Math.abs(next_y - this.position.y));
					this.position.y += y_movement * change;
				}
				
				this.move_direction = this.direction_matrix[(x_movement+1)*4 + y_movement + 1];
				
				if (next_x==this.position.x && next_y==this.position.y)
				{
					this.move_path.shift();
					
					if (this.move_path.length != 0)
						this._moveToNextCell();
				}
				break;
		}
	}
}

ConstructionRigUnit.prototype = new AbstractUnit();

ConstructionRigUnit.box_image = 'construction_rig/box.png';
ConstructionRigUnit.obj_name = 'Construction Rig';
ConstructionRigUnit.cost = 150;
ConstructionRigUnit.health_max = 100;
ConstructionRigUnit.resource_key = 'construction_rig';
ConstructionRigUnit.imgage_size = {width: 35, height: 35};
ConstructionRigUnit.enabled = false;
ConstructionRigUnit.require_building = [HeadquarterBuilding];
ConstructionRigUnit.construction_building = HeadquarterBuilding;
ConstructionRigUnit.construction_time = 6;
ConstructionRigUnit.construction_queue = 0;
ConstructionRigUnit.construction_progress = 0;

ConstructionRigUnit.loadResources = function() 
{
	game.resources.addImage(ConstructionRigUnit.resource_key + '_stand', 'images/units/construction_rig/stand.png');
	game.resources.addImage(ConstructionRigUnit.resource_key + '_move',  'images/units/construction_rig/move.png');
	game.resources.addSound(ConstructionRigUnit.resource_key + '_move1',   'sounds/units/construction_rig/move1.' + AUDIO_TYPE);
	game.resources.addSound(ConstructionRigUnit.resource_key + '_move2',   'sounds/units/construction_rig/move2.' + AUDIO_TYPE);
	game.resources.addSound(ConstructionRigUnit.resource_key + '_move3',   'sounds/units/construction_rig/move3.' + AUDIO_TYPE);
	game.resources.addSound(ConstructionRigUnit.resource_key + '_select1', 'sounds/units/construction_rig/select1.' + AUDIO_TYPE);
	game.resources.addSound(ConstructionRigUnit.resource_key + '_select2', 'sounds/units/construction_rig/select2.' + AUDIO_TYPE);
	game.resources.addSound(ConstructionRigUnit.resource_key + '_select3', 'sounds/units/construction_rig/select3.' + AUDIO_TYPE);
}