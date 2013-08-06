function Bulet(config_name, layer)
{
	var config, position_now, position_to, move_steps, animation_id, attacker_id;
	
	this.uid = -1;
	this.is_effect = true;
	
	this.init = function(from, to, attacker)
	{
		var len, parts;
		
		attacker_id = attacker;
		
		config = WeaponConfig[config_name];
		
		//Set positions & steps
		position_now = cloneObj(from);
		position_to = cloneObj(to);
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
			this.onImpact();

			//Draw blast animation
			Animator.quickAnimation(config.hit_explosion, cloneObj(position_to));
			
			//Delete bulet animation
			game.deleteEffect(animation_id);
			
			//Kill itself
			game.kill_objects.push(this.uid);
		}
	};
	
	this.onImpact = function() 
	{
		//Play hit sound
		if (config.hit_sound)
			game.resources.playOnPosition(config.hit_sound, true, position_now, true);
		
		DamageTable.applyOffence(position_to, config.offence, layer, attacker_id);
		
		if (config.persistent_damage)
		{
			var uid = game.objects.length, pdamage = new PersistentDamage(position_to, config.persistent_damage, attacker_id);
			pdamage.uid = uid;
			game.objects.push(pdamage);
		}
	};
	
	//Unused functions
	this.onObjectDeletion = function() {};
}