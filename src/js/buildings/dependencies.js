//Imp - Headquarter
IMHeadquarterBuilding.upgrade_to = IMHeadquarter2Building;

//Imp - Headquarter 2
IMHeadquarter2Building.require_building = [AssemblyPlantBuilding, TrainingFacilityBuilding];
IMHeadquarter2Building.upgrade_from = IMHeadquarterBuilding;
IMHeadquarter2Building.upgrade_to = IMHeadquarter3Building;

//Imp - Headquarter 3
IMHeadquarter3Building.require_building = [AssemblyPlant2Building, TrainingFacility2Building];
IMHeadquarter3Building.upgrade_from = IMHeadquarter2Building;

//Imp - Assembly Plant
AssemblyPlantBuilding.require_building = [IMHeadquarterBuilding];
AssemblyPlantBuilding.upgrade_to = AssemblyPlant2Building;

//Imp - Advanced Assembly Plant
AssemblyPlant2Building.require_building = [IMHeadquarter2Building];
AssemblyPlant2Building.upgrade_from = AssemblyPlantBuilding;

//Imp - Training Facility
TrainingFacilityBuilding.require_building = [IMHeadquarterBuilding];
TrainingFacilityBuilding.upgrade_to = TrainingFacility2Building;

//Imp - Advanced Training Facility
TrainingFacility2Building.require_building = [IMHeadquarter2Building];
TrainingFacility2Building.upgrade_from = TrainingFacilityBuilding;

//Imp - Plasma Turret
PlasmaTurretBuilding.require_building = [IMHeadquarterBuilding];

//Imp - Neutron Accelerator
NeutronAcceleratorBuilding.require_building = [IMHeadquarter2Building];

//Imp - Air Defense Site
AirDefenceSiteBuilding.require_building = [IMHeadquarter2Building];

//Imp - Camera Tower
CameraTowerBuilding.require_building = [IMHeadquarter2Building];

//Imp - Field Hospital
FieldHospitalBuilding.require_building = [TrainingFacilityBuilding];

//Imp - Repair Station
RepairStationBuilding.require_building = [AssemblyPlantBuilding];

//Imp - Temporal Gate
TemporalGateBuilding.require_building = [IMHeadquarter2Building];

//Imp - Rearming Deck
RearmingDeckBuilding.require_building = [IMHeadquarter3Building];

//Imp - Rift Creator
RiftCreatorBuilding.require_building = [IMHeadquarter3Building, TemporalGateBuilding];