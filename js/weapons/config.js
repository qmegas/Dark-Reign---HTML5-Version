/**
 * ?movement: <= SetMovement(Linear, )
 * minimum_range: <= SetAttributes(minimum_range, maximum_range, ammo, firedelay, energypershot)
 * maximum_range
 * ammo
 * firedelay => shoot per msec. Calculation: 33.75*firedelay
 * can_shoot_ground <= CanShootGround() & CanShootGroundUnit() & CanShootBuilding()
 * can_shoot_flyer <= CanShootFlyer()
 * offence <= SetOffense(type strength area_effect)
 * fire_sound <= SetFireSound()
 * hit_sound <= SetHitSound()
 * hit_explosion <= SetHitExplosion()
 * bulet_speed <= SetSpeed(?InitialSpeed?, ?acceleration?, ?maxspeed?, ?rotationalspeed?)
 */
var WeaponConfig = {
	CycloneCannon: {
		bulet_animation: 'eoncnpr0_animation',
		minimum_range: 1,
		maximum_range: 6,
		ammo: 6,
		firedelay: 338,
		can_shoot_ground: true,
		can_shoot_flyer: true,
		offence: {
			type: 'G1',
			strength: 24,
			area_effect: 10
		},
		fire_sound: 'gxcycwc0',
		hit_explosion: 'eoncnex0_explosion',
		bulet_speed: 700
	},
	FortressCannon: {
		bulet_animation: 'eoskypr0_animation',
		minimum_range: 0,
		maximum_range: 7,
		firedelay: 25000,
		can_shoot_ground: true,
		can_shoot_flyer: false,
		offence: {
			type: 'E3',
			strength: 650,
			area_effect: 36
		},
		fire_sound: 'gxskywc0',
		hit_explosion: 'fortress_hit_explosion',
		bulet_speed: 2000
	},
	GatPlasma: {
		bulet_animation: 'eoplspr1_animation',
		minimum_range: 0,
		maximum_range: 5,
		firedelay: 108,
		can_shoot_ground: true,
		can_shoot_flyer: true,
		offence: {
			type: 'E3',
			strength: 10,
			area_effect: 8
		},
		fire_sound: 'gxigtwc0',
		hit_explosion: 'eoplsex2_explosion',
		bulet_speed: 700
	},
	GroundToAirLaser: {
		bulet_animation: 'eoorbpr0_animation',
		minimum_range: 0,
		maximum_range: 10,
		firedelay: 473,
		can_shoot_ground: false,
		can_shoot_flyer: true,
		offence: {
			type: 'A1',
			strength: 48,
			area_effect: 8
		},
		fire_sound: 'gxmadwc0',
		hit_explosion: 'eoblatr0_explosion',
		bulet_speed: 2000
	},
	IMPArtilleryShell: {
		bulet_animation: 'eoiarpr0_animation',
		minimum_range: 3,
		maximum_range: 45,
		firedelay: 2700,
		can_shoot_ground: true,
		can_shoot_flyer: false,
		offence: {
			type: 'K2',
			strength: 30,
			area_effect: 100
		},
		fire_sound: 'gxiarwc0',
		hit_sound: 'gxex1oc0',
		hit_explosion: 'eoiarex0_explosion',
		bulet_speed: 200 //SetSpeed(7.0 0.0 5.0 1)
	},
	IMPFixedGroundToAirLaser: {
		bulet_animation: 'eoorbpr0_animation',
		minimum_range: 0,
		maximum_range: 10,
		firedelay: 473,
		can_shoot_ground: false,
		can_shoot_flyer: true,
		offence: {
			type: 'A1',
			strength: 14,
			area_effect: 10
		},
		fire_sound: 'gxiaawc0',
		hit_explosion: 'eoblatr0_explosion',
		bulet_speed: 2000 //SetSpeed(40.0 0.0 40.0 1)
	},
	LaserCannon: {
		bulet_animation: 'eolaspr3_animation',
		minimum_range: 0,
		maximum_range: 6,
		firedelay: 438,
		can_shoot_ground: true,
		can_shoot_flyer: false,
		offence: {
			type: 'E2',
			strength: 10,
			area_effect: 10
		},
		fire_sound: 'gxsttwc0',
		hit_explosion: 'eolasex1_explosion',
		bulet_speed: 700 //SetSpeed(20.0 0.0 20.0 1)
	},
	LaserRifle: {
		bulet_animation: 'eolaspr2_animation',
		minimum_range: 0,
		maximum_range: 4,
		firedelay: 270,
		can_shoot_ground: true,
		can_shoot_flyer: false,
		offence: {
			type: 'E2',
			strength: 11,
			area_effect: 8
		},
		fire_sound: 'gxlgnwc0',
		hit_explosion: 'smalllaser_hitpuff_explosion',
		bulet_speed: 700 //SetSpeed(20.0 0.0 1000.0 1)
	},
	NeutronAss: {
		bulet_animation: 'eoncnpr0_animation',
		minimum_range: 0,
		maximum_range: 9,
		firedelay: 1080,
		can_shoot_ground: true,
		can_shoot_flyer: false,
		offence: {
			type: 'E3',
			strength: 180,
			area_effect: 12
		},
		fire_sound: 'gxneuwc0',
		hit_explosion: 'eoncnex0_explosion',
		bulet_speed: 2000 //SetSpeed(35.0  0.0  1000.0 1)
	},
	PlasmaCannon: {
		bulet_animation: 'eoplspr1_animation',
		minimum_range: 0,
		maximum_range: 5,
		firedelay: 507,
		can_shoot_ground: true,
		can_shoot_flyer: false,
		offence: {
			type: 'E3',
			strength: 19,
			area_effect: 8
		},
		fire_sound: 'gxpltwc0',
		hit_explosion: 'eoplsex2_explosion',
		bulet_speed: 2000 //SetSpeed(35.0  0.0  1000.0 1)
	},
	PlasmaRifle: {
		bulet_animation: 'eoplspr0_animation',
		minimum_range: 0,
		maximum_range: 4,
		firedelay: 270,
		can_shoot_ground: true,
		can_shoot_flyer: true,
		offence: {
			type: 'E3',
			strength: 18,
			area_effect: 8
		},
		fire_sound: 'gxbonwc0',
		hit_explosion: 'eoplsex0_explosion',
		bulet_speed: 700
	},
	PolyAcid: {
		bulet_animation: 'eorfgpr0_animation',
		minimum_range: 0,
		maximum_range: 5,
		firedelay: 675,
		can_shoot_ground: true,
		can_shoot_flyer: false,
		offence: {
			type: 'M3',
			strength: 15,
			area_effect: 24
		},
		fire_sound: 'gxextwc1',
		hit_explosion: 'eorfgex0_explosion',
		bulet_speed: 700
	},
	TachyonCannon: {
		bulet_animation: 'eotacpr0_animation',
		minimum_range: 1,
		maximum_range: 8,
		firedelay: 675,
		can_shoot_ground: true,
		can_shoot_flyer: false,
		offence: {
			type: 'E4',
			strength: 20,
			area_effect: 20
		},
		fire_sound: 'gxtctwc0',
		hit_explosion: 'eotacex0_explosion',
		bulet_speed: 2000
	}
};