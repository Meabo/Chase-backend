const { Subject, from } = require("rxjs");

class Area {
  constructor(location, bounds, name) {
    this.location = location;
    this.bounds = bounds;
    this.name = name;
    this.rooms = new Array();
  }

  getRooms() {
    return this.rooms;
  }

  getPlayersArea() {
    let players = [];
    [...this.rooms].map(room =>
      room.getPlayers().map(player => players.push(player))
    );
    return players;
  }

  getPlayersCounter() {
    const counter = [...this.rooms].reduce(
      (acc, room) => acc + room.getPlayers().length,
      0
    );
    return counter;
  }
  createRoom() {
    return this.rooms.push(new Room()) - 1;
  }

  getName() {
    return this.name;
  }
  getLocation() {
    return this.location;
  }

  getBounds() {
    return this.bounds;
  }
}

class Room {
  constructor() {
    this.players = [];
    this.playersSubject = new Subject();
  }
  getRoomSubject() {
    return this.playersSubject;
  }

  join(player) {
    this.players.push(player);
    this.playersSubject.next({ action: "join", players: this.players });
  }

  leave(pseudo) {
    this.players = this.players.filter(player_ => player_.pseudo !== id);
    this.playersSubject.next({ action: "leave", players: this.players });
  }
  getPlayers() {
    return this.players;
  }
}

module.exports = Area;
