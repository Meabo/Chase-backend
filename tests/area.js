const { expect, assert } = require("chai");
const Area = require("../src/Area");
const Player = require("../src/Player");

describe("Area engine", () => {
  let bounds;
  const loc = [48.8556475, 2.2986304];

  before(() => {
    let top_left = [48.8569443, 2.2940138];
    let top_right = [48.8586221, 2.2963717];
    let bot_left = [48.8523546, 2.3012814];
    let bot_right = [48.8539637, 2.3035665];
    bounds = [top_left, top_right, bot_left, bot_right];
  });

  it("Creates an Area", async () => {
    let area = new Area();
    assert.instanceOf(area, Area);
  });

  it("Creates an Area with a loc and bounds", async () => {
    let area = new Area(loc, bounds);
    assert.deepEqual(area.getBounds(), bounds);
  });

  it("Should have a name", async () => {
    let area = new Area(loc, bounds, "Champs de Mars");
    assert.equal(area.getName(), "Champs de Mars");
  });

  it("Should have rooms inside", async () => {
    let area = new Area(loc, bounds, "Champs de Mars");
    area.createRoom();
    area.createRoom();
    area.createRoom();
    assert.lengthOf(area.getRooms(), 3);
  });

  it("Should get players in one room inside Area", async () => {
    let area = new Area(loc, bounds, "Champs de Mars");
    let roomId = area.createRoom();
    let room = area.getRooms()[roomId];
    let player = new Player();
    room.join(player);
    assert.include(room.getPlayers(), player);
  });

  it("Should get players in every rooms inside Area", async () => {
    let area = new Area(loc, bounds, "Champs de Mars");
    let roomId = area.createRoom();
    let roomId2 = area.createRoom();
    let player = new Player();
    area.getRooms()[roomId].join(player);
    area.getRooms()[roomId].join(player);
    area.getRooms()[roomId2].join(player);
    area.getRooms()[roomId2].join(player);
    assert.include(area.getPlayersArea(), player);
  });

  it("Should get players count in every rooms inside Area", async () => {
    let area = new Area(loc, bounds, "Champs de Mars");
    let roomId = area.createRoom();
    let roomId2 = area.createRoom();
    area.getRooms()[roomId].join(new Player());
    area.getRooms()[roomId].join(new Player());
    area.getRooms()[roomId2].join(new Player());
    area.getRooms()[roomId2].join(new Player());
    assert.equal(area.getPlayersCounter(), 4);
  });

  it("Should make an ack when someone joins/leaves a room inside an Area", async () => {
    let area = new Area(loc, bounds, "Champs de Mars");
    let roomId = area.createRoom();
    let expected_player_joined = new Player("meabo");
    const subject = area.getRooms()[roomId].getRoomSubject();
    subject.subscribe(new_data => {
      assert.equal(new_data.action, "join");
    });
    area.getRooms()[roomId].join(expected_player_joined);
  });
});
