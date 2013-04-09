//var AnimatorMode = {
//	ATTACHED: 0,
//	FIXED: 1
//};

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
		
		var effect_data, effect, pos, point;
		
		point = parseInt(Math.random() * (info.max_point - info.min_point + 1)) + info.min_point;
		pos = game.objects[object_id].getHotpointPosition(point);
		
		effect_data = cloneObj(EffectList[info.effect]);
		effect_data.looped = (info.looped) ? true : false;
		effect_data.delay = info.start;
		
		effect = new SimpleEffect(effect_data);
		effect.setPosition(pos);
		effect_ids.push(game.addEffect(effect));
	};
}

Animator.MODE_ATTACHED = 0;
Animator.MODE_FIXED = 1;

Animator.loadResources = function()
{
	for (var i in EffectList)
		game.resources.addImage(EffectList[i].res_key, 'images/effects/' + EffectList[i].res_key + '.png');
};