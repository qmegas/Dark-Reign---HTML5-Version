function AbstractBuilding()
{
	this.uid = -1;
	this.health = 0;
	this.construction_now = 0;
	this._proto = {};
	this.state = 'CONSTRUCTION';
	this.health_max = 750;
	this.cost = 100;
	this.construction_max = 750;
	
	this.is_building = true;
	this.is_selected = false;
	
	this.position = {x: 0, y: 0};
	
	this.setPosition = function(pos_x, pos_y)
	{
		this.position = {
			x: (pos_x - this._proto.cell_padding.x)*CELL_SIZE, 
			y: (pos_y - this._proto.cell_padding.y)*CELL_SIZE
		};
	}
	
	this.getCell = function()
	{
		return {x: Math.floor(this.position.x/CELL_SIZE), y: Math.floor(this.position.y/CELL_SIZE)};
	}
	
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
	}
	
	this._drawSelectionStandart = function(is_onmouse)
	{
		var top_x = this.position.x - game.viewport_x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y + 10  - game.viewport_y;
			
		game.viewport_ctx.strokeStyle = (this.is_selected) ? '#ffffff' : '#393939';
		game.viewport_ctx.lineWidth = 1;
		
		game.viewport_ctx.beginPath();
		game.viewport_ctx.moveTo(top_x - 3, top_y - 8);
		game.viewport_ctx.lineTo(top_x, top_y + 0.5);
		game.viewport_ctx.lineTo(top_x + CELL_SIZE*this._proto.cell_size.x, top_y + 0.5);
		game.viewport_ctx.lineTo(top_x + CELL_SIZE*this._proto.cell_size.x + 3, top_y - 8);
		game.viewport_ctx.stroke();
		
		//Health
		var health_width = parseInt(CELL_SIZE*this._proto.cell_size.x*0.66);
		top_x += health_width/4;
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y-2, health_width, 4);
		
		if (this.health < this.health_max)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y - 1, health_width - 2, 2);
		}

		var health_proc = this.health / this.health_max;
		if (health_proc > 0.66)
			game.viewport_ctx.fillStyle = '#51FA00';
		else if (health_proc > 0.33)
			game.viewport_ctx.fillStyle = '#FCFC00';
		else
			game.viewport_ctx.fillStyle = '#FC0000';
		game.viewport_ctx.fillRect(top_x + 1, top_y - 1, (health_width - 2)*health_proc, 2);
		
		//Construction progress
		if (this.state == 'CONSTRUCTION')
		{
			var const_proc = this.construction_now / this.construction_max;
			top_y = this.position.y - this._proto.image_padding.y - game.viewport_y;
			
			game.viewport_ctx.fillStyle = '#000000';
			game.viewport_ctx.fillRect(top_x, top_y-2, health_width, 4);
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y - 1, health_width - 2, 2);
			game.viewport_ctx.fillStyle = '#FCFC00';
			game.viewport_ctx.fillRect(top_x + 1, top_y - 1, (health_width - 2)*const_proc, 2);
		}
		
		//Draw name
		top_y = this.position.y - this._proto.image_padding.y - 16.5 - game.viewport_y;
		top_x = this.position.x - 0.5 + health_width/4 - game.viewport_x;
		if (this.state == 'CONSTRUCTION')
		{
			game.fontDraw.drawOnCanvas(
				'Under Construction', game.viewport_ctx, top_x, top_y, 
				'yellow', 'center', health_width
			);
			top_y -= 15;
		}
		
		if (is_onmouse)
			game.fontDraw.drawOnCanvas(
				this._proto.obj_name, game.viewport_ctx, top_x, top_y, 
				'yellow', 'center', health_width
			);
	}
	
	this.canBeSelected = function()
	{
		return true;
	}
	
	this.select = function(is_select, play_sound)
	{
		this.is_selected = is_select;
	}
	
	this.markCellsOnMap = function(userid)
	{
		var i = -1, x, y, cell = this.getCell(), cell_type = (userid==-1) ? CELL_TYPE_EMPTY : CELL_TYPE_BUILDING;
		for (x=0; x<this._proto.cell_size.x; ++x)
			for (y=0; y<this._proto.cell_size.y; ++y)
			{
				++i;
				if (this._proto.cell_matrix[i] == 0)
					continue;
				
				game.level.map_cells[cell.x+x][cell.y+y].unit = userid;
				game.level.map_cells[cell.x+x][cell.y+y].type = cell_type;
			}
	}
	
	//Must be implemented
	this.run = function() {}
	
	this.draw = function(cur_time)
	{
		if (this.state == 'CONSTRUCTION')
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
				src_x: this._proto.image_size.x,
				src_y: this._proto.image_size.y,
				src_width: this._proto.image_size.x,
				src_height: this._proto.image_size.y,
				x: this.position.x - this._proto.image_padding.x - game.viewport_x,
				y: this.position.y - this._proto.image_padding.y - game.viewport_y
			});
		}
	}
	
	this._runStandartConstruction = function()
	{
		this.construction_now++;
		this.health++;
		if (this.construction_now > this.construction_max)
		{
			this._proto.count++;

			var sound = game.resources.get('construction_complete');

			sound.play();
			if (game.constructor.recalcUnitAvailability())
				sound.addEventListener('ended', function(){
					game.resources.get('new_units_available').play();
					this.removeEventListener('ended', arguments.callee, false);
				});

			game.energy.addToCurrent(this._proto.energy);
			this.state = 'NORMAL';
			
			this.onConstructed();
		}
	}
	
	//Event functions
	
	this.onConstructed = function() {}
}

