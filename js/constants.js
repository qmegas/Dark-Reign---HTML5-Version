var CELL_SIZE = 24;
var VIEWPORT_SIZE = 448;

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

var PLAYER_NEUTRAL = 0;
var PLAYER_HUMAN = 1;
var PLAYER_COMPUTER1 = 2;

var RESOURCE_TAELON = 1;
var RESOURCE_WATER = 2;

var AUDIO_TYPE = 'ogg';

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

Math.getAngle = function(y, x)
{
	return this.atan2(y, x) * (180/this.PI);
};

Math.calcFrameByAngle = function(angle, rotation_number)
{
	angle = parseInt(360 - angle + 360/(rotation_number*2)) % 360;
	return parseInt(angle / (360/rotation_number));
};