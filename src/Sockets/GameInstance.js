const colyseus = require('colyseus');
const emitter = require('../Emitter/emitter');
const Game = require('../Game');
const ChaseObject = require('../ChaseObject');
class GameInstance extends colyseus.Room {
	// When room is initialized
	onInit(options) {
		this.setState({
			name: options.name,
			history: [],
			players: [],
			gameInstance: new Game([], new ChaseObject([ 48.8556475, 2.2986304 ]), options.area),
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
		this.state.history.push({ action: 'join', payload: `${client.sessionId} joined ${this.state.name}.` });
	}

	// When a client sends a message
	onMessage(client, data) {}

	// When a client leaves the room
	onLeave(client, consented) {
		this.state.history.push({
			action: 'leave',
			payload: `${client.sessionId} left ${this.state.name}.`
		});
		this.setState({
			players: this.state.players.filter((player) => player.clientId !== client.id)
		});
	}

	// Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
	onDispose() {}
}

module.exports = GameInstance;
