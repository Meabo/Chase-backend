const { expect, assert } = require("chai");
const History = require("../src/History");
const Player = require("../src/Player");

describe("History", () => {
  before(async () => {});

  it("Should add a move and a timestamp in the history", async () => {
    const history = new History();
    const location = [48.8569443, 2.2940138];
    history.addMove(location, Date.now());
    assert.equal(history.getHistoryMoves().length, 1);
  });

  it("Should add a catch and a timestamp in the history", async () => {
    const history = new History();
    let pseudo = "Mehdi";
    const location = [48.8569443, 2.2940138];
    history.addCatch("catch", pseudo, location, Date.now());
    assert.equal(history.getHistoryActions().length, 1);
  });

  it("Should add a steal and a timestamp in the history", async () => {
    const history = new History();
    let pseudo = "Mehdi";
    let pseudo_stealed = "Victim";
    const location = [48.8569443, 2.2940138];
    history.addSteal("steal", pseudo, pseudo_stealed, location, Date.now());
    assert.equal(history.getHistoryActions().length, 1);
  });
});
