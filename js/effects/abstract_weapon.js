function AbstractWeaponEffect()
{
	this.uid = 0;
	this.state = 'BULLET'; //BULLET,BLAST
	this.is_effect = true;
	
	this._proto = null;
	this._angle_frame = 0;
	this._position_now = null;
	this._position_to = null;
	this._position_to_cells = null;
	this._move_steps = null;
	this._current_frame = 0;
	this._start_animation = 0;
	this._end_animation = 0;
	
	this._offence = null;
	
	this.init = function(from, to, offence)
	{
		var len, parts;
		
		//Set positions & steps
		this._offence = offence;
		this._position_now = {x: from.x, y: from.y};
		this._position_to = {x: to.x, y: to.y};
		this._position_to_cells = {x: parseInt(to.x/CELL_SIZE), y: parseInt(to.y/CELL_SIZE)};
		len = MapCell.getPixelDistance(from.x, from.y, to.x, to.y);
		parts = (len / this._proto.speed) * RUNS_PER_SECOND;
		this._move_steps = {
			x: (this._position_to.x - this._position_now.x) / parts,
			y: (this._position_to.y - this._position_now.y) / parts
		};
		
		this._start_animation = (new Date).getTime();
		
		//Calc angle
		//There is an image for each 15 degrees. Images are from 0 to 23
		//0 = W, 6 = S, 12 = E, 18 = N
		this._angle_frame = 12 - parseInt(Math.atan2(from.y - to.y, from.x - to.x)*(180/Math.PI)/15);
		
		//Play shoot sound
		game.resources.playOnPosition(this._proto.resource_key + '_shoot_snd', true, this._position_now, true);
	};
	
	this._checkOnScreen = function()
	{
		//I decided not to make exact calculation. Instead that just take some big constant value
		var big_const = 50;
		
		if ((game.viewport_x > (this._position_now.x + big_const)) || 
			(game.viewport_y > (this._position_now.y + big_const)) ||
			((game.viewport_x + VIEWPORT_SIZE) < (this._position_now.x - big_const)) ||
			((game.viewport_y + VIEWPORT_SIZE) < (this._position_now.y - big_const)))
			return false;
		
		return true;
	};
	
	this.run = function()
	{
		if (this.state == 'BULLET')
		{
			this._position_now.x += this._move_steps.x;
			this._position_now.y += this._move_steps.y;
			
			//Check if on place and should blast
			if (((this._move_steps.x<0 && this._position_now.x<this._position_to.x) || 
				(this._move_steps.x>=0 && this._position_now.x>=this._position_to.x)) &&
				((this._move_steps.y<0 && this._position_now.y<this._position_to.y) || 
				(this._move_steps.y>=0 && this._position_now.y>=this._position_to.y)))
			{
				this.onImpact(this._position_to_cells.x, this._position_to_cells.y);
				
				this.state = 'BLAST';
				this._position_now = this._position_to;
				this._start_animation = (new Date).getTime();
				this._end_animation = this._start_animation + ANIMATION_SPEED*this._proto.images.blast.frames;
				
				if (this._proto.have_blast_sound)
					game.resources.playOnPosition(this._proto.resource_key + '_blast_snd', true, this._position_now, true);
			}
		}
		else if (this.state == 'BLAST')
		{
			if ((new Date).getTime() > this._end_animation)
				game.deleteEffect(this.uid);
		}
	};
	
	//Draw effect
	this.draw = function(current_time)
	{
		if (!this._checkOnScreen())
			return;
		
		var top_x = parseInt(this._position_now.x - game.viewport_x), top_y = parseInt(this._position_now.y - game.viewport_y);
		
		if (this.state == 'BULLET')
		{
			top_x -= this._proto.images.bulet.padding.x;
			top_y -= this._proto.images.bulet.padding.y;
			
			var diff = (parseInt((current_time - this._start_animation) / ANIMATION_SPEED) % this._proto.images.bulet.frames);
			game.objDraw.addElement(DRAW_LAYER_EFFECTS, this._position_now.x, {
				res_key: this._proto.resource_key + '_bulet',
				src_x: this._angle_frame * this._proto.images.bulet.size.x,
				src_y: diff * this._proto.images.bulet.size.y,
				src_width: this._proto.images.bulet.size.x,
				src_height: this._proto.images.bulet.size.y,
				x: top_x,
				y: top_y
			});
		}
		
		if (this.state == 'BLAST')
		{
			var frame = parseInt((current_time - this._start_animation) / ANIMATION_SPEED);
			
			if (frame >= this._proto.images.blast.frames)
				return;
			
			top_x -= this._proto.images.blast.padding.x;
			top_y -= this._proto.images.blast.padding.y;
			
			game.objDraw.addElement(DRAW_LAYER_EFFECTS, this._position_now.x, {
				res_key: this._proto.resource_key + '_blast',
				src_x: 0,
				src_y: frame * this._proto.images.blast.size.y,
				src_width: this._proto.images.blast.size.x,
				src_height: this._proto.images.blast.size.y,
				x: top_x,
				y: top_y
			});
			
		}
	};
	
	//Event functions
	
	this.onImpact = function(x, y) 
	{
		var dmg, i, ids = MapCell.getAllUserIds(game.level.map_cells[x][y]);
		
		for (i = 0; i<ids.length; ++i)
		{
			dmg = game.damageTable.calcDamage(
				game.objects[ids[i]]._proto.shield_type, 
				this._offence.type, 
				this._offence.strength
			);
			if (dmg > 0)
				game.objects[ids[i]].applyDamage(dmg);
		}
	};
	
	this.onObjectDeletion = function() {};
}

AbstractWeaponEffect.loadResources = function(obj)
{
	game.resources.addImage(obj.resource_key + '_bulet', 'images/effects/' + obj.resource_key + '/bulet.png');
	game.resources.addImage(obj.resource_key + '_blast', 'images/effects/' + obj.resource_key + '/blast.png');
	
	game.resources.addSound(obj.resource_key + '_shoot_snd', 'sounds/weapons/' + obj.resource_key + '/shoot.' + AUDIO_TYPE);
	if (obj.have_blast_sound)
		game.resources.addSound(obj.resource_key + '_blast_snd', 'sounds/weapons/' + obj.resource_key + '/blast.' + AUDIO_TYPE);
};

AbstractWeaponEffect.setCommonOptions = function(obj)
{
	obj.prototype = new AbstractWeaponEffect();
	
	obj.speed = 1000; //Temp - Pixels per second
	obj.have_blast_sound = false;
	
	obj.loadResources = function()
	{
		AbstractWeaponEffect.loadResources(this);
	};
};