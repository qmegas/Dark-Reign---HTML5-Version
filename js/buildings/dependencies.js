//Imp - Headquarter
HeadquarterBuilding.upgrade_to = Headquarter2Building;

//Imp - Headquarter 2
Headquarter2Building.require_building = [AssemblyPlantBuilding, TrainingFacilityBuilding];
Headquarter2Building.upgrade_from = HeadquarterBuilding;
Headquarter2Building.upgrade_to = Headquarter3Building;

//Imp - Headquarter 3
Headquarter3Building.require_building = [AssemblyPlant2Building, TrainingFacility2Building];
Headquarter3Building.upgrade_from = Headquarter2Building;

//Imp - Assembly Plant
AssemblyPlantBuilding.require_building = [HeadquarterBuilding];
AssemblyPlantBuilding.upgrade_to = AssemblyPlant2Building;

//Imp - Advanced Assembly Plant
AssemblyPlant2Building.require_building = [Headquarter2Building];
AssemblyPlant2Building.upgrade_from = AssemblyPlantBuilding;

//Imp - Training Facility
TrainingFacilityBuilding.require_building = [HeadquarterBuilding];
TrainingFacilityBuilding.upgrade_to = TrainingFacility2Building;

//Imp - Advanced Training Facility
TrainingFacility2Building.require_building = [Headquarter2Building];
TrainingFacility2Building.upgrade_from = TrainingFacilityBuilding;

//Imp - Plasma Turret
PlasmaTurretBuilding.require_building = [HeadquarterBuilding];

//Imp - Neutron Accelerator
NeutronAcceleratorBuilding.require_building = [Headquarter2Building];

//Imp - Air Defense Site
AirDefenceSiteBuilding.require_building = [Headquarter2Building];

//Imp - Camera Tower
CameraTowerBuilding.require_building = [Headquarter2Building];

//Imp - Field Hospital
FieldHospitalBuilding.require_building = [TrainingFacilityBuilding];

//Imp - Repair Station
RepairStationBuilding.require_building = [AssemblyPlantBuilding];

//Imp - Temporal Gate
TemporalGateBuilding.require_building = [Headquarter2Building];

//Imp - Rearming Deck
RearmingDeckBuilding.require_building = [Headquarter3Building];