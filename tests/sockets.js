const io = require("socket.io");
const ioClient = require("socket.io-client");
const socketUrl = "http://localhost:5000";
const { assert } = require("chai");

const options = {
  transports: ["websocket"],
  "force new connection": true
};

describe("Socket.io : Server", () => {
  let server;
  let client;

  beforeEach(async () => {
    server = io().listen(5000);
    client = ioClient.connect(socketUrl, options);
    console.log("before", client);
  });

  afterEach(async () => {
    server.close();
    client.close();
  });

  it("Should check that the socket is connected", async () => {
    console.log("test", client);

    client.on("connect", async () => {
      console.log(client);
      assert.equal(client.connected, true);
      client.disconnect();
    });
  });
});

describe("Socket.io : Emits Player's Location", function() {
  let server;
  let player1;
  let player2;
  let player3;

  beforeEach(() => {
    server = io().listen(5000);
    player1 = ioClient.connect(socketUrl, options);
    player2 = ioClient.connect(socketUrl, options);
    player3 = ioClient.connect(socketUrl, options);
  });

  afterEach(() => {
    server.close();
    player1.close();
    player2.close();
    player3.close();
  });

  it("player 2 and 3 should receive location of player 1", async () => {
    player2.on("connect", () => {
      player2.on("player_location", loc => {
        console.log("Loc", loc);
        assert.equal(loc.pseudo, "Mei");
        assert.lengthOf(loc, 1);
        done();
      });
    });

    player1.emit("player_location", {
      pseudo: "Mehdi",
      prev_location: [48.8569443, 2.2940138],
      location: [48.8586221, 2.2963717],
      timestamp: Date.now()
    });
  });
});
