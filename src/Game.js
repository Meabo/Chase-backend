const GameHistory = require("../src/GameHistory");

class Game {
  constructor(players_, chaseobject_, area) {
    this.players = players_;
    this.chaseobject = chaseobject_;
    this.area = area;
    this.history = new GameHistory();
  }

  getPlayers() {
    return this.players;
  }

  getObject() {
    return this.chaseobject;
  }

  getArea() {
    return this.area;
  }

  getHistory() {
    return this.history;
  }
}

module.exports = Game;
