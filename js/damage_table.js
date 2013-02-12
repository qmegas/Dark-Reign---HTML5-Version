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

function DamageTable()
{
	this._table = {};
	this._weapon_types = ['A1', 'B1', 'B2', 'C1', 'E1', 'E2', 'E3', 'E4', 'E5', 'F1', 'G1', 'G2', 'G3', 'H1', 
		'K1', 'K2', 'M1', 'M2', 'M3', 'M4', 'R1', 'R2', 'S1', 'S2', 'V1', 'W1', 'Z0'];
	
	this.init = function()
	{
		this.addArmor('ToughHuman', 100, 10, 0, {
			A1: [ 50, 10, 0],
			B1: [100,  0, 0],
			C1: [  0,  0, 0],
			F1: [100, 30, 0],
			G2: [ 80, 10, 3],
			K1: [ 90,  5, 2],
			R2: [  0,  0, 0],
			Z0: [  0,  0, 0]
		});
		
		this.addArmor('ToughHumanWet', 100, 10, 0, {
			A1: [ 50, 10, 0],
			B1: [100,  0, 0],
			C1: [  0,  0, 0],
			F1: [100, 30, 0],
			G2: [ 80, 10, 3],
			K1: [ 90,  5, 2],
			R2: [  0,  0, 0],
			Z0: [ 80,  0, 0]
		});
		
		this.addArmor('PowerHuman', 100, 10, 0, {
			A1: [ 50, 10, 0],
			B1: [100,  0, 0],
			C1: [  0,  0, 0],
			F1: [100, 30, 0],
			G2: [ 80, 10, 3],
			K1: [ 90,  5, 2],
			R2: [  0,  0, 0],
			Z0: [  0,  0, 0]
		});
		
		this.addArmor('PowerHumanWet', 100, 10, 0, {
			A1: [ 50, 10, 0],
			B1: [100,  0, 0],
			C1: [  0,  0, 0],
			F1: [100, 30, 0],
			G2: [ 80, 10, 3],
			K1: [ 90,  5, 2],
			R2: [  0,  0, 0],
			Z0: [ 80,  0, 0]
		});
		
		this.addArmor('FlyingArmour', 100, 10, 0, {
			E2: [ 50, 10, 0],
			E3: [ 50, 10, 0],
			R2: [  0,  0, 0],
			S2: [  0,  0, 0],
			Z0: [  0,  0, 0]
		});
		
		this.addArmor('TankPlating', 100, 10, 0, {
			A1: [ 50, 10, 0],
			B1: [100,  0, 0],
			C1: [  0,  0, 0],
			E1: [200, 10, 0],
			E2: [ 50, 10, 0],
			E3: [ 75, 10, 0],
			E5: [150, 10, 0],
			S1: [ 10, 10, 0],
			F1: [100, 30, 0],
			G1: [150, 10, 0],
			G2: [ 80, 10, 3],
			M3: [250, 10, 0],
			K1: [ 90,  5, 2],
			K2: [ 75, 10, 0],
			R2: [  0,  0, 0],
			S2: [  0,  0, 0],
			Z0: [  0,  0, 0]	
		});
		
		this.addArmor('ForcePlating', 100, 10, 0, {
			A1: [ 50, 10, 0],
			B1: [100,  0, 0],
			C1: [  0,  0, 0],
			E1: [125, 10, 0],
			E2: [ 50, 10, 0],
			E3: [ 75, 10, 0],
			E5: [150, 10, 0],
			S1: [ 10, 10, 0],
			F1: [100, 30, 0],
			G1: [150, 10, 0],
			G2: [ 80, 10, 3],
			M3: [250, 10, 0],
			K1: [ 90,  5, 2],
			K2: [ 75, 10, 0],
			R2: [  0,  0, 0],
			S2: [  0,  0, 0],
			Z0: [  0,  0, 0]
		});
		
		this.addArmor('TankPlatingWet', 100, 10, 0, {
			A1: [ 50, 10,  0],
			B1: [100,  0,  0],
			C1: [  0,  0,  0],
			E1: [200, 10,  0],
			E2: [ 50, 10,  0],
			E3: [ 75, 10,  0],
			E5: [150, 10,  0],
			S1: [ 10, 10,  0],
			F1: [100, 30,  0],
			G1: [150, 10,  0],
			G2: [ 80, 10,  3],
			M3: [250, 10,  0],
			K1: [ 90,  5,  2],
			K2: [ 75, 10,  0],
			R2: [  0,  0,  0],
			S2: [  0,  0,  0],
			Z0: [ 80,  0, 10]
		});
		
		this.addArmor('BuildingArmour', 50, 10, 0, {
			C1: [ 0,  0, 0],
			R2: [ 0,  0, 0],
			S2: [ 0,  0, 0],
			S1: [10, 10, 0],
			A1: [25, 10, 0],
			B1: [50,  0, 0],
			B2: [65,  0, 0],
			E1: [70, 10, 0],
			E3: [40, 10, 0],
			E4: [40, 10, 0],
			E5: [40, 10, 0],
			F1: [50, 30, 0],
			G2: [40, 10, 3],
			K1: [45,  5, 2],
			Z0: [ 0,  0, 0]
		});
		
		this.addArmor('SuperArmour', 0, 0, 0, {
			R2: [100, 0, 0]
		});
		
		this.addArmor('SuperArmour2', 0, 0, 0, {});
	}
	
	this.addArmor = function(armor_type, default_vulnerability, default_variation, default_critical_hit, custom_settings)
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
	}
}