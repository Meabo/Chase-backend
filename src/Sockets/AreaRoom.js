const colyseus = require('colyseus');
const emitter = require('../Emitter/emitter');

class AreaRoom extends colyseus.Room {
	// When room is initialized
	onInit(options) {
		//let socketServerInstance = new SocketServer().getInstance();
		//console.log(this);
		this.setState({
			history: [],
			messages: [],
			area: options.area,
			methods: options.methods
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
		console.log(`${client.sessionId} join Area.`);
		this.state.history.push(`${client.sessionId} joined AreaRoom.`);
	}

	// When a client sends a message
	onMessage(client, data) {
		if (data.action === 'joingameroom') {
			console.log('GameServer');
			emitter.eventBus.sendEvent('createGameRoom', data);
			//socketServerInstance.createGameRoom(data);
			this.onLeave(client, true);
		}
	}

	// When a client leaves the room
	onLeave(client, consented) {
		this.state.history.push(`${client.sessionId} left AreaRoom.`);
	}

	// Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
	onDispose() {}
}

module.exports = AreaRoom;
