const { assert, expect } = require("chai");
const Game = require("../src/Game");
const Player = require("../src/Player");
const ChaseObject = require("../src/ChaseObject");
const ChaseMap = require("../src/ChaseMap");
const LocationUtils = require("../utils/point_inside_polygon");

describe("Location engine", () => {
  let player;
  let map;
  let bounds;

  before(() => {
    player = new Player("Mehdi", [48.8556475, 2.2986304]);
    let top_left = [48.8569443, 2.2940138];
    let top_right = [48.8586221, 2.2963717];
    let bot_left = [48.8523546, 2.3012814];
    let bot_right = [48.8539637, 2.3035665];

    bounds = [top_left, top_right, bot_left, bot_right];
    map = new ChaseMap(bounds);
  });

  it("Should return -1 if a player is inside the Map", async () => {
    assert.equal(
      LocationUtils.robustPointInPolygon(map.getBounds(), player.getLocation()),
      -1
    );
  });

  it("Should return 1 if a player is inside the Map", async () => {
    player = new Player("Mehdi", [48.8514708, 2.2972489]);
    assert.equal(
      LocationUtils.robustPointInPolygon(map.getBounds(), player.getLocation()),
      1
    );
  });
  it("should give the distance 0 between 2 entities which are at the same pos", async () => {
    assert.equal(LocationUtils.distance(0, 0, 0, 0), 0);
  });
});
