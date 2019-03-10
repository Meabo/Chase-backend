const { expect, assert } = require("chai");
const User = require("../src/User");
const Area = require("../src/Area");
const Discover = require("../src/Discover");

// TIPS : Use RxJs and Sockets
// Needed: RoomsRepository
describe("Rooms", () => {
  before(async () => {});

  it("a player joins a room if the location matches");

  it("a player quits a room");

  it("should update current count of the room");

  it("set state ready of a player in the room");

  it("fails if a user tries to join a room but he has already joined one");

  it("acknowledge other players when a user is ready");

  it("sends a call to every users when everybody is ready");
});
