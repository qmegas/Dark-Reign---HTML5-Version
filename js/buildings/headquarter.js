function HeadquarterBuilding(pos_x, pos_y)
{
	this.uid = -1;
	this.health = 0;
	this.construction_now = 0;
	
	this.is_building = true;
	this.is_selected = false;
	
	this.position = {
		x: (pos_x - HeadquarterBuilding.cell_padding.x)*CELL_SIZE, 
		y: (pos_y - HeadquarterBuilding.cell_padding.y)*CELL_SIZE
	};
	
	this.state = 'CONSTRUCTION';
	
	//Parental function
	this.getCell = function()
	{
		return {x: Math.floor(this.position.x/CELL_SIZE), y: Math.floor(this.position.y/CELL_SIZE)};
	}
	
	this.run = function()
	{
		if (this.state == 'CONSTRUCTION')
		{
			this.construction_now++;
			this.health++;
			if (this.construction_now > this.construction_max)
			{
				game.resources.get('construction_complete').play();
				this.state = 'NORMAL';
			}
		}
	}
	
	this.drawSelection = function()
	{
		var top_x = this.position.x - 0.5,
			top_y = this.position.y + CELL_SIZE*HeadquarterBuilding.cell_size.y + 10.5;
			
		game.viewport_ctx.strokeStyle = (this.is_selected) ? '#ffffff' : '#393939';
		game.viewport_ctx.lineWidth = 1;
		
		game.viewport_ctx.beginPath();
		game.viewport_ctx.moveTo(top_x - 3, top_y - 8);
		game.viewport_ctx.lineTo(top_x, top_y);
		game.viewport_ctx.lineTo(top_x + CELL_SIZE*HeadquarterBuilding.cell_size.x, top_y);
		game.viewport_ctx.lineTo(top_x + CELL_SIZE*HeadquarterBuilding.cell_size.x + 3, top_y - 8);
		game.viewport_ctx.stroke();
		
		//Health
		var health_width = parseInt(CELL_SIZE*HeadquarterBuilding.cell_size.x*0.66);
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
	
	this.draw = function()
	{
		if (this.state == 'CONSTRUCTION')
		{
			game.viewport_ctx.drawImage(
				game.resources.get('headquarter.png'), HeadquarterBuilding.image_size.x, 0, 
				HeadquarterBuilding.image_size.x, HeadquarterBuilding.image_size.y, 
				this.position.x - HeadquarterBuilding.image_padding.x - game.viewport_x, 
				this.position.y - HeadquarterBuilding.image_padding.y - game.viewport_y, 
				HeadquarterBuilding.image_size.x, HeadquarterBuilding.image_size.y
			);
		}
		else
		{
			game.viewport_ctx.drawImage(
				game.resources.get('headquarter.png'), 0, 0, 
				HeadquarterBuilding.image_size.x, HeadquarterBuilding.image_size.y, 
				this.position.x - HeadquarterBuilding.image_padding.x - game.viewport_x, 
				this.position.y - HeadquarterBuilding.image_padding.y - game.viewport_y, 
				HeadquarterBuilding.image_size.x, HeadquarterBuilding.image_size.y
			);
		}
	}
	
	this.markCellsOnMap = function(userid)
	{
		var x, y, cell = this.getCell(), cell_type = (userid==-1) ? CELL_TYPE_EMPTY : CELL_TYPE_BUILDING;
		for (x=0; x<HeadquarterBuilding.cell_size.x; ++x)
			for (y=0; y<HeadquarterBuilding.cell_size.y; ++y)
			{
				game.level.map_cells[cell.x+x][cell.y+y].unit = userid;
				game.level.map_cells[cell.x+x][cell.y+y].type = cell_type;
			}
	}
}

HeadquarterBuilding.prototype = {
	build_count: 0,
	health_max: 750,
	cost: 100,
	construction_max: 750
}

HeadquarterBuilding.box_image = 'headquarter_box.png';
HeadquarterBuilding.enabled = true;
HeadquarterBuilding.cell_size = {x: 5, y: 4};
HeadquarterBuilding.cell_padding = {x: 2, y: 2};
HeadquarterBuilding.image_size = {x: 103, y: 138};
HeadquarterBuilding.image_padding = {x: -9, y: 42};

HeadquarterBuilding.loadResources = function(){
	game.resources.addImage('headquarter.png', 'images/buildings/headquarter.png');
};

HeadquarterBuilding.drawBuildMouse = function(x, y){
	x -= HeadquarterBuilding.cell_padding.x;
	y -= HeadquarterBuilding.cell_padding.y;
	
	game.viewport_ctx.drawImage(
		game.resources.get('headquarter.png'), 0, 0, 
		HeadquarterBuilding.image_size.x, HeadquarterBuilding.image_size.y, 
		x*CELL_SIZE - game.viewport_x - HeadquarterBuilding.image_padding.x, 
		y*CELL_SIZE - game.viewport_y - HeadquarterBuilding.image_padding.y, 
		HeadquarterBuilding.image_size.x, HeadquarterBuilding.image_size.y
	);
		
	for (var xx = 0; xx<HeadquarterBuilding.cell_size.x; ++xx)
	{
		var xxx = xx+x;
		if (xxx<0 || xxx>game.level.size.x-1)
			continue;
		
		for (var yy = 0; yy<HeadquarterBuilding.cell_size.y; ++yy)
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

HeadquarterBuilding.createNew = function(x, y)
{
	var uid = game.objects.length;
	game.objects.push(new HeadquarterBuilding(x, y));
	game.objects[uid].uid = uid;
	game.objects[uid].markCellsOnMap(uid);
	
	game.resources.get('construction_under_way').play();
}

//Should be function in parent class
HeadquarterBuilding.canBuild = function(x, y, unit)
{
	x -= HeadquarterBuilding.cell_padding.x;
	y -= HeadquarterBuilding.cell_padding.y;
	
	for (var xx = 0; xx<HeadquarterBuilding.cell_size.x; ++xx)
	{
		var xxx = xx+x;
		if (xxx<0 || xxx>game.level.size.x-1)
			return false;
		
		for (var yy = 0; yy<HeadquarterBuilding.cell_size.y; ++yy)
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