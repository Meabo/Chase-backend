const GameHistory = require("../src/GameHistory");
const { timer, pipe, from } = require("rxjs");
const { take, finalize, mergeMap } = require("rxjs/operators");
const LocationUtils = require("../utils/point_inside_polygon");

class Game {
  constructor(players_, chaseobject_, area) {
    this.players = players_;
    this.chaseobject = chaseobject_;
    this.area = area;
    this.history = new GameHistory();
    this.timer = null;
    this.gameState = {};
    this.guardian = null;
  }

  isFinished() {
    return this.gameState.isFinished;
  }

  async BeginTimer(limit, ticker) {
    this.gameState.isFinished = false;
    this.timer = timer(0, ticker)
      .pipe(
        take(limit),
        finalize(() => {
          this.gameState.isFinished = true;
          console.log("finished");
        })
      )
      .subscribe();
  }

  getGuardian() {
    return this.guardian;
  }
  catchChaseObject(player) {
    if (
      LocationUtils.distance(
        player.getPosition(),
        this.chaseobject.getPosition()
      ) > 10
    ) {
      this.guardian = player.pseudo;
    }
  }

  getPlayersObservers() {
    return from(this.players).pipe(mergeMap(player => player.actionObserver));
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
