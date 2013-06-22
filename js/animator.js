function Animator()
{
	var effects = [], object_id = -1;
	
	this.updatePosition = function()
	{
		for (var i in effects)
		{
			if (!game.objects[effects[i].id])
				continue;
			game.objects[effects[i].id].setPosition(this._getHotpointPosition(effects[i].point));
		}
	};
	
	this.animate = function(uid, animation)
	{
		object_id = uid;
		
		var i, effect_list = AnimationList[animation];
		
		for (i in effect_list)
			this._runEffect(effect_list[i]);
	};
	
	this.stop = function()
	{
		for (var i in effects)
			game.deleteEffect(effects[i].id);
		effects = [];
	};
	
	this._runEffect = function(info)
	{
		if (!game.objects[object_id])
			return;
		
		var hotpoint = this._chooseHotpoint(info.min_point, info.max_point);
		var eid = SimpleEffect.quickCreate(info.effect, {
			looped: info.looped,
			start: info.start,
			pos: this._getHotpointPosition(hotpoint)
		});
		effects.push({id: eid, point: hotpoint});
	};
	
	this._chooseHotpoint = function(min_point, max_point)
	{
		var obj = game.objects[object_id];
		
		if (obj.is_building)
		{
			if (obj._proto.hotpoints.length == 0)
				return -1;

			if (max_point >= obj._proto.hotpoints.length)
				max_point = obj._proto.hotpoints.length - 1;

			if (min_point >= obj._proto.hotpoints.length)
				min_point = obj._proto.hotpoints.length - 1;
		}
		else
		{
			var hotspots = obj._proto.parts[0].hotspots[0];
			if (hotspots.length == 0)
				return -1;

			if (max_point >= hotspots.length)
				max_point = hotspots.length - 1;

			if (min_point >= hotspots.length)
				min_point = hotspots.length - 1;
		}
		
		return parseInt(Math.random() * (max_point - min_point + 1)) + min_point;
	};
	
	this._getHotpointPosition = function(hotspot)
	{
		var obj = game.objects[object_id];
		
		if (hotspot == -1)
			return cloneObj(obj.position);
		
		if (obj.is_building)
		{
			return {
				x: obj.position.x + obj._proto.hotpoints[hotspot].x,
				y: obj.position.y + obj._proto.hotpoints[hotspot].y
			};
		}
		else
		{
			return {
				x: obj.position.x + obj._proto.parts[0].hotspots[obj.parts[0].direction][hotspot].x,
				y: obj.position.y + obj._proto.parts[0].hotspots[obj.parts[0].direction][hotspot].y
			};
		}
	};
}

Animator.loadResources = function()
{
	for (var i in EffectList)
		game.resources.addImage(EffectList[i].res_key, 'images/effects/' + EffectList[i].res_key + '.png');
};

Animator.quickAnimation = function(animation, pos)
{
	for (var i in AnimationList[animation])
	{
		SimpleEffect.quickCreate(AnimationList[animation][i].effect, {
			looped: false,
			start: AnimationList[animation][i].start,
			pos: pos
		});
	}
};