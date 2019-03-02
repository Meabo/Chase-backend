const { expect, assert } = require("chai");
const ChaseMap = require("../src/ChaseMap");

describe("ChaseMap engine", () => {
  let bounds;
  before(() => {
    let top_left = [48.8569443, 2.2940138];
    let top_right = [48.8586221, 2.2963717];
    let bot_left = [48.8523546, 2.3012814];
    let bot_right = [48.8539637, 2.3035665];
    bounds = [top_left, top_right, bot_left, bot_right];
  });

  it("Creates a ChaseMap", async () => {
    let chasemap = new ChaseMap();
    assert.instanceOf(chasemap, ChaseMap);
  });

  it("Creates a ChaseMap with bounds", async () => {
    let chasemap = new ChaseMap(bounds);
    assert.deepEqual(chasemap.getBounds(), bounds);
  });
});
