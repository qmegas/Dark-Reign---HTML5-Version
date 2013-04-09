/**
 * info:
 *  - size: {x, y}
 *  - hotpoint: {x, y}
 *  - frames: int
 *  - looped: boolean
 *  - res_key: string
 *  - delay: int
 */
function SimpleEffect(info)
{
	var frame_speed = 100, position = null;
	
	this.uid = -1;
	this.is_effect = true;
	this.info = info;
	
	this._start_animation = (new Date).getTime();
	this._stop_animation = this._start_animation + (this.info.frames + this.info.delay) * frame_speed;
	
	this.setPosition = function(pos)
	{
		position = {
			x: pos.x - this.info.hotpoint.x,
			y: pos.y - this.info.hotpoint.y
		};
	};
	
	this.run = function()
	{
		if (!this.info.looped)
		{
			if ((new Date).getTime() > this._stop_animation)
			{
				game.deleteEffect(this.uid);
				this.onObjectDeletion();
			}
		}
	};
	
	this.draw = function(current_time)
	{
		var diff = parseInt((current_time - this._start_animation) / frame_speed) - this.info.delay;
		
		if (diff < 0)
			return;
		
		if (!this._checkOnScreen())
			return;
		
		if (!this.info.looped && (diff >= this.info.frames))
			return;
		
		diff %= this.info.frames;
			
		game.objDraw.addElement(DRAW_LAYER_EFFECTS, position.x, {
			res_key: this.info.res_key,
			src_x: 0,
			src_y: diff * this.info.size.y,
			src_width: this.info.size.x,
			src_height: this.info.size.y,
			x: parseInt(position.x - game.viewport_x),
			y: parseInt(position.y - game.viewport_y)
		});
	};
	
	this._checkOnScreen = function()
	{
		if ((game.viewport_x > (position.x + this.info.size.x)) || 
			(game.viewport_y > (position.y + this.info.size.y)) ||
			((game.viewport_x + VIEWPORT_SIZE) < position.x) ||
			((game.viewport_y + VIEWPORT_SIZE) < position.y))
			return false;
		
		return true;
	};
	
	this.onObjectDeletion = function() {};
}