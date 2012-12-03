function AbstractUnit(pos_x, pos_y, player)
{
	this.uid = -1;
	this.player = player;
	
	this._proto = null;
	
	this.health = 100;
	this.is_selected = false;
	this.is_fly = false;
	this.is_building = false;
	this.position = null;
	
	this.move_direction = 0; //[E, NE, N,    NW,     W,    SW, S, SE]
	this.direction_matrix =    [3,  4, 5, -1, 2, -1, 6, -1, 1, 0,  7];
	this.move_path = [];
	
	this.startAnimation = 0; 
	
	this.state = 'STAND';
	this.substate = '';
	
	this.getCell = function()
	{
		return {x: Math.floor(this.position.x/CELL_SIZE), y: Math.floor(this.position.y/CELL_SIZE)};
	}
	
	this.setPosition = function(pos_x, pos_y)
	{
		this.position = {x: pos_x*CELL_SIZE, y: pos_y*CELL_SIZE};
	}
	
	this.move = function(x, y, play_sound) 
	{
		var pos, need_move = false, tmp_path;
		
		if (this.move_path.length != 0)
		{
			this.move_path = this.move_path.slice(0, 1);
			pos = this.move_path[0];
		}
		else
		{
			pos = this.getCell();
			need_move = true;
		}
		
		tmp_path = PathFinder.findPath(pos.x, pos.y, x, y, true, false);
		
		if (tmp_path.length>0 && play_sound)
			this._playSound('move');
		
		this.move_path = this.move_path.concat(tmp_path);
		this.state = 'MOVE';
		
		if (need_move && this.move_path.length>0)
			this._moveToNextCell();
	}
	
	this.stop = function()
	{
		if (this.state == 'MOVE')
		{
			this.state = 'MOVE';
			this.substate = '';
			this.move_path = this.move_path.slice(0, 1);
		}
	}
	
	this.build = function(x, y, build)
	{
		this.build_pos = {x: x, y: y};
		this.build_obj = build;
		
		this.move(x, y, true);
		this.substate = 'BUILD';
	}
	
	this.run = function() 
	{
		switch (this.state)
		{
			case 'STAND':
				//Do nothing
				break;
				
			case 'MOVE':
				if (this.move_path.length == 0)
				{
					if (this.substate == 'BUILD')
					{
						var cell = this.getCell();
						if (cell.x==this.build_pos.x && cell.y==this.build_pos.y)
						{
							if (AbstractBuilding.canBuild(this.build_obj, cell.x, cell.y, this.uid))
							{
								AbstractBuilding.createNew(this.build_obj, cell.x, cell.y, this.player);
								if (this.is_selected)
									game.constructor.drawUnits();
								game.kill_objects.push(this.uid);
							}
						}
					}
					
					this.state = 'STAND';
					this.substate = '';
					return;
				}
				var next_cell = this.move_path[0], x_movement = 0, y_movement = 0, next_x = next_cell.x * CELL_SIZE, 
					next_y = next_cell.y * CELL_SIZE, change;
				
				if (next_x != this.position.x)
				{
					x_movement = (next_x>this.position.x) ? 1 : -1;
					change = Math.min(this._proto.speed, Math.abs(next_x - this.position.x));
					this.position.x += x_movement * change;
				}
				if (next_y != this.position.y)
				{
					y_movement = (next_y>this.position.y) ? 1 : -1;
					change = Math.min(this._proto.speed, Math.abs(next_y - this.position.y));
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
	
	this._moveToNextCell = function()
	{
		var curr_pos = this.getCell();

		//Check if next cell is not empty. If not empty then 
		if (MapCell.getIdByType(game.level.map_cells[this.move_path[0].x][this.move_path[0].y], this.is_fly) != -1)
		{
			//Stop
			if (this.move_path.length == 1)
			{
				this.move_path = [];
				return;
			}
			//recalculate route
			var last_point = this.move_path.pop();
			this.move_path = PathFinder.findPath(curr_pos.x, curr_pos.y, last_point.x, last_point.y, true, true);
		}

		//Move user to next cell + Remove from current
		if (this.is_fly)
		{
			game.level.map_cells[this.move_path[0].x][this.move_path[0].y].fly_unit = this.uid;
			game.level.map_cells[curr_pos.x][curr_pos.y].fly_unit = -1;
		}
		else
		{
			game.level.map_cells[this.move_path[0].x][this.move_path[0].y].ground_unit = this.uid;
			game.level.map_cells[curr_pos.x][curr_pos.y].ground_unit = -1;
		}
	}
	
	this.draw = function(current_time) 
	{
		var top_x = this.position.x - game.viewport_x - this._proto.image_padding.x, 
			top_y = this.position.y - game.viewport_y - this._proto.image_padding.y;
		
		//Draw unit
		switch (this.state)
		{
			case 'STAND':
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: this._proto.resource_key + '_stand',
					src_x: this.move_direction * this._proto.image_size.width,
					src_y: 0,
					src_width: this._proto.image_size.width,
					src_height: this._proto.image_size.height,
					x: top_x,
					y: top_y
				});
				break;
			
			case 'MOVE':
				var diff = (parseInt((current_time - this.startAnimation) / 50) % 6);
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: this._proto.resource_key + '_move',
					src_x: this.move_direction * this._proto.image_size.width,
					src_y: diff * this._proto.image_size.height,
					src_width: this._proto.image_size.width,
					src_height: this._proto.image_size.height,
					x: top_x,
					y: top_y
				});
				break;
		}
	}
	
	//Draw Selection
	this.drawSelection = function(is_onmouse)
	{
		var top_x = this.position.x - game.viewport_x + 0.5 - this._proto.image_padding.x, 
			top_y = this.position.y - game.viewport_y - 2.5  - this._proto.image_padding.y,
			sel_width = this._proto.image_size.width, health_width = parseInt(sel_width*0.63);
			
		if (this.player == PLAYER_NEUTRAL)
			game.viewport_ctx.strokeStyle = '#ffff00';
		else if (this.player == PLAYER_HUMAN)
			game.viewport_ctx.strokeStyle = '#ffffff';
		else
			game.viewport_ctx.strokeStyle = '#fc0800'; //Change it later to support aliances
		
		game.viewport_ctx.lineWidth = 1;
		
		game.viewport_ctx.beginPath();
		game.viewport_ctx.moveTo(top_x, top_y + 8);
		game.viewport_ctx.lineTo(top_x, top_y);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y + 8);
		game.viewport_ctx.moveTo(top_x + sel_width, top_y + sel_width - 3);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y + sel_width + 5);
		game.viewport_ctx.lineTo(top_x, top_y + sel_width + 5);
		game.viewport_ctx.lineTo(top_x, top_y + sel_width - 3);
		game.viewport_ctx.stroke();
		
		//Health
		var health_top_x = top_x + parseInt((sel_width - health_width)/2) - 0.5;
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(health_top_x, top_y-1.5, health_width, 4);

		if (this.health < this._proto.health_max)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(health_top_x + 1, top_y-0.5, health_width - 2, 2);
		}

		var health_proc = this.health / this._proto.health_max;
		if (health_proc > 0.66)
			game.viewport_ctx.fillStyle = '#51FA00';
		else if (health_proc > 0.33)
			game.viewport_ctx.fillStyle = '#FCFC00';
		else
			game.viewport_ctx.fillStyle = '#FC0000';
		game.viewport_ctx.fillRect(health_top_x + 1, top_y-0.5, (health_width - 2)*health_proc, 2);
		
		//Draw name
		if (is_onmouse)
			game.fontDraw.drawOnCanvas(this._proto.obj_name, game.viewport_ctx, top_x, top_y - 16, 'yellow', 'center', sel_width);
	}
	
	this.canBeSelected = function()
	{
		return (this.player == PLAYER_HUMAN);
	}
	
	this.select = function(is_select, play_sound)
	{
		this.is_selected = is_select;
		if (this.is_selected)
		{
			//Play select sound
			if (play_sound)
				this._playSound('select');

		}
	}
	
	this._playSound = function(type)
	{
		var i = Math.floor((Math.random()*this._proto.sound_count)+1);
		game.resources.get(this._proto.resource_key + '_' + type + i).play();
	}
	
	this.markCellsOnMap = function(unitid)
	{
		var cell = this.getCell();
		
		if (unitid == -1)
		{
			if (this.is_fly)
			{
				if (game.level.map_cells[cell.x][cell.y].fly_unit == this.uid)
					game.level.map_cells[cell.x][cell.y].fly_unit = -1;
			}
			else
			{
				if (game.level.map_cells[cell.x][cell.y].ground_unit == this.uid)
					game.level.map_cells[cell.x][cell.y].ground_unit = -1;
			}
		}
		else
		{
			if (this.is_fly)
				game.level.map_cells[cell.x][cell.y].fly_unit = unitid;
			else
				game.level.map_cells[cell.x][cell.y].ground_unit = unitid;
		}
	}
	
	this.canAttackGround = function()
	{
		if (this._proto.weapon === null)
			return false;
		return this._proto.weapon.can_shoot_ground;
	}
	
	this.canAttackFly = function()
	{
		if (this._proto.weapon === null)
			return false;
		return this._proto.weapon.can_shoot_flyer;
	}
	
	this.attack = function(/* Add parameters here */)
	{
	}
}

AbstractUnit.createNew = function(obj, x, y, player, instant_build)
{
	var uid = game.objects.length;
	game.objects.push(new obj(x, y, player));
	game.objects[uid].uid = uid;
	game.objects[uid].markCellsOnMap(uid);
	
	if (!instant_build)
		game.notifications.addSound('unit_completed');
	
	return game.objects[uid];
}

AbstractUnit.loadResources = function(obj) 
{
	game.resources.addImage(obj.resource_key + '_stand', 'images/units/' + obj.resource_key + '/stand.png');
	game.resources.addImage(obj.resource_key + '_move',  'images/units/' + obj.resource_key + '/move.png');
	
	for (var i=1; i<=obj.sound_count; ++i)
	{
		game.resources.addSound(obj.resource_key + '_move' + i,   'sounds/units/' + obj.resource_key + '/move' + i + '.' + AUDIO_TYPE);
		game.resources.addSound(obj.resource_key + '_select' + i, 'sounds/units/' + obj.resource_key + '/select' + i + '.' + AUDIO_TYPE);
	}
	
	if (obj.weapon !== null)
		obj.weapon.loadResources();
}