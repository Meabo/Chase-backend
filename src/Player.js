const { Subject } = require("rxjs");

class Player {
  constructor(pseudo_, location_) {
    this.pseudo = pseudo_;
    this.location = location_;
    this.actionObserver = new Subject();
  }
  getPseudo() {
    return this.pseudo;
  }
  getLocation() {
    return this.location;
  }

  getPlayerObserver() {
    return this.actionObserver;
  }

  moveTo(new_location) {
    this.location = new_location;
    this.actionObserver.next({
      action: "move",
      pseudo: this.pseudo,
      location: new_location
    });
  }
}

module.exports = Player;
