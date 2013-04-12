function Animator()
{
	var effect_ids = [], object_id = -1;
	
	this.setObject = function(uid)
	{
		object_id = uid;
	};
	
	this.newPosition = function(pos)
	{
	};
	
	this.animate = function(animation, mode)
	{
		var i, effect_list = AnimationList[animation];
		
		for (i in effect_list)
			this._runEffect(effect_list[i]);
	};
	
	this.stop = function()
	{
		for (var i in effect_ids)
			game.deleteEffect(effect_ids[i]);
		effect_ids = [];
	};
	
	this._runEffect = function(info)
	{
		if (!game.objects[object_id])
			return;
		
		var id = SimpleEffect.quickCreate(info.effect, {
			looped: info.looped,
			start: info.start,
			pos: game.objects[object_id].getHotpointPosition(info.min_point, info.max_point)
		});
		effect_ids.push(id);
	};
}

Animator.MODE_ATTACHED = 0;
Animator.MODE_FIXED = 1;

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