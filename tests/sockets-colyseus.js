const ioClient = require('socket.io-client');
const socketUrl = 'ws://localhost:3000';
const { gameServer } = require('../src/Sockets/SocketServer');
const { Client } = require('colyseus.js');
const { assert } = require('chai');

const Game = require('../src/Game');
const Player = require('../src/Player');
const ChaseObject = require('../src/ChaseObject');

const options = {
	transports: [ 'websocket' ],
	'force new connection': true
};

describe('Colyseus : Unit test on Events', async () => {
	before(() => {
		gameServer.listen(3000, () => {});
	});

	after(() => {
		gameServer.gracefullyShutdown();
	});

	describe('Basic Connection', () => {
		let client;
		beforeEach(async () => {
			client = new Client(socketUrl);
		});
		afterEach(async () => {
			client.close();
		});
		it('Should check that the socket is connected', (done) => {
			client.onOpen.add(function() {
				done();
			});
			client.onError.add(function(err) {
				console.log('something wrong happened:', err.message);
			});
		});
	});

	describe('Welcome to Discovery', () => {
		let player1;
		let player2;
		let player3;

		beforeEach(() => {
			player1 = new Client('ws://localhost:3000');
			player2 = new Client('ws://localhost:3000');
			player3 = new Client('ws://localhost:3000');
		});

		afterEach(() => {
			player1.close();
			player2.close();
			player3.close();
		});

		it('Players should receive a Welcome message', (done) => {
			const listenerPlayer1 = player1.join('discovery');
			listenerPlayer1.onJoin.add(() => {
				console.log(`${listenerPlayer1.sessionId} joined!`);
			});
			listenerPlayer1.onStateChange.add((state) => {
				console.log('new state:', state);
			});
			listenerPlayer1.listen('messages/:index', (change) => {
				console.log(change.operation); // ~> "add"
				console.log(change.path.index); // ~> "1"
				console.log(change.value); // ~> "Hello world!"
			});
		});
	});
});
/* 
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
});

describe('Socket.io: Functionnal tests with Game Engine', async () => {
	let game;
	const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
	let player1;
	let player2;
	let player3;
	let player4;
	const socketUrlGame = 'http://localhost:3000/games';

	beforeEach(async () => {
		socketServer.http.listen(3000, () => {});
		const init = new Promise(async (resolve, reject) => {
			player1 = new Player('Mehdi', [ 48.8556475, 2.2986304 ], ioClient.connect(socketUrlGame, options));
			player2 = new Player('Bebert', [ 48.8574884, 2.2955138 ], ioClient.connect(socketUrlGame, options));
			player3 = new Player('Red', [ 48.8574886, 2.2955128 ], ioClient.connect(socketUrlGame, options));
			player4 = new Player('Col', [ 48.8574889, 2.2955121 ], ioClient.connect(socketUrlGame, options));
			let players = [];
			players.push(player1, player2, player3, player4);
			game = new Game(players, new ChaseObject([ 48.8574884, 2.2955138 ]), null);
			game.attach(socketServer);
			resolve(true);
		});
		await init;
		await game.playersInit();
		await timeout(200);
	});

	afterEach(async () => {
		game.getPlayers().map((player) => player.getSocket().disconnect());
		socketServer.http.close();
	});

	describe('Game actions', async () => {
		it('Send location of the ChaseObject to players in the game', async () => {
			await game.sendChaseObjectLocation();
			const resultPromises = await Promise.all(
				game.getPlayers().map((player) => {
					return new Promise((resolve, reject) => {
						player.getSocket().on('chaseObject', function(loc) {
							assert.deepEqual(loc, game.getChaseObject().getLocation());
							resolve(1);
						});
					});
				})
			);
			assert.equal(resultPromises.reduce((acc, cur) => acc + cur, 0), game.getPlayers().length);
		});

		it('Send an event to players in the game : Catch the ChaseObject', async () => {
			const guardianPromise = new Promise((resolve, reject) => {
				player1.getSocket().on('newGuardian', function(msg) {
					assert.equal(msg, 'You are the new guardian');
					resolve(1);
				});
			});
			const chasersPromise = game
				.getPlayers()
				.filter((player) => player.pseudo !== player1.pseudo)
				.map((player) => {
					return new Promise((resolve, reject) => {
						const socket = player.getSocket();
						socket.on('newGuardian', function(payload) {
							assert.equal(payload.pseudo, player1.pseudo);
							resolve(1);
						});
					});
				});

			await game.catchChaseObject(player1);
			const resultPromises = await Promise.all(chasersPromise.concat([ guardianPromise ]));
			assert.equal(resultPromises.reduce((acc, cur) => acc + cur, 0), game.getPlayers().length);
		});

		it('Send an event to players in the game : Steal the ChaseObject', async () => {
			const socketGuardian = new Promise((resolve, reject) => {
				player2.getSocket().on('newGuardianSteal', function(msg) {
					assert.equal(msg, 'You are the new guardian');
					resolve(1);
				});
			});

			const socketChasers = game
				.getPlayers()
				.filter((player) => player.pseudo !== player2.pseudo)
				.map((player) => {
					return new Promise((resolve, reject) => {
						const socket = player.getSocket();
						socket.on('newGuardianSteal', function(payload) {
							assert.equal(payload.pseudo, player2.pseudo);
							resolve(1);
						});
					});
				});

			game.setGuardian(player1);
			await game.stealChaseObject(player2);
			const resultPromises = await Promise.all(socketChasers.concat([ socketGuardian ]));
			assert.equal(resultPromises.reduce((acc, cur) => acc + cur, 0), game.getPlayers().length);
		});

		it('Before Catch Event: Send location of Players to Players', async () => {
			let counter = 0;

			const socketsListeners = game.getPlayers().map((player) => {
				return new Promise((resolve, reject) => {
					player.getSocket().on('location', (payload) => {
						counter++;
						resolve(1);
					});
				});
			});

			const socketEmitters = new Promise((resolve, reject) => {
				player1.getSocket().emit('location', { pseudo: player1.pseudo, location: player1.getLocation() });
				player2.getSocket().emit('location', { pseudo: player2.pseudo, location: player2.getLocation() });
				player3.getSocket().emit('location', { pseudo: player3.pseudo, location: player3.getLocation() });
				player4.getSocket().emit('location', { pseudo: player4.pseudo, location: player4.getLocation() });
				resolve();
			});
			await socketEmitters;
			await Promise.all(socketsListeners);
			assert.equal(counter, game.getPlayers().length * (game.getPlayers().length - 1));
		});
		it('Send location of the Guardian to players', async () => {
			const socketEmitters = new Promise((resolve, reject) => {
				game.moveTo(player1.getPseudo(), player1.getLocation());
				game.moveTo(player2.getPseudo(), player2.getLocation());
				game.moveTo(player3.getPseudo(), player3.getLocation());
				game.moveTo(player4.getPseudo(), player4.getLocation());

				resolve();
			});

			await game.catchChaseObject(player1);
			await socketEmitters;
		});
		it('Players should receive only Guardian location (not players ones)');
	});
});
 */
