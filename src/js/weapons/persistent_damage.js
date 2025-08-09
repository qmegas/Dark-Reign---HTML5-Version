function PersistentDamage(position, config, attacker)
{
	var count = config.damage_number, delay = config.damage_delay, attacker_id = attacker;
	
	this.uid = -1;
	this.is_effect = true;
	
	this.run = function()
	{
		delay--;
		
		if (delay == 0)
		{
			count--;
			delay = config.damage_delay;
			
			DamageTable.applyOffence(position, config, MOVE_MODE_GROUND, attacker_id);
		}
		
		if (count == 0)
			game.kill_objects.push(this.uid);
	};
	
	//Unused functions
	this.onObjectDeletion = function() {};
}