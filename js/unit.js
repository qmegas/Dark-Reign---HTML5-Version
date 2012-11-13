function TestUnit(pos_x, pos_y)
{
	this.uid = -1;

	this.health = 100;
	this.is_selected = false;
	this.is_fly = false;
	this.is_building = false;
	this.speed = 1.2;
	
	this.position = {x: pos_x*CELL_SIZE, y: pos_y*CELL_SIZE};
	
	this.state = 'STAND';
	
	this.move_direction = 0; //[E, NE, N, NW, W, SW, S, SE]
	this.direction_matrix = [3, 4, 5, -1, 2, -1, 6, -1, 1, 0, 7];
	this.move_path = [];
	
	this.startAnimation = 0; 
	
	this.build_pos = {};
	this.build_obj = {};
	
	this.onUnderAttack = function(){}
	
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
	
	this.build = function(x, y, build)
	{
		this.build_pos = {x: x, y: y};
		this.build_obj = build;
		
		this.move(x, y, true);
		this.state = 'BUILD';
	}
	
	this.stop = function()
	{
		if (this.state == 'MOVE' || this.state == 'BUILD')
		{
			this.state = 'MOVE';
			this.move_path = this.move_path.slice(0, 1);
		}
	}
	
	//Parental function
	this.getCell = function()
	{
		return {x: Math.floor(this.position.x/CELL_SIZE), y: Math.floor(this.position.y/CELL_SIZE)};
	}
	
	this.draw = function(current_time) 
	{
		var top_x = this.position.x - game.viewport_x, top_y = this.position.y - game.viewport_y;
		
		//Draw unit
		switch (this.state)
		{
			case 'STAND':
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: 'test_unit_stand.png',
					src_x: this.move_direction*this.width,
					src_y: 0,
					src_width: this.width,
					src_height: this.height,
					x: top_x,
					y: top_y
				});
				break;
			
			case 'BUILD':
			case 'MOVE':
				var diff = (parseInt((current_time - this.startAnimation) / 50) % 6);
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: 'test_unit_move.png',
					src_x: this.move_direction*this.width,
					src_y: diff*this.height,
					src_width: this.width,
					src_height: this.height,
					x: top_x,
					y: top_y
				});
				break;
		}
	}
	
	//Draw Selection
	this.drawSelection = function(is_onmouse)
	{
		var top_x = this.position.x - game.viewport_x + 0.5, top_y = this.position.y - game.viewport_y + 0.5;
		var sel_width = this.width, health_width = parseInt(sel_width*0.63);
			
		game.viewport_ctx.strokeStyle = '#ffffff';
		game.viewport_ctx.lineWidth = 1;
		
		game.viewport_ctx.beginPath();
		game.viewport_ctx.moveTo(top_x, top_y + 8);
		game.viewport_ctx.lineTo(top_x, top_y);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y + 8);
		game.viewport_ctx.moveTo(top_x + sel_width, top_y + sel_width - 8);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y + sel_width);
		game.viewport_ctx.lineTo(top_x, top_y + sel_width);
		game.viewport_ctx.lineTo(top_x, top_y + sel_width - 8);
		game.viewport_ctx.stroke();

		//Health
		//health_width += (health_width%2) ? 1 : 0; //Must devide by 2 
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x + parseInt(sel_width - health_width)/2, top_y-1, health_width, 4);

		if (this.health < this.health_max)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + (sel_width - health_width)/2 + 1, top_y, health_width - 2, 2);
		}

		var health_proc = this.health / this.health_max;
		if (health_proc > 0.66)
			game.viewport_ctx.fillStyle = '#51FA00';
		else if (health_proc > 0.33)
			game.viewport_ctx.fillStyle = '#FCFC00';
		else
			game.viewport_ctx.fillStyle = '#FC0000';
		game.viewport_ctx.fillRect(top_x + (sel_width - health_width)/2 + 1, top_y, (health_width - 2)*health_proc, 2);
		
		//Draw name
		if (is_onmouse)
			game.fontDraw.drawOnCanvas(TestUnit.obj_name, game.viewport_ctx, top_x, top_y - 16, 'yellow', 'center', sel_width);
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
	
	this._moveToNextCell = function()
	{
		var curr_pos = this.getCell();

		//Check if next cell is not empty. If not empty then 
		if (game.level.map_cells[this.move_path[0].x][this.move_path[0].y].unit != -1)
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

		//Move user to next cell
		game.level.map_cells[this.move_path[0].x][this.move_path[0].y].unit = this.uid;

		//Remove from current
		game.level.map_cells[curr_pos.x][curr_pos.y].unit = -1;
	}
	
	this.canBeSelected = function()
	{
		return true;
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
		var i = Math.floor((Math.random()*3)+1);
		game.resources.get('test_'+type+i).play();
	}
}

TestUnit.prototype = {
	width: 35,
	height: 35,
	health_max: 100
};

TestUnit.box_image = 'test_unit_box.png';
TestUnit.obj_name = 'Construction Rig';
TestUnit.cost = 150;
TestUnit.enabled = false;
TestUnit.require_building = [HeadquarterBuilding];
TestUnit.loadResources = function() {
	game.resources.addImage('test_unit_stand.png', 'images/units/test_unit_stand.png');
	game.resources.addImage('test_unit_move.png', 'images/units/test_unit_move.png');
	game.resources.addSound('test_move1', 'sounds/units/test/move1.ogg');
	game.resources.addSound('test_move2', 'sounds/units/test/move2.ogg');
	game.resources.addSound('test_move3', 'sounds/units/test/move3.ogg');
	game.resources.addSound('test_select1', 'sounds/units/test/select1.ogg');
	game.resources.addSound('test_select2', 'sounds/units/test/select2.ogg');
	game.resources.addSound('test_select3', 'sounds/units/test/select3.ogg');
	game.resources.addSound('cant_build', 'sounds/cant_build.ogg');
}