function FreighterUnit(pos_x, pos_y, player)
{
	this._proto = FreighterUnit;
	this.player = player;
	this.move_direction = 3;
	this.health = 15;
	
	this._res_now = 0;
	this._res_max = 50;
	this._res_type = 'water'; //water, taelon
	
	this.init(pos_x, pos_y);
	
	this.draw = function(current_time) 
	{
		var top_x = this.position.x - game.viewport_x - this._proto.image_padding.x, 
			top_y = this.position.y - game.viewport_y - this._proto.image_padding.y;
		
		switch (this.state)
		{
			case 'STAND':
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: this._proto.resource_key + '_move',
					src_x: this.move_direction * this._proto.image_size.width,
					src_y: 0,
					src_width: this._proto.image_size.width,
					src_height: this._proto.image_size.height,
					x: top_x,
					y: top_y
				});
				break;
			
			case 'MOVE':
				var diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % 3);
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
	
	this.drawSelection = function(is_onmouse)
	{
		this._drawStandardSelection(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x - 1 - this._proto.image_padding.x, 
			top_y = this.position.y - game.viewport_y + 5 - this._proto.image_padding.y,
			bar_size = parseInt((this._res_now/this._res_max)*28);
			
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 30);
		
		if (this._res_now < this._res_max)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 28);
		}
		
		game.viewport_ctx.fillStyle = (this._res_type == 'water') ? '#00a5ff' : '#ffff00';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 29 - bar_size, 2, bar_size);
	}
}

AbstractUnit.setUnitCommonOptions(FreighterUnit);

FreighterUnit.obj_name = 'Freighter';
FreighterUnit.resource_key = 'freighter';
FreighterUnit.image_size = {width: 40, height: 40};
FreighterUnit.image_padding = {x: 8, y: 8};

FreighterUnit.cost = 1000;
FreighterUnit.health_max = 15;
FreighterUnit.speed = 1.5;

FreighterUnit.require_building = [AssemblyPlantBuilding];

FreighterUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
FreighterUnit.construction_time = 4;

FreighterUnit.loadResources = function() 
{
	game.resources.addImage(this.resource_key + '_move',  'images/units/' + this.resource_key + '/move.png');
	game.resources.addImage(this.resource_key + '_load', 'images/units/' + this.resource_key + '/load.png');
	
	for (var i=1; i<=this.sound_count; ++i)
	{
		game.resources.addSound(this.resource_key + '_move' + i,   'sounds/units/' + this.resource_key + '/move' + i + '.' + AUDIO_TYPE);
		game.resources.addSound(this.resource_key + '_select' + i, 'sounds/units/' + this.resource_key + '/select' + i + '.' + AUDIO_TYPE);
	}
}