function Bulet(config_name)
{
	var config, position_now, position_to, position_to_cells, move_steps, animation_id;
	
	this.uid = -1;
	this.is_effect = true;
	
	this.init = function(from, to)
	{
		var len, parts;
		
		config = WeaponConfig[config_name];
		
		//Set positions & steps
		position_now = {x: from.x, y: from.y};
		position_to = {x: to.x, y: to.y};
		position_to_cells = MapCell.pixelToCell(to);
		len = MapCell.getPixelDistance(from.x, from.y, to.x, to.y);
		parts = (len / config.bulet_speed) * RUNS_PER_SECOND;
		move_steps = {
			x: (position_to.x - position_now.x) / parts,
			y: (position_to.y - position_now.y) / parts
		};
		
		//Play shoot sound
		if (config.fire_sound)
			game.resources.playOnPosition(config.fire_sound, true, position_now, true);
		
		//Create animation
		//Calc angle: There is an image for each 15 degrees. Images are from 0 to 23
		//0 = W, 6 = S, 12 = E, 18 = N
		animation_id = SimpleEffect.quickCreate(config.bulet_animation, {
			looped: true,
			direction: Math.calcFrameByAngle(Math.getAngle(to.y - from.y, to.x - from.x), 24),
			pos: position_now
		});
	};
	
	this.run = function()
	{
		position_now.x += move_steps.x;
		position_now.y += move_steps.y;
		
		game.objects[animation_id].setPosition(position_now);
			
		//Check if on place and should blast
		if (((move_steps.x<0 && position_now.x<position_to.x) || 
			(move_steps.x>=0 && position_now.x>=position_to.x)) &&
			((move_steps.y<0 && position_now.y<position_to.y) || 
			(move_steps.y>=0 && position_now.y>=position_to.y)))
		{
			this.onImpact(position_to_cells.x, position_to_cells.y);

			//Draw blast animation
			Animator.quickAnimation(config.hit_explosion, cloneObj(position_to));
			
			//Delete bulet animation
			game.deleteEffect(animation_id);
			
			//Kill itself
			game.kill_objects.push(this.uid);
		}
	};
	
	this.onImpact = function(x, y) 
	{
		var dmg, i, ids = MapCell.getAllUserIds(game.level.map_cells[x][y]);
		
		//Play hit sound
		if (config.hit_sound)
			game.resources.playOnPosition(config.hit_sound, true, position_now, true);
		
		for (i = 0; i<ids.length; ++i)
		{
			dmg = game.damageTable.calcDamage(
				game.objects[ids[i]]._proto.shield_type, 
				config.offence.type, 
				config.offence.strength
			);
			if (dmg > 0)
				game.objects[ids[i]].applyDamage(dmg);
		}
	};
	
	//Unused functions
	this.onObjectDeletion = function() {};
}