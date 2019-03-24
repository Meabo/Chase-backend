const app = require('express')();
const http = require('http');
const colyseus = require('colyseus');

const Discovery = require('./DiscoveryRoom');
const AreaRoom = require('./AreaRoom');
const GameLobby = require('./GameLobby');
const GameInstance = require('./GameInstance');

const emitter = require('../Emitter/emitter');

const gameServer = new colyseus.Server({
	server: http.createServer(app),
	verifyClient: function(info, next) {
		next(true);
		// validate 'info'
		//
		// - next(false) will reject the websocket handshake
		// - next(true) will accept the websocket handshake
	}
});

emitter.eventBus.on('createGameLobby', function(data) {
	methods.createGameLobby(data);
});

emitter.eventBus.on('createGame', function(data) {
	methods.createGame(data);
});

const methods = {
	getGameServer: () => {
		return gameServer;
	},
	init: (areas) => {
		methods.createDiscoveryRoom(areas);
		methods.createAreasRoom(areas);
	},

	createDiscoveryRoom: (areas) => {
		gameServer.register('discovery', Discovery, { areas: areas });
	},
	createAreasRoom: (areas) => {
		if (areas) {
			areas.map((area) => {
				gameServer.register(area.getName(), AreaRoom, { area: area, methods: this.methods });
			});
		}
	},
	createGameLobby: (data) => {
		gameServer.register(data.name, GameLobby, data);
	},
	createGame: (data) => {
		gameServer.register(data.name, GameInstance, data);
	}
};

module.exports = {
	gameServer: gameServer,
	methods: methods
};
