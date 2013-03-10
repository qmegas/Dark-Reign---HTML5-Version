function CraterEffect()
{
}

CraterEffect.items = {
	crater4: {
		size: {x: 95, y: 93},
		padding: {x: -12, y: 9}
	}
};

CraterEffect.create = function(type, pos_pixels)
{
	var ctx = $('#map_view').get(0).getContext('2d');
	type = 'crater' + type;
	ctx.drawImage(
		game.resources.get(type), 
		pos_pixels.x - this.items[type].padding.x,
		pos_pixels.y - this.items[type].padding.y
	);
};

CraterEffect.loadResources = function()
{
	for (var i in this.items)
		game.resources.addImage(i, 'images/effects/craters/'+i+'.png');
};