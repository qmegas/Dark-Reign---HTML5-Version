var TacticalAI = {
	handleUnitEvent: function(unit, event, params)
	{
		switch (event)
		{
			case 'attacked':
				this._underAttack(unit, params);
				break;
				
			case 'no_ammo':
				unit.state = UNIT_STATE_STAND;
				break;
				
			case 'standing_too_close':
				var target_pos = MapCell.pixelToCell(unit.parts[params.part].weapon.getTargetPosition()),
					angle = Math.atan2(unit.position_cell.y - target_pos.y, unit.position_cell.x - target_pos.x),
					x = target_pos.x + Math.ceil(Math.cos(angle) * unit.parts[params.part].weapon.getMinRange() * 1.1),
					y = target_pos.y + Math.ceil(Math.sin(angle) * unit.parts[params.part].weapon.getMinRange() * 1.1);
				
				if (!MapCell.isCorrectCord(x, y))
					unit.orderWait(500);
				else
					unit._move(x, y);
				break;
				
			case 'standing_too_far':
				var pos = MapCell.pixelToCell(unit.parts[params.part].weapon.getTargetPosition());
				pos = PathFinder.findNearestEmptyCell(pos.x, pos.y, unit._proto.move_mode);
				if (pos !== null)
					unit._move(pos.x, pos.y);
				else
					unit.state = UNIT_STATE_STAND;
				break;
				
			case 'tactic_changed':
				break;
		}
	},
		
	regularScan: function(unit)
	{
		/**
		 * Right now i implement tactical AI when unit is idle
		 * But multi-part units may attack even when moving.
		 * That should be implemented later
		 */
		if (unit.state != UNIT_STATE_STAND)
			return;
		
		if (this._noAmmo(unit))
			return;
		
		if (this._flyUnderBuilding(unit))
			return;
		
		if (this._goFixing(unit))
			return;
		
		if (this._findEnemy(unit))
			return;
		
		if (this._haveOrder(unit))
			return;
	},
		
	_haveOrder: function(unit)
	{
		if (unit.tactic.order == TACTIC_ORDER_DEFAULT)
			return false;
		
		var try_cnt = 5, new_x, new_y;
		
		while (try_cnt)
		{
			--try_cnt;
			
			new_x = parseInt(Math.random() * (CurrentLevel.size.x - 1));
			new_y = parseInt(Math.random() * (CurrentLevel.size.y - 1));
			
			if (!MapCell.canStepInto(new_x, new_y, unit._proto.move_mode))
				continue;
			
			unit.orderMove(new_x, new_y);
			
			if (unit.move_path.length == 0)
				continue;
			
			break;
		}
		return true;
	},
	_goFixing: function(unit)
	{
		if (unit.tactic.tolerance == TACTIC_HIGH)
			return false;
		
		if (unit.health >= unit._proto.health_max)
			return false;
		
		if (((unit.tactic.tolerance == TACTIC_MED) && (unit.health < unit._proto.health_max*0.33)) || 
			(unit.tactic.tolerance == TACTIC_LOW) && (unit.health < unit._proto.health_max*0.66))
		{
			var obj, pos = unit.getCell();
			if (unit._proto.is_human)
			{
				obj = game.findNearestInstance(FieldHospitalBuilding, unit.player, pos.x, pos.y);
				if (obj)
					unit.orderHeal(obj);
			}
			else
			{
				obj = game.findNearestInstance(RepairStationBuilding, unit.player, pos.x, pos.y);
				if (obj)
					unit.orderFix(obj);
			}
			
			if (obj)
				return true;
		}
		
		return false;
	},
		
	_underAttack: function(unit, params)
	{
		if (unit.is_building)
			return;
		
		if (unit.state != UNIT_STATE_STAND)
			return;
		
		if (!game.objects[params.attacker])
			return;
		
		if (unit.tactic.independance == TACTIC_LOW)
			return;
		
		var pos1 = unit.getCell(), pos2 = game.objects[params.attacker].getCell(), alpha, distance, new_x, new_y;
		
		if (unit.isCanAttackTarget({type: 'object', objid: params.attacker}))
		{
			//Run toward
			alpha = Math.atan2(pos2.x - pos1.x, pos2.y - pos1.y);
			distance = unit._proto.seeing_range / 2;
		}
		else
		{
			//Run away in oposite direction
			alpha = Math.atan2(pos2.x - pos1.x, pos2.y - pos1.y) + Math.PI;
			distance = unit._proto.seeing_range;
		}
		
		new_x = Math.round(Math.sin(alpha)*distance + pos1.x);
		new_y = Math.round(Math.cos(alpha)*distance + pos1.y);
		
		if (MapCell.isCorrectCord(new_x, new_y))
			unit.orderMove(new_x, new_y);
		
		//Or run to random cell
		if (unit.move_path.length == 0)
			this._runToRandom(unit);
		
		//Return to start position
		unit.action.return_position = cloneObj(pos1);
	},
		
	_runToRandom: function(unit)
	{
		var try_cnt = 5, pos = unit.getCell();
		
		while (try_cnt)
		{
			--try_cnt;
			
			var half_range = unit._proto.seeing_range / 2, 
				alpha = Math.random()*Math.PI*2,
				distance = Math.random()*half_range + half_range,
				new_x = Math.round(Math.sin(alpha)*distance + pos.x),
				new_y = Math.round(Math.cos(alpha)*distance + pos.y);
			
			if (!MapCell.isCorrectCord(new_x, new_y))
				continue;
			
			unit.orderMove(new_x, new_y);
			
			if (unit.move_path.length == 0)
				continue;
			
			break;
		}
	},
		
	_findEnemy: function(unit)
	{
		if (!unit._is_have_weapon)
			return false;
		
		if (unit.tactic.order == TACTIC_ORDER_SCOUT)
			return false;
		
		var pos = unit.getCell(), attack_unit = null, current_player = game.players[unit.player];
		
		rangeItterator(pos.x, pos.y, unit._proto.seeing_range, function(x, y) {
			var i, uid, users = MapCell.getAllUserIds(CurrentLevel.map_cells[x][y]);
			for (i in users)
			{
				uid = users[i];
				if (unit.uid == uid)
					continue;
				
				if (unit.player == game.objects[uid].player)
					continue;
				
				var target = {type: 'object', objid: uid};
				if (current_player.isEnemy(game.objects[uid].player) && unit.isCanAttackTarget(target))
				{
					attack_unit = target;
					return true;
				}
			}
			
			return false;
		});
		
		if (attack_unit)
		{
			unit.orderAttack(attack_unit);
			return true;
		}
		
		return false;
	},
	
	_noAmmo: function(unit)
	{
		if (unit instanceof CycloneUnit)
		{
			if (unit.parts[0].weapon.getAmmoState() == 0)
			{
				var obj = game.findNearestInstance(RearmingDeckBuilding, unit.player, unit.position_cell.x, unit.position_cell.y);
				if (obj !== null)
				{
					unit.orderRearm(obj);
					return true;
				}
			}
		}
		return false;
	},
		
	_flyUnderBuilding: function(unit)
	{
		if (unit._proto.move_mode != MOVE_MODE_FLY)
			return false;
		
		var cell = unit.getCell();
		
		if (CurrentLevel.map_cells[cell.x][cell.y].building != -1)
		{
			cell = PathFinder.findNearestEmptyCell(cell.x, cell.y);
			if (cell)
			{
				unit.orderMove(cell.x, cell.y);
				return true;
			}
		}
		
		return false;
	}
};
	