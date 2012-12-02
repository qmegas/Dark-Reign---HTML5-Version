AssemblyPlantBuilding.require_building = [HeadquarterBuilding];
TrainingFacilityBuilding.require_building = [HeadquarterBuilding];

HeadquarterBuilding.upgrade_to = Headquarter2Building;

Headquarter2Building.require_building = [AssemblyPlantBuilding, TrainingFacilityBuilding];

CameraTowerBuilding.require_building = [HeadquarterBuilding];