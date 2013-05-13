function PersistentDamage(position, config)
{
	var count = config.damage_number, delay = config.damage_delay;
	
	this.uid = -1;
	this.is_effect = true;
	
	this.run = function()
	{
		delay--;
		
		if (delay == 0)
		{
			count--;
			delay = config.damage_delay;
			
			DamageTable.applyOffence(position, config, MOVE_MODE_GROUND);
		}
		
		if (count == 0)
			game.kill_objects.push(this.uid);
	};
	
	//Unused functions
	this.onObjectDeletion = function() {};
}