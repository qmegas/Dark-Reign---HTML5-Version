function AbstractUnit(pos_x, pos_y)
{
	this.uid = -1;
	
	this._proto = {};
	
	this.health = 100;
	this.is_selected = false;
	this.is_fly = false;
	this.is_building = false;
	this.position = {};
	
	this.state = 'STAND';
	
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
		if (this.state == 'MOVE' || this.state == 'BUILD')
		{
			this.state = 'MOVE';
			this.move_path = this.move_path.slice(0, 1);
		}
	}
	
	//Draw Selection
	this.drawSelection = function(is_onmouse)
	{
		var top_x = this.position.x - game.viewport_x + 0.5, top_y = this.position.y - game.viewport_y + 0.5;
		var sel_width = this._proto.imgage_size.width, health_width = parseInt(sel_width*0.63);
			
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

		if (this.health < this._proto.health_max)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + (sel_width - health_width)/2 + 1, top_y, health_width - 2, 2);
		}

		var health_proc = this.health / this._proto.health_max;
		if (health_proc > 0.66)
			game.viewport_ctx.fillStyle = '#51FA00';
		else if (health_proc > 0.33)
			game.viewport_ctx.fillStyle = '#FCFC00';
		else
			game.viewport_ctx.fillStyle = '#FC0000';
		game.viewport_ctx.fillRect(top_x + (sel_width - health_width)/2 + 1, top_y, (health_width - 2)*health_proc, 2);
		
		//Draw name
		if (is_onmouse)
			game.fontDraw.drawOnCanvas(this._proto.obj_name, game.viewport_ctx, top_x, top_y - 16, 'yellow', 'center', sel_width);
	}
	
	this._moveToNextCell = function()
	{
		var curr_pos = this.getCell();

		//Check if next cell is not empty. If not empty then 
		if (MapCell.getSingleUserId(game.level.map_cells[this.move_path[0].x][this.move_path[0].y]) != -1)
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
}

AbstractUnit.createNew = function(obj, x, y)
{
	var uid = game.objects.length;
	game.objects.push(new obj(x, y));
	game.objects[uid].uid = uid;
	game.objects[uid].markCellsOnMap(uid);
	game.notifications.addSound('unit_completed');
	
	return game.objects[uid];
};