const { expect, assert } = require("chai");
const Game = require("../src/Game");
const Player = require("../src/Player");
const ChaseObject = require("../src/ChaseObject");
const Area = require("../src/Area");
const Results = require("../src/Results");

describe("Score Board", () => {
  let players = [];
  let chaseobject;
  let area;
  const timeout = ms => new Promise(res => setTimeout(res, ms));

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
    const player2 = new Player("Benoit", [48.8574881, 2.2955136]);

    players.push(player, player1, player2);
    chaseobject = new ChaseObject([48.8574884, 2.2955138]);
    area = new Area(get_bounds());
  });

  it("Scenario 1: Should announce the winner (1 catch)", async () => {
    let game = new Game(players, chaseobject, area);
    let [player_mehdi] = game.getPlayers();
    await game.BeginTimer(1, 200);

    game.catchChaseObject(player_mehdi);

    await timeout(200);
    assert.equal(game.isFinished(), true);
    assert.equal(game.getGuardian(), player_mehdi);
    const historyActions = game.getHistory().getHistoryActions();
    assert.equal(
      game.getHistory().getLastElement(historyActions).pseudo,
      player_mehdi.pseudo
    );
  });

  it("Scenario 2: Should announce the winner (1 catch and 1 steal)", async () => {
    let game = new Game(players, chaseobject, area);
    let [player_mehdi] = game.getPlayers();
    let player_bebert = game.getPlayers()[1];
    await game.BeginTimer(1, 200);

    game.catchChaseObject(player_mehdi);
    game.stealChaseObject(player_bebert);

    await timeout(200);
    assert.equal(game.isFinished(), true);
    assert.equal(game.getGuardian(), player_bebert);
    const historyActions = game.getHistory().getHistoryActions();
    assert.equal(
      game.getHistory().getLastElement(historyActions).pseudo,
      player_bebert.pseudo
    );
  });

  it("Scenario 3: Should announce the winner (Many actions)", async () => {
    let game = new Game(players, chaseobject, area);
    let [player_mehdi] = game.getPlayers();
    let player_bebert = game.getPlayers()[1];
    let player_benoit = game.getPlayers()[2];

    await game.BeginTimer(1, 200);

    game.catchChaseObject(player_mehdi);
    game.stealChaseObject(player_bebert);
    game.stealChaseObject(player_benoit);
    game.stealChaseObject(player_bebert);

    await timeout(200);
    assert.equal(game.isFinished(), true);
    assert.equal(game.getGuardian(), player_bebert);
    const historyActions = game.getHistory().getHistoryActions();
    assert.equal(
      game.getHistory().getLastElement(historyActions).pseudo,
      player_bebert.pseudo
    );
  });
  it("Scenario 4: Should calculate an overview result of the game", async () => {
    let game = new Game(players, chaseobject, area);
    let [player_mehdi] = game.getPlayers();
    let player_bebert = game.getPlayers()[1];
    let player_benoit = game.getPlayers()[2];

    await game.BeginTimer(1, 200);

    game.catchChaseObject(player_mehdi);
    game.stealChaseObject(player_bebert);
    game.moveTo(player_mehdi.pseudo, [48.85564, 2.2986304]);
    game.moveTo(player_mehdi.pseudo, [48.855641, 2.2986314]);
    game.moveTo(player_mehdi.pseudo, [48.855642, 2.2986324]);
    game.moveTo(player_mehdi.pseudo, [48.855643, 2.2986324]);
    game.moveTo(player_bebert.pseudo, [48.8574804, 2.2955138]);
    game.stealChaseObject(player_bebert);
    game.moveTo(player_benoit.pseudo, [48.8574804, 2.2955138]);
    game.stealChaseObject(player_benoit);
    game.moveTo(player_bebert.pseudo, [48.8574814, 2.2955148]);
    game.moveTo(player_bebert.pseudo, [48.8574824, 2.2955158]);
    game.moveTo(player_benoit.pseudo, [48.8574804, 2.2955138]);
    game.moveTo(player_benoit.pseudo, [48.8574804, 2.2955138]);

    await timeout(200);

    assert.equal(game.isFinished(), true);
    assert.equal(game.getGuardian(), player_benoit);
    assert.isNumber(game.getResults().total_distance);
    assert.equal(game.getResults().total_steals, 3);
    assert.equal(game.getResults().total_catchs, 1);
    assert.equal(game.getResults().total_skills_used, 0);
  });

  it("Scenario 5: Should calculate a result by player of the game", async () => {
    let game = new Game(players, chaseobject, area);
    let [player_mehdi] = game.getPlayers();
    let player_bebert = game.getPlayers()[1];
    let player_benoit = game.getPlayers()[2];

    await game.BeginTimer(1, 200);

    game.catchChaseObject(player_mehdi);
    game.stealChaseObject(player_bebert);
    game.moveTo(player_mehdi.pseudo, [48.85564, 2.2986304]);
    game.moveTo(player_mehdi.pseudo, [48.855641, 2.2986314]);
    game.moveTo(player_mehdi.pseudo, [48.855642, 2.2986324]);
    game.moveTo(player_mehdi.pseudo, [48.855643, 2.2986324]);
    game.moveTo(player_bebert.pseudo, [48.8574804, 2.2955138]);
    game.stealChaseObject(player_bebert);
    game.moveTo(player_benoit.pseudo, [48.8574804, 2.2955138]);
    game.stealChaseObject(player_benoit);
    game.moveTo(player_bebert.pseudo, [48.8574814, 2.2955148]);
    game.moveTo(player_bebert.pseudo, [48.8574824, 2.2955158]);
    game.moveTo(player_benoit.pseudo, [48.8574804, 2.2955138]);
    game.moveTo(player_benoit.pseudo, [48.8574804, 2.2955138]);

    await timeout(200);

    assert.equal(game.isFinished(), true);
    assert.equal(game.getGuardian(), player_benoit);
    assert.isNumber(game.getResultsByPlayer(player_mehdi).total_distance);
    assert.equal(game.getResultsByPlayer(player_mehdi).total_steals, 0);
    assert.equal(game.getResultsByPlayer(player_mehdi).total_catchs, 1);
    assert.equal(game.getResultsByPlayer(player_mehdi).total_skills_used, 0);
    assert.equal(game.getResultsByPlayer(player_mehdi).skills_used, null);
  });

  it("Should update the players XP's and Levels");
});
