function RepriconEffect(pos)
{
	this._proto = RepriconEffect;
	
	this.init(pos);
}

AbstractSimpleEffect.setCommonOptions(RepriconEffect);

RepriconEffect.resource_key = 'repricon';
RepriconEffect.image_size = {width: 32, height: 32};
RepriconEffect.frames = 8;
RepriconEffect.is_infine = true;