class Player {
  constructor(pseudo_, location_) {
    this.pseudo = pseudo_;
    this.location = location_;
  }
  getPseudo() {
    return this.pseudo;
  }
  getLocation() {
    return this.location;
  }

  moveTo(new_location) {
    this.location = new_location;
  }
}

module.exports = Player;
