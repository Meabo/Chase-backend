const { assert } = require("chai");
const Player = require("../src/Player");

describe("Player engine", () => {
  it("Creates a player", async () => {
    let player = new Player();
    assert.instanceOf(player, Player);
  });

  it("Creates a player with a pseudo", async () => {
    let pseudo = "Mehdi";
    let player = new Player(pseudo);
    assert.strictEqual(player.getPseudo(), pseudo);
  });

  it("Creates a player with a pseudo and a location", async () => {
    let pseudo = "Mehdi";
    let location = [48.8556475, 2.2986304];
    let player = new Player(pseudo, location);
    assert.strictEqual(player.getLocation(), location);
  });

  it("Moves a player from a location to another", async () => {
    let pseudo = "Mehdi";
    let location = [48.8556475, 2.2986304];
    let new_location = [48.8574884, 2.2955138];

    let player = new Player(pseudo, location);
    player.moveTo(new_location);
    assert.strictEqual(player.getLocation(), new_location);
  });

  it("Should catch the ChaseObject if location is near");

  it("Should steal the ChaseObject if the location is near");

  it("Should uses a skill if the skill is ready");

  it("Should fail to use a skill if a player has no skill");

  it("Should fail to use a skill if a player use a skill before cooldown");
});
