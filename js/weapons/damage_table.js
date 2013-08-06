// A1 is the air defence laser, used on ImpMAD and AntiAircraftSite
//
// B1 is the suicide bomber's bomb
// B2 is the artillery shell
//
// C1 is the Construction MAD's chaff attack
//
// E1 is the rail gun
// E2 is the laser rifle/pistol
// E3 is the plasma cannon
// E4 is the tachyon cannon
// E5 is the electro shock
//
// G1 is the neutron weapons
//
// H1 is the medic's healing weapon
// H2 is the mechanic's repairing weapon
//
// K1 is the normal grenade
// K2 is the Artillery Blast
//
// M1 is the air to ground missile
// M2 is the air to air missile
// M3 is the PolyAcid
// M4 is the ground to air missile
//
// R1 is the mechanic's repair
// R2 is the construction crew's repair
//
// S1 is the sniper rifle
// S2 is the shredder
//
// V1 is the offense for the vortex (temporal rift)
// W1 is the offense for the Seismic Wave

var DamageTable = {
	_table: {},
	_weapon_types: ['A1', 'B1', 'B2', 'C1', 'E1', 'E2', 'E3', 'E4', 'E5', 'F1', 'G1', 'G2', 'G3', 'H1', 
		'K1', 'K2', 'M1', 'M2', 'M3', 'M4', 'R1', 'R2', 'S1', 'S2', 'V1', 'W1', 'Z0'],
	
	init: function()
	{
		this.addArmor('ToughHuman', 1, 0.1, 0, {
			A1: [0.5,  0.1,    0],
			B1: [  1,    0,    0],
			C1: [  0,    0,    0],
			F1: [  1,  0.3,    0],
			G2: [0.8,  0.1, 0.03],
			K1: [0.9, 0.05, 0.02],
			R2: [  0,    0,    0],
			Z0: [  0,    0,    0]
		});
		
		this.addArmor('ToughHumanWet', 1, 0.1, 0, {
			A1: [0.5,  0.1,    0],
			B1: [  1,    0,    0],
			C1: [  0,    0,    0],
			F1: [  1,  0.3,    0],
			G2: [0.8,  0.1, 0.03],
			K1: [0.9, 0.05, 0.02],
			R2: [  0,    0,    0],
			Z0: [0.8,    0,    0]
		});
		
		this.addArmor('PowerHuman', 1, 0.1, 0, {
			A1: [0.5,  0.1,    0],
			B1: [  1,    0,    0],
			C1: [  0,    0,    0],
			F1: [  1,  0.3,    0],
			G2: [0.8,  0.1, 0.03],
			K1: [0.9, 0.05, 0.02],
			R2: [  0,    0,    0],
			Z0: [  0,    0,    0]
		});
		
		this.addArmor('PowerHumanWet', 1, 0.1, 0, {
			A1: [0.5,  0.1,    0],
			B1: [  1,    0,    0],
			C1: [  0,    0,    0],
			F1: [  1,  0.3,    0],
			G2: [0.8,  0.1, 0.03],
			K1: [0.9, 0.05, 0.02],
			R2: [  0,    0,    0],
			Z0: [0.8,    0,    0]
		});
		
		this.addArmor('FlyingArmour', 1, 0.1, 0, {
			E2: [0.5,  0.1,    0],
			E3: [0.5,  0.1,    0],
			R2: [  0,    0,    0],
			S2: [  0,    0,    0],
			Z0: [  0,    0,    0]
		});
		
		this.addArmor('TankPlating', 1, 0.1, 0, {
			A1: [ 0.5,  0.1,    0],
			B1: [   1,    0,    0],
			C1: [   0,    0,    0],
			E1: [   2,  0.1,    0],
			E2: [ 0.5,  0.1,    0],
			E3: [0.75,  0.1,    0],
			E5: [ 1.5,  0.1,    0],
			S1: [ 0.1,  0.1,    0],
			F1: [   1,  0.3,    0],
			G1: [ 1.5,  0.1,    0],
			G2: [ 0.8,  0.1, 0.03],
			M3: [ 2.5,  0.1,    0],
			K1: [ 0.9, 0.05, 0.02],
			K2: [0.75,  0.1,    0],
			R2: [   0,    0,    0],
			S2: [   0,    0,    0],
			Z0: [   0,    0,    0]
		});
		
		this.addArmor('ForcePlating', 1, 0.1, 0, {
			A1: [ 0.5,  0.1,    0],
			B1: [   1,    0,    0],
			C1: [   0,    0,    0],
			E1: [1.25,  0.1,    0],
			E2: [ 0.5,  0.1,    0],
			E3: [0.75,  0.1,    0],
			E5: [ 1.5,  0.1,    0],
			S1: [ 0.1,  0.1,    0],
			F1: [   1,  0.3,    0],
			G1: [ 1.5,  0.1,    0],
			G2: [ 0.8,  0.1, 0.03],
			M3: [ 2.5,  0.1,    0],
			K1: [ 0.9, 0.05, 0.02],
			K2: [0.75,  0.1,    0],
			R2: [   0,    0,    0],
			S2: [   0,    0,    0],
			Z0: [   0,    0,    0]
		});
		
		this.addArmor('TankPlatingWet', 1, 0.1, 0, {
			A1: [ 0.5,  0.1,    0],
			B1: [   1,    0,    0],
			C1: [   0,    0,    0],
			E1: [   2,  0.1,    0],
			E2: [ 0.5,  0.1,    0],
			E3: [0.75,  0.1,    0],
			E5: [ 1.5,  0.1,    0],
			S1: [ 0.1,  0.1,    0],
			F1: [   1,  0.3,    0],
			G1: [ 1.5,  0.1,    0],
			G2: [ 0.8,  0.1, 0.03],
			M3: [ 2.5,  0.1,    0],
			K1: [ 0.9, 0.05, 0.02],
			K2: [0.75,  0.1,    0],
			R2: [   0,    0,    0],
			S2: [   0,    0,    0],
			Z0: [ 0.8,    0,  0.1]
		});
		
		this.addArmor('BuildingArmour', 0.5, 0.1, 0, {
			C1: [   0,    0,    0],
			R2: [   0,    0,    0],
			S2: [   0,    0,    0],
			S1: [ 0.1,  0.1,    0],
			A1: [0.25,  0.1,    0],
			B1: [ 0.5,    0,    0],
			B2: [0.65,    0,    0],
			E1: [ 0.7,  0.1,    0],
			E3: [ 0.4,  0.1,    0],
			E4: [ 0.4,  0.1,    0],
			E5: [ 0.4,  0.1,    0],
			F1: [ 0.5,  0.3,    0],
			G2: [ 0.4,  0.1, 0.03],
			K1: [0.45, 0.05, 0.02],
			Z0: [   0,    0,    0]
		});
		
		this.addArmor('SuperArmour', 0, 0, 0, {
			R2: [1, 0, 0]
		});
		
		this.addArmor('SuperArmour2', 0, 0, 0, {});
	},
	
	addArmor: function(armor_type, default_vulnerability, default_variation, default_critical_hit, custom_settings)
	{
		var i, key;
		
		this._table[armor_type] = {};
		for (i in this._weapon_types)
		{
			key = this._weapon_types[i];
			if (custom_settings[key])
				this._table[armor_type][key] = {
					vulnerability: custom_settings[key][0],
					variation: custom_settings[key][1],
					critical_hit: custom_settings[key][2]
				};
			else
				this._table[armor_type][key] = {
					vulnerability: default_vulnerability,
					variation: default_variation,
					critical_hit: default_critical_hit
				};
		}
	},
	
	calcDamage: function(armor_type, weapon_type, strength)
	{
		var type = this._table[armor_type][weapon_type], proc;
		
		proc = type.vulnerability + (type.variation * 2 * Math.random() - type.variation);
		if (proc < 0)
			return 0;
		
		strength *= proc;
		if (Math.random() < type.critical_hit)
			strength *= 3;
		 
		 return strength;
	},
		
	applyOffence: function(position, offence, layer, attacker_id)
	{
		var x, y, pixel_pos, damage_proc, damage_cache = {}, ids, i, damage, 
			top_left = MapCell.pixelToCell({x: position.x - offence.area_effect, y: position.y - offence.area_effect}),
			bottom_right = MapCell.pixelToCell({x: position.x + offence.area_effect, y: position.y + offence.area_effect});
		
		for (x = top_left.x; x <= bottom_right.x; ++x)
		{
			if (!MapCell.isCorrectX(x))
				continue;
			
			for (y = top_left.y; y <= bottom_right.y; ++y)
			{
				if (!MapCell.isCorrectY(y))
					continue;
				
				//Calculate damage coefficient
				pixel_pos = MapCell.cellToPixel({x: x, y: y});
				pixel_pos.x += 12;
				pixel_pos.y += 12;
				damage_proc = (1 - Math.min(1, MapCell.getPixelDistance(pixel_pos.x, pixel_pos.y, position.x, position.y) / offence.area_effect)) / 2 + 0.5;
				
				//Get objects
				ids = MapCell.getIdsByLayer(x, y, layer);
				
				//Calculate damage
				for (i in ids)
				{
					//Make sure we do not hit same unit twice. It possible for buildings.
					damage = this.calcDamage(
						game.objects[ids[i]]._proto.shield_type, 
						offence.type, 
						offence.strength
					);
					damage *= damage_proc;
					
					if (damage == 0)
						continue;
					
					if (damage_cache[ids[i]] && damage_cache[ids[i]]>damage)
						continue;
					
					damage_cache[ids[i]] = damage;
				}
			}
		}
		
		//Apply damage
		for (i in damage_cache)
		{
			game.objects[i].applyDamage(damage_cache[i]);
			game.objects[i].triggerEvent('attacked', {attacker: attacker_id});
		}
	}
};