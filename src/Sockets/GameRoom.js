const colyseus = require('colyseus');

class GameRoom extends colyseus.Room {
	// When room is initialized
	onInit(options) {
		this.setState({
			history: [],
			players: []
		});
	}

	// Checks if a new client is allowed to join. (default: `return true`)
	requestJoin(options, isNew) {
		console.log(options);
		console.log(isNew);

		return true;
	}

	// Authorize client based on provided options before WebSocket handshake is complete
	//onAuth(options) {}

	// When client successfully join the room
	onJoin(client, options, auth) {
		console.log(`${client.sessionId} join GameRoom.`);
		this.state.history.push(`${client.sessionId} joined GameRoom.`);
	}

	// When a client sends a message
	onMessage(client, data) {}

	// When a client leaves the room
	onLeave(client, consented) {
		this.state.history.push(`${client.sessionId} left GameRoom.`);
	}

	// Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
	onDispose() {}
}

module.exports = GameRoom;
