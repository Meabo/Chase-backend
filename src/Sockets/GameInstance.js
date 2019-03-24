const colyseus = require('colyseus');
const emitter = require('../Emitter/emitter');

class GameInstance extends colyseus.Room {
	// When room is initialized
	onInit(options) {
		this.setState({
			history: [],
			players: [],
			ready: []
		});
	}

	// Checks if a new client is allowed to join. (default: `return true`)
	requestJoin(options, isNew) {
		return true;
	}
	// Authorize client based on provided options before WebSocket handshake is complete
	/*onAuth(options) {
		return true;
	}*/

	// When client successfully join the room
	onJoin(client, options, auth) {
		console.log(`${client.sessionId} join GameInstance.`);
		this.state.history.push(`${client.sessionId} joined GameInstance.`);
	}

	// When a client sends a message
	onMessage(client, data) {}

	// When a client leaves the room
	onLeave(client, consented) {
		this.state.history.push(`${client.sessionId} left GameInstance.`);
	}

	// Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
	onDispose() {}
}

module.exports = GameInstance;
