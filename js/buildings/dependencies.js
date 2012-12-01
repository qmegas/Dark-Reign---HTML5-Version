AssemblyPlantBuilding.require_building = [HeadquarterBuilding];
TrainingFacilityBuilding.require_building = [HeadquarterBuilding];

HeadquarterBuilding.upgrade_require = [AssemblyPlantBuilding, TrainingFacilityBuilding];
//HeadquarterBuilding.upgrade_to = Headquarter2Building;

CameraTowerBuilding.require_building = [HeadquarterBuilding];