//Static methods
AbstractBuilding.drawBuildMouse = function(obj, x, y)
{
	var i = -1;
	
	x -= obj.cell_padding.x;
	y -= obj.cell_padding.y;
	
	game.viewport_ctx.drawImage(
		game.resources.get(obj.res_key), 0, obj.image_size.y, 
		obj.image_size.x, obj.image_size.y, 
		x*CELL_SIZE - game.viewport_x - obj.image_padding.x, 
		y*CELL_SIZE - game.viewport_y - obj.image_padding.y, 
		obj.image_size.x, obj.image_size.y
	);
	game.viewport_ctx.drawImage(
		game.resources.get(obj.res_key), obj.image_size.x, obj.image_size.y, 
		obj.image_size.x, obj.image_size.y, 
		x*CELL_SIZE - game.viewport_x - obj.image_padding.x, 
		y*CELL_SIZE - game.viewport_y - obj.image_padding.y, 
		obj.image_size.x, obj.image_size.y
	);
		
	for (var xx = 0; xx<obj.cell_size.x; ++xx)
	{
		var xxx = xx+x;
		if (xxx<0 || xxx>game.level.size.x-1)
			continue;
		
		for (var yy = 0; yy<obj.cell_size.y; ++yy)
		{
			++i;
			if (obj.cell_matrix[i] == 0)
				continue;
			
			var yyy = yy+y;
			if (yyy<0 || yyy>game.level.size.y-1)
				continue;
			
			var cell = game.level.map_cells[xxx][yyy];
			if (cell.type!=0 || (cell.unit!=-1 && cell.unit!=game.action_state_options.requested_unit))
			{
				game.viewport_ctx.drawImage(
					game.resources.get('clr'), 0, 0, CELL_SIZE, CELL_SIZE, 
					xxx*CELL_SIZE - game.viewport_x, yyy*CELL_SIZE - game.viewport_y, CELL_SIZE, CELL_SIZE
				);
			}
		}
	}
};

AbstractBuilding.createNew = function(obj, x, y)
{
	var uid = game.objects.length;
	game.objects.push(new obj(x, y));
	game.objects[uid].uid = uid;
	game.objects[uid].markCellsOnMap(uid);
	
	game.money.decMoney(obj.cost);
	
	game.resources.get('construction_under_way').play();
};

AbstractBuilding.canBuild = function(obj, x, y, unit)
{
	var i = -1;
	
	x -= obj.cell_padding.x;
	y -= obj.cell_padding.y;
	
	for (var xx = 0; xx<obj.cell_size.x; ++xx)
	{
		var xxx = xx+x;
		if (xxx<0 || xxx>game.level.size.x-1)
			return false;
		
		for (var yy = 0; yy<obj.cell_size.y; ++yy)
		{
			++i;
			if (obj.cell_matrix[i] == 0)
				continue;
			
			var yyy = yy+y;
			if (yyy<0 || yyy>game.level.size.y-1)
				return false;
			
			var cell = game.level.map_cells[xxx][yyy];
			if (cell.type!=0 || (cell.unit!=-1 && cell.unit!=unit))
				return false;
		}
	}
	
	return true;
};