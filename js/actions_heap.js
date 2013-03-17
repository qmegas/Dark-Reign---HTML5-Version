var ActionsHeap = {
	_heap: {},
		
	add: function(object_id, act_info)
	{
		this._heap[object_id] = act_info;
	},
		
	remove: function(object_id)
	{
		delete this._heap[object_id];
	},
		
	run: function()
	{
		var object_id;
		
		for (object_id in this._heap)
		{
			if (game.objects[object_id] === undefined)
			{
				this.remove(object_id);
				continue;
			}
			
			switch (this._heap[object_id].type)
			{
				case 'construct':
					this._runConstruct(object_id);
					break;
					
				case 'sell':
					this._runSell(object_id);
					break;
					
				case 'heal':
					this._runHeal(object_id);
					break;
			}
		}
	},
		
	_runHeal: function(object_id)
	{
		var obj = game.objects[object_id];
		
		if (obj.state != 'HEALING')
		{
			this.remove(object_id);
			return;
		}
		
		obj.applyHeal(HEAL_SPEED);
		
		if (obj.health >= obj._proto.health_max)
		{
			obj.onHealed();
			this.remove(object_id);
		}
	},
		
	_runSell: function(object_id)
	{
		var obj = game.objects[object_id];
		
		this._heap[object_id].current++;
		
		if (this._heap[object_id].current == this._heap[object_id].steps)
		{
			obj.progress_bar = 0;
			obj.onSold();
			this.remove(object_id);
		}
		else
			obj.progress_bar = this._heap[object_id].current / this._heap[object_id].steps;
	},
		
	_runConstruct: function(object_id)
	{
		var obj = game.objects[object_id];
		
		if (!game.players[obj.player].haveEnoughMoney(this._heap[object_id].money))
			return;
		
		game.players[obj.player].decMoney(this._heap[object_id].money);
		if (obj.state == 'CONSTRUCTION')
			obj.applyFix(this._heap[object_id].health);
		this._heap[object_id].current++;
		
		if (this._heap[object_id].current == this._heap[object_id].steps)
		{
			obj.progress_bar = 0;
			obj.onConstructed();
			this.remove(object_id);
		}
		else
			obj.progress_bar = this._heap[object_id].current / this._heap[object_id].steps;
	}
};