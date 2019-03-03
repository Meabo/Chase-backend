const { assert, expect } = require("chai");
const Game = require("../src/Game");
const Player = require("../src/Player");
const ChaseObject = require("../src/ChaseObject");
const Area = require("../src/Area");
const GameHistory = require("../src/GameHistory");

describe("Game options", () => {
  let game;
  let players = [];
  let chaseobject;
  let area;

  function get_bounds() {
    const top_left = [48.8569443, 2.2940138];
    const top_right = [48.8586221, 2.2963717];
    const bot_left = [48.8523546, 2.3012814];
    const bot_right = [48.8539637, 2.3035665];
    return [top_left, top_right, bot_left, bot_right];
  }

  before(() => {
    const player = new Player("Mehdi", [48.8556475, 2.2986304]);
    const player1 = new Player("Bebert", [48.8574884, 2.2955138]);
    players.push(player, player1);
    chaseobject = new ChaseObject([48.8574884, 2.2955138]);
    area = new Area(get_bounds());
  });

  it("Creates a game", async () => {
    game = new Game();
    assert.instanceOf(game, Game);
  });

  it("Creates a game with players", async () => {
    game = new Game(players);
    assert.strictEqual(game.getPlayers(), players);
  });

  it("Creates an object in the game", async () => {
    let game = new Game(players, chaseobject);
    assert.strictEqual(game.getObject(), chaseobject);
  });

  it("Creates a map in the game", async () => {
    let game = new Game(players, chaseobject, area);
    assert.strictEqual(game.getArea(), area);
  });

  it("Creates a history in the game", async () => {
    let game = new Game(players, chaseobject, area);
    assert.instanceOf(game.getHistory(), GameHistory);
  });

  it("Should begin a timer", async done => {
    done("not implemented yet");
  });

  it("Should end the game when the timer is finished", async done => {
    done("not implemented yet");
  });

  it("Should acknowledge players when a player location change", async done => {
    done("not implemented yet");
  });

  it("Should acknowledge players when a player catch the ChaseObject", async done => {
    done("not implemented yet");
  });

  it("Should acknowledge players when a player steal another player", async done => {
    done("not implemented yet");
  });

  it("Should acknowledge players when a player uses a skill", async done => {
    done("not implemented yet");
  });
});
