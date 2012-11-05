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
	
	this.drawSelection = function()
	{
		var top_x = this.position.x - 0.5,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y + 10.5;
			
		game.viewport_ctx.strokeStyle = (this.is_selected) ? '#ffffff' : '#393939';
		game.viewport_ctx.lineWidth = 1;
		
		game.viewport_ctx.beginPath();
		game.viewport_ctx.moveTo(top_x - 3, top_y - 8);
		game.viewport_ctx.lineTo(top_x, top_y);
		game.viewport_ctx.lineTo(top_x + CELL_SIZE*this._proto.cell_size.x, top_y);
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
			top_y = this.position.y - CELL_SIZE - 0.5;
			
			game.viewport_ctx.fillStyle = '#000000';
			game.viewport_ctx.fillRect(top_x, top_y-2, health_width, 4);
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y - 1, health_width - 2, 2);
			game.viewport_ctx.fillStyle = '#FCFC00';
			game.viewport_ctx.fillRect(top_x + 1, top_y - 1, (health_width - 2)*const_proc, 2);
		}
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
		var x, y, cell = this.getCell(), cell_type = (userid==-1) ? CELL_TYPE_EMPTY : CELL_TYPE_BUILDING;
		for (x=0; x<this._proto.cell_size.x; ++x)
			for (y=0; y<this._proto.cell_size.y; ++y)
			{
				game.level.map_cells[cell.x+x][cell.y+y].unit = userid;
				game.level.map_cells[cell.x+x][cell.y+y].type = cell_type;
			}
	}
	
	//Must be implemented
	this.run = function() {}
	
	this.draw = function()
	{
		if (this.state == 'CONSTRUCTION')
		{
			game.viewport_ctx.drawImage(
				game.resources.get(this._proto.res_key), this._proto.image_size.x, 0, 
				this._proto.image_size.x, this._proto.image_size.y, 
				this.position.x - this._proto.image_padding.x - game.viewport_x, 
				this.position.y - this._proto.image_padding.y - game.viewport_y, 
				this._proto.image_size.x, this._proto.image_size.y
			);
		}
		else
		{
			game.viewport_ctx.drawImage(
				game.resources.get(this._proto.res_key), 0, 0, 
				this._proto.image_size.x, this._proto.image_size.y, 
				this.position.x - this._proto.image_padding.x - game.viewport_x, 
				this.position.y - this._proto.image_padding.y - game.viewport_y, 
				this._proto.image_size.x, this._proto.image_size.y
			);
		}
	}
}

//Static methods
AbstractBuilding.drawBuildMouse = function(obj, x, y){
	x -= obj.cell_padding.x;
	y -= obj.cell_padding.y;
	
	game.viewport_ctx.drawImage(
		game.resources.get(obj.res_key), 0, 0, 
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
	
	game.resources.get('construction_under_way').play();
};

AbstractBuilding.canBuild = function(obj, x, y, unit)
{
	x -= obj.cell_padding.x;
	y -= obj.cell_padding.y;
	
	for (var xx = 0; xx<obj.cell_size.x; ++xx)
	{
		var xxx = xx+x;
		if (xxx<0 || xxx>game.level.size.x-1)
			return false;
		
		for (var yy = 0; yy<obj.cell_size.y; ++yy)
		{
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