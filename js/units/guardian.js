function GuardianUnit(pos_x, pos_y)
{
	this._proto = GuardianUnit;
	
	this.health = 100;
	this.speed = 1.371;
	
	this.move_direction = 0; //[E, NE, N, NW, W, SW, S, SE]
	this.direction_matrix = [3, 4, 5, -1, 2, -1, 6, -1, 1, 0, 7];
	this.move_path = [];
	
	this.startAnimation = 0; 
	
	this.setPosition(pos_x, pos_y);
	
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

GuardianUnit.prototype = new AbstractUnit();

GuardianUnit.obj_name = 'Guardian';
GuardianUnit.resource_key = 'guardian';
GuardianUnit.image_size = {width: 26, height: 26};
GuardianUnit.image_padding = {x: 1, y: 1};
GuardianUnit.sound_count = 4;

GuardianUnit.cost = 150;
GuardianUnit.health_max = 100;
GuardianUnit.weapon = LaserRifleWeapon;
GuardianUnit.enabled = false;

GuardianUnit.require_building = [TrainingFacilityBuilding];

GuardianUnit.construction_building = TrainingFacilityBuilding;
GuardianUnit.construction_time = 4;
GuardianUnit.construction_queue = 0;
GuardianUnit.construction_progress = 0;

GuardianUnit.loadResources = function() 
{
	AbstractUnit.loadResources(this);
}