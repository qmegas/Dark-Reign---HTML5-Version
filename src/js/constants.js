

var CELL_SIZE = 24;

var RIGHT_FRAME_X = 192;
var TOP_BAR_Y = 32;

var VIEWPORT_SIZE_X = 640;
var VIEWPORT_SIZE_Y = 480;

var VIEWPORT_SIZE = 448;
var VIEWPORT_SIZE_X = 640;
var VIEWPORT_SIZE_Y = 480;

var PANNING_FIELD_SIZE = 30;

var RUNS_PER_SECOND = 50;
var ANIMATION_SPEED = 50; //mspf

var HEAL_SPEED = 23;

var BUILDING_REPAIR_SPEED = 15;
var BUILDING_REPAIR_COST = 12;

var ACTION_STATE_NONE = 0;
var ACTION_STATE_SELL = 1;
var ACTION_STATE_POWER = 2;
var ACTION_STATE_BUILD = 3;
var ACTION_STATE_REPAIR = 4;
var ACTION_STATE_ATTACK = 5;

var CELL_TYPE_EMPTY = 0;
var CELL_TYPE_TREE = 1;
var CELL_TYPE_WATER = 2;
var CELL_TYPE_NOWALK = 3;
var CELL_TYPE_BUILDING = 4;

var PLAYERS_COUNT = 3;
var PLAYER_NEUTRAL = 0;
var PLAYER_HUMAN = 1;
var PLAYER_COMPUTER1 = 2;

var RESOURCE_TAELON = 1;
var RESOURCE_WATER = 2;

var TACTIC_ORDER_DEFAULT = 0;
var TACTIC_ORDER_SCOUT = 1;
var TACTIC_ORDER_HARASS = 2;
var TACTIC_ORDER_SND = 3;
var TACTIC_LOW = 1;
var TACTIC_MED = 2;
var TACTIC_HIGH = 3;

var v = document.createElement('audio');
var AUDIO_TYPE = 'mp3'; //v.canPlayType('audio/ogg') ? 'ogg' : 'mp3';

var v = document.createElement('video');
var VIDEO_TYPE = v.canPlayType('video/webm') ? 'webm' : 'mp4';

var GAMECONFIG = {
	playMusic: true,
	playVideo: true,
	defaultMusicVolume: 1,
	defaultSoundVolume: 1,
	shroud: true,
	fog: true
};

var game;

window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

function cloneObj(obj)
{
	var clone = {};

	for (var i in obj) {
		if (obj[i] && typeof obj[i] == 'object') {
			clone[i] = cloneObj(obj[i]);
		} else {
			clone[i] = obj[i];
		}
	}

	return clone;
}

function rangeItterator(pos_x, pos_y, range, callback)
{
	var x, y, is_stop;

	for (x = pos_x - range + 1; x < pos_x + range; ++x)
	{
		if (!MapCell.isCorrectX(x))
			continue;

		for (y = pos_y - range + 1; y < pos_y + range; ++y)
		{
			if (!MapCell.isCorrectY(y))
				continue;

			if (!(Math.sqrt(Math.pow(x - pos_x, 2) + Math.pow(y - pos_y, 2)) < range))
				continue;

			is_stop = callback(x, y);
			if (is_stop)
				return;
		}
	}
}

Math.getAngle = function(y, x)
{
	return this.atan2(y, x) * (180 / this.PI);
};

Math.calcFrameByAngle = function(angle, rotation_number)
{
	angle = parseInt(360 - angle + 360 / (rotation_number * 2)) % 360;
	return parseInt(angle / (360 / rotation_number));
};

Array.factory = function(number, def_value)
{
	var i, arr = [];

	if (typeof def_value == 'undefined')
		def_value = 0;

	for (i = 0; i < number; ++i)
		arr[i] = def_value;
	return arr;
};

String.prototype.replaceAt = function(index, character)
{
	return this.substr(0, index) + character + this.substr(index + character.length);
};