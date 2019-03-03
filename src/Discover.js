const Game = require("../src/Game");
const AreaRepository = require("../src/Adapters/AreaRepository");
const LocationUtils = require("../src/LocationUtils");

class Discover {
  constructor() {
    this.areaRepository = new AreaRepository();
  }
  initAreas(areas) {
    this.areaRepository.set(areas);
  }

  showGames(user, limit) {
    if (!user.getLocation()) return "No Location";
    const filtered_games = this.areaRepository.getAll().filter(area => {
      return (
        LocationUtils.distanceByLoc(user.getLocation(), area.getLocation()) <=
        limit
      );
    });
    return filtered_games;
  }
}

module.exports = Discover;
