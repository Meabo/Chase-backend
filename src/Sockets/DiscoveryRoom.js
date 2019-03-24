const colyseus = require('colyseus');
const { gameServer, methods } = require('./SocketServer');

class Discovery extends colyseus.Room {
	// When room is initialized
	onInit(options) {
		this.setState({
			history: [],
			messages: [],
			areas: options.areas
		});
	}

	// Checks if a new client is allowed to join. (default: `return true`)
	requestJoin(options, isNew) {
		return true;
	}

	// Authorize client based on provided options before WebSocket handshake is complete
	//onAuth(options) {}

	// When client successfully join the room
	onJoin(client, options, auth) {
		console.log(`${client.sessionId} join Discovery.`);
		this.state.history.push(`${client.sessionId} joined Discovery.`);
	}

	// When a client sends a message
	onMessage(client, data) {
		console.log('client sends message', data);
		if (data.action === 'joinarea') {
			this.onLeave(client, true);
		}
		this.state.messages.push(data);
	}

	// When a client leaves the room
	onLeave(client, consented) {
		console.log(`${client.sessionId} left.`);
		this.state.history.push(`${client.sessionId} left.`);
	}

	// Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
	onDispose() {}
}

module.exports = Discovery;
