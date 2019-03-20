const ioClient = require('socket.io-client');
const socketUrl = 'http://localhost:3000';
const { assert } = require('chai');
const socketServer = require('../src/server-socket');
const Game = require('../src/Game');
const Player = require('../src/Player');
const ChaseObject = require('../src/ChaseObject');
const Area = require('../src/Area');

const options = {
	transports: [ 'websocket' ],
	'force new connection': true
};

describe('Socket.io : Events', async () => {
	beforeEach(async () => {
		socketServer.http.listen(3000, () => {});
	});

	afterEach(async () => {
		socketServer.http.close();
	});

	describe('Basic Connection', () => {
		let client;
		beforeEach(async () => {
			client = ioClient.connect(socketUrl, options);
		});
		afterEach(async () => {
			client.disconnect();
		});
		it('Should check that the socket is connected', (done) => {
			client.on('connect', () => {
				assert.equal(client.connected, true);
				done();
			});
		});
	});

	describe('Area: Rooms with Players', () => {
		let player1;
		let player2;
		let player3;
		const socketUrlRooms = 'http://localhost:3000/rooms';

		beforeEach(() => {
			player1 = ioClient.connect(socketUrlRooms, options);
			player2 = ioClient.connect(socketUrlRooms, options);
			player3 = ioClient.connect(socketUrlRooms, options);
		});

		afterEach(() => {
			player1.disconnect();
			player2.disconnect();
			player3.disconnect();
		});

		it('Players should receive a Welcome message', (done) => {
			player1.on('connect', () => {
				player1.on('welcome', (message) => {
					assert.equal(message, 'Welcome to the Area');
				});
			});
			player2.on('connect', () => {
				player2.on('welcome', (message) => {
					assert.equal(message, 'Welcome to the Area');
				});
			});
			player3.on('connect', () => {
				player3.on('welcome', (message) => {
					assert.equal(message, 'Welcome to the Area');
					done();
				});
			});
		});
	});

	describe('Joining & Leave room', () => {
		let player1;
		let player2;
		let player3;
		let player4;

		const socketUrlRooms = 'http://localhost:3000/rooms';

		beforeEach(() => {
			player1 = ioClient.connect(socketUrlRooms, options);
			player2 = ioClient.connect(socketUrlRooms, options);
			player3 = ioClient.connect(socketUrlRooms, options);
			player4 = ioClient.connect(socketUrlRooms, options);
		});

		afterEach(() => {
			player1.disconnect();
			player2.disconnect();
			player3.disconnect();
			player4.disconnect();
		});

		it('Players should join different rooms', (done) => {
			player1.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
			});
			player1.on('welcomeroom', function(message) {
				assert.equal(message, 'Welcome to 12');
			});
			player2.emit('joinroom', '13', function(res) {
				assert.equal(res, 'success');
			});
			player2.on('welcomeroom', function(message) {
				assert.equal(message, 'Welcome to 13');
				done();
			});
		});

		it('Players should receive an error if they join a room but they already joined', (done) => {
			player3.emit('joinroom', '12', function(res, rooms) {
				assert.equal(res, 'success');
				player3.emit('joinroom', '13', function(res) {
					assert.equal(res, 'error');
					done();
				});
			});
		});

		it('Players should receive an error if they try to leave without joining before', (done) => {
			player4.emit('leaveroom', '12', function(res) {
				assert.equal(res, 'error');
				done();
			});
		});
	});

	describe('Ready in the room', () => {
		let player1;
		let player2;
		let player3;
		let player4;

		const socketUrlRooms = 'http://localhost:3000/rooms';

		beforeEach(() => {
			player1 = ioClient.connect(socketUrlRooms, options);
			player2 = ioClient.connect(socketUrlRooms, options);
			player3 = ioClient.connect(socketUrlRooms, options);
			player4 = ioClient.connect(socketUrlRooms, options);
		});

		afterEach(() => {
			player1.disconnect();
			player2.disconnect();
			player3.disconnect();
			player4.disconnect();
		});

		it('Players should set ready and ack other players', (done) => {
			player1.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
				player1.emit('ready', function(res, readyStatus) {
					assert.equal(res, 'success');
					assert.equal(readyStatus, true);
				});
			});
			player2.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
				player3.emit('joinroom', '12', function(res) {
					assert.equal(res, 'success');
				});
				player2.on('userReady', function(message) {
					assert.equal(message, player1.id + 'is ready');
					done();
				});
			});
		});

		it('Should ack players when everyone is ready', (done) => {
			player1.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
				player1.emit('ready', function(res, readyStatus) {
					assert.equal(res, 'success');
					assert.equal(readyStatus, true);
				});
			});
			player2.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');
				player2.emit('ready', function(res, readyStatus) {
					assert.equal(res, 'success');
					assert.equal(readyStatus, true);
				});
			});
			player3.emit('joinroom', '12', function(res) {
				assert.equal(res, 'success');

				player3.emit('ready', function(res, readyStatus) {
					assert.equal(res, 'success');
					assert.equal(readyStatus, true);
				});
				player1.on('everyoneReady', function(message) {
					assert.equal(message, true);
					done();
				});
			});
		});

		it('Should ack the creator when everyone is ready');
	});

	describe('Game actions', () => {
		let players = [];
		let area;
		let chaseobject;
		let game;
		const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

		const socketUrlGame = 'http://localhost:3000/games';

		function get_bounds() {
			const top_left = [ 48.8569443, 2.2940138 ];
			const top_right = [ 48.8586221, 2.2963717 ];
			const bot_left = [ 48.8523546, 2.3012814 ];
			const bot_right = [ 48.8539637, 2.3035665 ];
			return [ top_left, top_right, bot_left, bot_right ];
		}

		beforeEach(() => {
			const player1 = new Player('Mehdi', [ 48.8556475, 2.2986304 ], ioClient.connect(socketUrlGame, options));
			const player2 = new Player('Bebert', [ 48.8574884, 2.2955138 ], ioClient.connect(socketUrlGame, options));
			const player3 = new Player('Red', [ 48.8574886, 2.2955128 ], ioClient.connect(socketUrlGame, options));
			players.push(player1, player2, player3);
			chaseobject = new ChaseObject([ 48.8574884, 2.2955138 ]);
			area = new Area(get_bounds());
			game = new Game(players, chaseobject, area);
			game.attach(socketServer.gameHooks);
		});

		afterEach(() => {
			game.getPlayers().map((player) => player.getSocket().disconnect());
		});

		it('Send location of the ChaseObject to players in the game', async () => {
			let players_acknowledged = 0;
			return new Promise(function(resolve, reject) {
				game.getPlayers().map((player) => {
					player.getSocket().on('connect', () => {
						player.getSocket().on('chaseObject', function(loc) {
							assert.deepEqual(loc, game.getChaseObject().getLocation());
							players_acknowledged++;
							if (players_acknowledged === game.getPlayers().length - 1) {
								resolve(true);
							}
						});
					});
				});
				setTimeout(function() {
					game.sendChaseObjectLocation();
				}, 200);
			});

			/*
				
				if (players_acknowledged === game.getPlayers().length) {
					done();
				}*/
		});

		it('Player 2 and 3 should receive location of player 1', (done) => {
			/*player_socket_1.emit('player_location', {
				pseudo: 'Mehdi',
				prev_location: [ 48.8569433, 2.2940138 ],
				location: [ 48.8586221, 2.2963717 ],
				timestamp: Date.now()
			});

			player_socket_2.on('player_location', (loc) => {
				assert.equal(loc.pseudo, 'Mehdi');
				player3.on('player_location', (loc) => {
					assert.equal(loc.pseudo, 'Mehdi');
					done();
				});
			});*/
			done();
		});
	});

	it('Send an event to players in the game : Catch the ChaseObject');
	it('Send an event to players in the game : Steal the ChaseObject');
	it('Send location of the Guardian to players');
	it('Players should receive only Guardian location (not players ones)');
});
