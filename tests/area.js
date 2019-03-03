const { expect, assert } = require("chai");
const Area = require("../src/Area");

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

  it("Creates a Area", async () => {
    let area = new Area();
    assert.instanceOf(area, Area);
  });

  it("Creates a Area with a loc and bounds", async () => {
    let area = new Area(loc, bounds);
    assert.deepEqual(area.getBounds(), bounds);
  });
});
