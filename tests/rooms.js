const { expect, assert } = require("chai");
const User = require("../src/User");
const Area = require("../src/Area");
const Discover = require("../src/Discover");

describe("Rooms", () => {
  const discover = new Discover();
  let areas = [];
  let area;
  const userLoc = [48.850198, 2.2973423];
  const loc = [48.8556475, 2.2986304];

  before(async () => {
    let top_left = [48.8569443, 2.2940138];
    let top_right = [48.8586221, 2.2963717];
    let bot_left = [48.8523546, 2.3012814];
    let bot_right = [48.8539637, 2.3035665];
    area = new Area(loc, [top_left, top_right, bot_left, bot_right]);
    areas.push(area);
    discover.initAreas(areas);
  });

  it("should create a room inside an area", async done => {
    done("not implemented yet");
  });

  it("should join a room inside an area", async done => {
    done("not implemented yet");
  });

  it("should update current count of the room", async done => {
    done("not implemented yet");
  });

  it("should acknowledge other players when a user joins", async done => {
    done("not implemented yet");
  });

  it("should set state ready in the room", async done => {
    done("not implemented yet");
  });

  it("should acknowledge other players when a user is ready", async done => {
    done("not implemented yet");
  });
});
