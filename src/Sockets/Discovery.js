const colyseus = require('colyseus');

class Discovery extends colyseus.Room {
	// When room is initialized
	onInit(options) {
		this.setState({ messages: [] });
	}

	// Checks if a new client is allowed to join. (default: `return true`)
	requestJoin(options, isNew) {
		return true;
	}

	// Authorize client based on provided options before WebSocket handshake is complete
	//onAuth(options) {}

	// When client successfully join the room
	onJoin(client, options, auth) {
		console.log('test');
		this.state.messages.push(`${client.sessionId} joined.`);
	}

	// When a client sends a message
	onMessage(client, message) {
		this.state.messages.push(data);
	}

	// When a client leaves the room
	onLeave(client, consented) {}

	// Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
	onDispose() {}
}

module.exports = Discovery;
