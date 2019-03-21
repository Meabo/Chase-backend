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
		let area;
		let chaseobject;
		let game;
		const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
		let player1;
		let player2;
		let player3;
		const socketUrlGame = 'http://localhost:3000/games';

		function get_bounds() {
			const top_left = [ 48.8569443, 2.2940138 ];
			const top_right = [ 48.8586221, 2.2963717 ];
			const bot_left = [ 48.8523546, 2.3012814 ];
			const bot_right = [ 48.8539637, 2.3035665 ];
			return [ top_left, top_right, bot_left, bot_right ];
		}

		beforeEach(() => {
			player1 = new Player('Mehdi', [ 48.8556475, 2.2986304 ], ioClient.connect(socketUrlGame, options));
			player2 = new Player('Bebert', [ 48.8574884, 2.2955138 ], ioClient.connect(socketUrlGame, options));
			player3 = new Player('Red', [ 48.8574886, 2.2955128 ], ioClient.connect(socketUrlGame, options));
			player4 = new Player('Col', [ 48.8574886, 2.2955128 ], ioClient.connect(socketUrlGame, options));
			let players = [];
			players.push(player1, player2, player3, player4);
			chaseobject = new ChaseObject([ 48.8574884, 2.2955138 ]);
			area = new Area(get_bounds());
			game = new Game(players, chaseobject, area);
			game.attach(socketServer);
		});

		afterEach(() => {
			game.getPlayers().map((player) => player.getSocket().disconnect());
		});

		it('Send location of the ChaseObject to players in the game', async () => {
			let players_acknowledged = 0;
			await game.playersInit();

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
				setTimeout(async () => {
					await game.sendChaseObjectLocation();
				}, 20);
			});
		});

		it('Send an event to players in the game : Catch the ChaseObject', async () => {
			let counterGuardian = 0;
			let counterChasers = 0;
			await game.playersInit();

			const socket = player1.getSocket();
			return new Promise((resolve, reject) => {
				socket.on('connect', () => {
					socket.on('newGuardian', function(msg) {
						assert.equal(msg, 'You are the new guardian');
						counterGuardian++;
						if (counterGuardian === 1 && counterChasers === game.getPlayers().length - 1) resolve(true);
					});
				});
				game.getPlayers().filter((player) => player.pseudo !== player1.pseudo).map((player) => {
					const socket = player.getSocket();
					socket.on('connect', () => {
						socket.on('newGuardian', function(payload) {
							assert.equal(payload.pseudo, player1.pseudo);
							counterChasers++;
						});
					});
				});

				setTimeout(async function() {
					game.catchChaseObject(player1);
				}, 20);
			});
		});
		it('Send an event to players in the game : Steal the ChaseObject', async () => {
			let counterGuardian = 0;
			let counterChasers = 0;
			await game.playersInit();
			game.setGuardian(player1);
			const socket = player2.getSocket();
			return new Promise((resolve, reject) => {
				socket.on('connect', () => {
					socket.on('newGuardianSteal', function(msg) {
						assert.equal(msg, 'You are the new guardian');
						counterGuardian++;
						if (counterGuardian === 1 && counterChasers === game.getPlayers().length - 1) resolve(true);
					});
				});
				game.getPlayers().filter((player) => player.pseudo !== player2.pseudo).map((player) => {
					const socket = player.getSocket();
					socket.on('connect', () => {
						socket.on('newGuardianSteal', function(payload) {
							assert.equal(payload.pseudo, player2.pseudo);
							counterChasers++;
						});
					});
				});

				setTimeout(async function() {
					game.stealChaseObject(player2);
				}, 100);
			});
		});
		it('Send location of the Guardian to players');
		it('Players should receive only Guardian location (not players ones)');
	});
});
