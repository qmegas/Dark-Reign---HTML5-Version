var DefenseAI = {
	handleUnitEvent: function(building, event, params)
	{
		switch (event)
		{
			case 'attacked':
				this._underAttack(building, params);
				break;
				
			case 'no_ammo':
				building.state = BUILDING_STATE_NORMAL;
				break;
		}
	},
		
	regularScan: function(building)
	{	
		/**
		 * Right now i implement tactical AI when building is idle
		 * But multi-part buildings may attack even when moving.
		 * That should be implemented later
		 */
		if (building.state != BUILDING_STATE_NORMAL) {
			return;
		}
		
		if (this._noAmmo(building))
			return;
		
		if (this._findEnemy(building))
			return;
	},
		
	_underAttack: function(building, params)
	{
		if (building.is_building)
			return;
		
		if (building.state != BUILDING_STATE_NORMAL)
			return;
		
		if (!game.objects[params.attacker])
			return;
	},
		
	_findEnemy: function(building)
	{
		if (!building._is_have_weapon)
			return false;
		
		var pos = building.getCell(), 
			attack_unit = null, 
			current_player = game.players[building.player];
		
		rangeItterator(pos.x, pos.y, building._proto.seeing_range, function(x, y) {
			var i, uid, 
				users = MapCell.getAllUserIds(CurrentLevel.map_cells[x][y]);
			
			for (i in users)
			{
				uid = users[i];
				if (building.uid == uid)
					continue;
				
				if (building.player == game.objects[uid].player)
					continue;
				
				var target = {type: 'object', objid: uid};
				if (current_player.isEnemy(game.objects[uid].player) && building.isCanAttackTarget(target))
				{
					attack_unit = target;
					return true;
				}
			}
			
			return false;
		});
		
		if (attack_unit)
		{
			building.orderAttack(attack_unit);
			return true;
		}
		
		return false;
	},
	
	_noAmmo: function(building)
	{
		return false;
	},
};
	