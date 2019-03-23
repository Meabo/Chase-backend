const colyseus = require('colyseus');

export class AreaRoom extends colyseus.Room {
	// When room is initialized
	onInit(options) {}

	// Checks if a new client is allowed to join. (default: `return true`)
	requestJoin(options, isNew) {}

	// Authorize client based on provided options before WebSocket handshake is complete
	onAuth(options) {}

	// When client successfully join the room
	onJoin(client, options, auth) {}

	// When a client sends a message
	onMessage(client, message) {}

	// When a client leaves the room
	onLeave(client, consented) {}

	// Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
	onDispose() {}
}
