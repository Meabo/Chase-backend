class Area {
  constructor(location, bounds) {
    this.location = location;
    this.bounds = bounds;
  }

  getLocation() {
    return this.location;
  }

  getBounds() {
    return this.bounds;
  }
}

module.exports = Area;
