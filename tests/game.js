const { assert, expect } = require("chai");
const Game = require("../src/Game");
const Player = require("../src/Player");
const ChaseObject = require("../src/ChaseObject");
const ChaseMap = require("../src/ChaseMap");
const GameHistory = require("../src/GameHistory");

describe("Game engine", () => {
  let game;
  let players = [];
  let chaseobject;
  let map;

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
    map = new ChaseMap(get_bounds());
  });

  it("Creates a game", async () => {
    game = new Game();
    assert.instanceOf(game, Game);
  });

  it("Creates a game with players", async () => {
    game = new Game(players);
    assert.strictEqual(game.getPlayers(), players);
  });

  it("Creates an objet in the game", async () => {
    let game = new Game(players, chaseobject);
    assert.strictEqual(game.getObject(), chaseobject);
  });

  it("Creates a map in the game", async () => {
    let game = new Game(players, chaseobject, map);
    assert.strictEqual(game.getMap(), map);
  });

  it("Creates a history in the game", async () => {
    let game = new Game(players, chaseobject, map);
    assert.instanceOf(game.getHistory(), GameHistory);
  });
});
