var ActionsHeap = {
	_heap: {},
		
	add: function(object_id, type, act_info)
	{
		if (this._heap[object_id] === undefined)
			this._heap[object_id] = {};
		this._heap[object_id][type] = act_info;
	},
		
	remove: function(object_id, type)
	{
		delete this._heap[object_id][type];
	},
		
	removeAll: function(object_id)
	{
		delete this._heap[object_id];
	},
		
	run: function()
	{
		var object_id, type;
		
		for (object_id in this._heap)
		{
			if (game.objects[object_id] === undefined)
			{
				this.removeAll(object_id);
				continue;
			}
			
			for (type in this._heap[object_id])
			{
				switch (type)
				{
					case 'construct':
						this._runConstruct(object_id, type);
						break;
						
					case 'heal':
						this._runHeal(object_id, type);
						break;
						
					case 'repair':
						this._runRepair(object_id, type);
						break;

					case 'sell':
						this._runSell(object_id, type);
						break;
				}
			}
		}
	},
		
	_runRepair: function(object_id, type)
	{
		var obj = game.objects[object_id];
		
		if (obj.state == 'SELL')
		{
			obj.repair();
			return;
		}
		
		if (!game.players[obj.player].haveEnoughMoney(BUILDING_REPAIR_COST))
			return;
		
		if (obj.applyFix(BUILDING_REPAIR_SPEED) == 0)
			obj.repair();
		else
			game.players[obj.player].decMoney(BUILDING_REPAIR_COST);
	},
		
	_runHeal: function(object_id, type)
	{
		var obj = game.objects[object_id];
		
		if (obj.state != 'HEALING')
		{
			this.remove(object_id, type);
			return;
		}
		
		obj.applyHeal(HEAL_SPEED);
		
		if (obj.health >= obj._proto.health_max)
		{
			obj.onHealed();
			this.remove(object_id, type);
		}
	},
		
	_runSell: function(object_id, type)
	{
		var obj = game.objects[object_id];
		
		this._heap[object_id][type].current++;
		
		if (this._heap[object_id][type].current == this._heap[object_id][type].steps)
		{
			obj.progress_bar = 0;
			obj.onSold();
			this.remove(object_id, type);
		}
		else
			obj.progress_bar = this._heap[object_id][type].current / this._heap[object_id][type].steps;
	},
		
	_runConstruct: function(object_id, type)
	{
		var obj = game.objects[object_id];
		
		if (!game.players[obj.player].haveEnoughMoney(this._heap[object_id][type].money))
			return;
		
		game.players[obj.player].decMoney(this._heap[object_id][type].money);
		if (obj.state == 'CONSTRUCTION')
			obj.applyFix(this._heap[object_id][type].health);
		this._heap[object_id][type].current++;
		
		if (this._heap[object_id][type].current == this._heap[object_id][type].steps)
		{
			obj.progress_bar = 0;
			obj.onConstructed();
			this.remove(object_id, type);
		}
		else
			obj.progress_bar = this._heap[object_id][type].current / this._heap[object_id][type].steps;
	}
};