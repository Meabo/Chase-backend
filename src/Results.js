const LocationUtils = require("./LocationUtils");

class Results {
  constructor() {}
  getResults(history) {
    const total_distance = history.getHistoryMoves().reduce((acc, move) => {
      return (
        acc + LocationUtils.distanceByLoc(move.prev_location, move.location)
      );
    }, 0);

    const total_catchs = history
      .getHistoryActions()
      .filter(history => history.action === "catch")
      .reduce((acc, cur) => acc + 1, 0);

    const total_steals = history
      .getHistoryActions()
      .filter(history => history.action === "steal")
      .reduce((acc, cur) => acc + 1, 0);

    const total_skills_used = history
      .getHistoryActions()
      .filter(history => history.action === "skill")
      .reduce((acc, cur) => acc + 1, 0);

    return {
      total_distance: total_distance,
      total_catchs: total_catchs,
      total_steals: total_steals,
      total_skills_used: total_skills_used
    };
  }

  getResultsByPlayer(history, player) {
    const total_distance = history
      .getHistoryMoves()
      .filter(history => history.pseudo === player.pseudo)
      .reduce((acc, move) => {
        return (
          acc + LocationUtils.distanceByLoc(move.prev_location, move.location)
        );
      }, 0);

    const total_catchs = history
      .getHistoryActions()
      .filter(
        history =>
          history.pseudo === player.pseudo && history.action === "catch"
      )
      .reduce((acc, cur) => acc + 1, 0);

    const total_steals = history
      .getHistoryActions()
      .filter(
        history =>
          history.pseudo === player.pseudo && history.action === "steal"
      )
      .reduce((acc, cur) => acc + 1, 0);

    const total_skills_used = history
      .getHistoryActions()
      .filter(
        history =>
          history.pseudo === player.pseudo && history.action === "skill"
      )
      .reduce((acc, cur) => acc + 1, 0);
    return {
      total_distance: total_distance,
      total_catchs: total_catchs,
      total_steals: total_steals,
      total_skills_used: total_skills_used
    };
  }
}

module.exports = Results;
