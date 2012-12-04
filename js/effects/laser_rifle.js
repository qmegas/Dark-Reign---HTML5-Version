function LaserRifleEffect(from_x, from_y, to_x, to_y)
{
	this._proto = LaserRifleEffect;
	
	this.init(from_x, from_y, to_x, to_y);
	
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
				this.onImpact();
				
				this.state = 'BLAST';
				this._position_now = this._position_to;
				this._start_animation = (new Date).getTime();
				this._end_animation = this._start_animation + ANIMATION_SPEED*this._proto.blast_image_frames;
				
				if (this._proto.have_blast_sound) 
				{
					var volume = this._checkSoundVolume();
					if (volume > 0)
					{
						var sound = game.resources.get(this._proto.resource_key + '_blast_snd');
						sound.volume = volume;
						sound.play();
					}
				}
			}
		}
		else if (this.state == 'BLAST')
		{
			if ((new Date).getTime() > this._end_animation)
				game.deleteEffect(this.uid);
		}
	}
	
	//Draw effect
	this.draw = function(current_time)
	{
		if (!this._checkOnScreen())
			return;
		
		var top_x = parseInt(this._position_now.x - game.viewport_x), top_y = parseInt(this._position_now.y - game.viewport_y);
		
		if (this.state == 'BULLET')
		{
			top_x -= this._proto.bulet_image_padding.x;
			top_y -= this._proto.bulet_image_padding.y;
			
			var diff = (parseInt((current_time - this._start_animation) / ANIMATION_SPEED) % 3);
			game.objDraw.addElement(DRAW_LAYER_EFFECTS, this._position_now.x, {
				res_key: this._proto.resource_key + '_bulet',
				src_x: this._angle_frame * this._proto.bulet_image_size.width,
				src_y: diff * this._proto.bulet_image_size.height,
				src_width: this._proto.bulet_image_size.width,
				src_height: this._proto.bulet_image_size.height,
				x: top_x,
				y: top_y
			});
		}
		
		if (this.state == 'BLAST')
		{
			var frame = parseInt((current_time - this._start_animation) / ANIMATION_SPEED);
			
			if (frame >= this._proto.blast_image_frames)
				return;
			
			top_x -= this._proto.blast_image_padding.x;
			top_y -= this._proto.blast_image_padding.y;
			
			game.objDraw.addElement(DRAW_LAYER_EFFECTS, this._position_now.x, {
				res_key: this._proto.resource_key + '_blast',
				src_x: 0,
				src_y: frame * this._proto.blast_image_size.height,
				src_width: this._proto.blast_image_size.width,
				src_height: this._proto.blast_image_size.height,
				x: top_x,
				y: top_y
			});
			
		}
	}
}

LaserRifleEffect.prototype = new AbstractWeaponEffect();

LaserRifleEffect.resource_key = 'laser_rifle';

LaserRifleEffect.bulet_image_size = {width: 8, height: 8};
LaserRifleEffect.bulet_image_padding = {x: 4, y: 4};

LaserRifleEffect.blast_image_size = {width: 22, height: 25};
LaserRifleEffect.blast_image_frames = 13;
LaserRifleEffect.blast_image_padding = {x: 6, y: 18};

LaserRifleEffect.have_blast_sound = false;

LaserRifleEffect.speed = 1000; //Temp - Pixels per second

LaserRifleEffect.loadResources = function()
{
	game.resources.addImage(this.resource_key + '_bulet', 'images/effects/' + this.resource_key + '/bulet.png');
	game.resources.addImage(this.resource_key + '_blast', 'images/effects/' + this.resource_key + '/blast.png');
	
	game.resources.addSound(this.resource_key + '_shoot_snd', 'sounds/weapons/' + this.resource_key + '/shoot.' + AUDIO_TYPE);
	if (this.have_blast_sound)
		game.resources.addSound(this.resource_key + '_blast_snd', 'sounds/weapons/' + this.resource_key + '/blast.' + AUDIO_TYPE);
}