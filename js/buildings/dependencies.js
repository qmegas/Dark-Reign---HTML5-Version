//IG - Headquarter
HeadquarterBuilding.upgrade_to = Headquarter2Building;

//IG - Headquarter 2
Headquarter2Building.require_building = [AssemblyPlantBuilding, TrainingFacilityBuilding];
Headquarter2Building.upgrade_from = HeadquarterBuilding;

//IG - Assembly Plant
AssemblyPlantBuilding.require_building = [HeadquarterBuilding];

//IG - Training Facility
TrainingFacilityBuilding.require_building = [HeadquarterBuilding];
TrainingFacilityBuilding.upgrade_to = TrainingFacility2Building;

//IG - Advanced Training Facility
TrainingFacility2Building.require_building = [Headquarter2Building];
TrainingFacility2Building.upgrade_from = TrainingFacilityBuilding;

//IG - Camera Tower
CameraTowerBuilding.require_building = [Headquarter2Building];