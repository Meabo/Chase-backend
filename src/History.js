class History {
  constructor() {
    this.moves = [];
    this.actions = [];
  }

  addMove(pseudo, prevlocation, newlocation, timestamp) {
    this.moves.push({
      pseudo: pseudo,
      prev_location: prevlocation,
      location: newlocation,
      timestamp: timestamp
    });
  }

  addCatch(action, pseudo, location, timestamp) {
    this.actions.push({
      action: action,
      pseudo: pseudo,
      location: location,
      timestamp: timestamp
    });
  }

  addSteal(action, pseudo, pseudo2, location, timestamp) {
    this.actions.push({
      action: action,
      pseudo: pseudo,
      pseudo_stealed: pseudo2,
      location: location,
      timestamp: timestamp
    });
  }
  getLastElement(array) {
    if (array) return array[array.length - 1];
  }
  getHistoryMoves() {
    return this.moves;
  }

  getHistoryActions() {
    return this.actions;
  }
}

module.exports = History;
