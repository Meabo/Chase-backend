const { expect, assert } = require("chai");
const sinon = require("sinon");
const User = require("../src/User");

describe("Create a Player Profile", () => {
  let new_user;

  before(() => {
    new_user = new User("aboumehdi.pro@gmail.com");
  });

  it("Should create a Profile", async () => {
    new_user.createProfile("Mehdi", "Abou", new Date("08/10/1992"));
    assert.deepEqual(new_user.getUserProfile(), {
      first_name: "Mehdi",
      last_name: "Abou",
      born_date: new Date("08/10/1992")
    });
  });

  it("Should create a Player Profile", async () => {
    new_user.createPlayerProfile("meabo", "1", "attack");
    assert.deepEqual(new_user.getUserPlayerProfile(), {
      pseudo: "meabo",
      avatar_id: "1",
      player_type: "attack"
    });
  });

  it("Should update a profile");
});
