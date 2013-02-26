function AbstractWeaponEffect()
{
	this.uid = 0;
	this.state = 'BULLET'; //BULLET,BLAST
	this.is_effect = true;
	
	this._proto = null;
	this._angle_frame = 0;
	this._position_now = null;
	this._position_to = null;
	this._move_steps = null;
	this._current_frame = 0;
	this._start_animation = 0;
	this._end_animation = 0;
	
	this.init = function(from_x, from_y, to_x, to_y)
	{
		var len, parts, sound_vol;
		
		//Set positions & steps
		this._position_now = {x: from_x*CELL_SIZE + 12, y: from_y*CELL_SIZE + 12};
		this._position_to = {x: to_x*CELL_SIZE + 12, y: to_y*CELL_SIZE + 12};
		len = MapCell.getPixelDistance(from_x, from_y, to_x, to_y);
		parts = (len / this._proto.speed) * RUNS_PER_SECOND;
		this._move_steps = {
			x: (this._position_to.x - this._position_now.x) / parts,
			y: (this._position_to.y - this._position_now.y) / parts
		};
		
		this._start_animation = (new Date).getTime();
		
		//Calc angle
		//There is an image for each 15 degrees. Images are from 0 to 23
		//0 = W, 6 = S, 12 = E, 18 = N
		this._angle_frame = 12 - parseInt(Math.atan2(from_y - to_y, from_x - to_x)*(180/Math.PI)/15);
		
		//Play shoot sound
		sound_vol = this._checkSoundVolume();
		if (sound_vol > 0)
		{
			game.resources.play(this._proto.resource_key + '_shoot_snd', sound_vol);
		}
	}
	
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
	}
	
	this._checkSoundVolume = function()
	{
		var len =  Math.sqrt(Math.pow((game.viewport_x + VIEWPORT_SIZE/2) - this._position_now.x, 2) + Math.pow((game.viewport_y + VIEWPORT_SIZE/2) - this._position_now.y, 2)),
			half_screen_size = 316;
		
		if (len < half_screen_size)
			return 1;
		
		if (len > half_screen_size*2)
			return 0;
		
		return (1 - (len-half_screen_size)/half_screen_size);
	}
	
	//Event functions
	
	this.onImpact = function() {}
	this.onObjectDeletion = function() {}
}